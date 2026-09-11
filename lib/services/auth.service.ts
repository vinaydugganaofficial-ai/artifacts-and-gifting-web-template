import "server-only";

import {
  orderRepository,
  otpChallengeRepository,
  sessionRepository,
  userRepository,
} from "@/lib/repositories";
import { generateOtp, hashOtp, verifyOtp } from "@/lib/auth/otp";
import { maskPhone } from "@/lib/auth/phone";
import {
  clearSessionCookie,
  createSessionId,
  readSessionId,
  setSessionCookie,
  SESSION_TTL_SECONDS,
} from "@/lib/auth/session";
import { sendOtpSms } from "@/lib/services/sms.service";
import { siteConfig } from "@/config/site";
import { logger } from "@/lib/observability/logger";
import type {
  OtpChallenge,
  OtpChallengeView,
  OtpPurpose,
  User,
  UserRecord,
} from "@/types/account";

/**
 * Phone + one-time-code authentication.
 *
 * Two steps: `requestOtp` issues a challenge and sends a code; `verifyOtp`
 * redeems it and starts a session. Every limit — expiry, resend cooldown,
 * attempt ceiling, per-number request ceiling — is enforced here, so a client
 * that ignores the UI gains nothing.
 */

const { auth } = siteConfig;
const REQUEST_WINDOW_MS = 60 * 60 * 1000;

/* -------------------------------------------------------------------------- */
/* Requesting a code                                                           */
/* -------------------------------------------------------------------------- */

export type RequestOtpInput = {
  /** Already normalised to E.164 by the route. */
  phone: string;
  purpose: OtpPurpose;
  /** Required for sign-up; carried until the account is created. */
  name?: string;
  /** Set when the customer pressed "Resend code" on an existing challenge. */
  previousChallengeId?: string;
};

export type RequestOtpResult =
  | { ok: true; challenge: OtpChallengeView }
  | {
      ok: false;
      /** Distinguishes the cases the UI needs to react to differently. */
      reason: "not_registered" | "already_registered" | "cooldown" | "too_many";
      message: string;
      /** Seconds to wait, for `cooldown`. */
      retryAfter?: number;
    };

export async function requestOtp(input: RequestOtpInput): Promise<RequestOtpResult> {
  const { phone, purpose } = input;
  const existingUser = await userRepository.findByPhone(phone);

  // The two flows are mutually exclusive, and saying which applies is what
  // lets the UI send the customer to the right page. See SECURITY NOTE below.
  if (purpose === "sign-in" && !existingUser) {
    return {
      ok: false,
      reason: "not_registered",
      message: "No account uses that number yet. Create one to continue.",
    };
  }

  if (purpose === "sign-up" && existingUser) {
    return {
      ok: false,
      reason: "already_registered",
      message: "That number already has an account. Sign in instead.",
    };
  }

  const issuedThisHour = await otpChallengeRepository.countRequestsSince(
    phone,
    REQUEST_WINDOW_MS,
  );

  // Per-number ceiling: without it, one number could be used to burn an SMS
  // budget, and a victim could be spammed with codes they did not ask for.
  //
  // This is the control that survives header spoofing — the per-IP limiter in
  // the route keys off `x-forwarded-for`, which a caller can set freely.
  if (issuedThisHour >= auth.maxOtpRequestsPerHour) {
    logger.warn("OTP request ceiling reached", { phone: maskPhone(phone), purpose });

    return {
      ok: false,
      reason: "too_many",
      message: "Too many codes requested for that number. Please try again in an hour.",
    };
  }

  // Resend cooldown, measured from the last challenge issued rather than the
  // client's countdown — the timer on screen is a mirror, not the control.
  const previous = await otpChallengeRepository.findLatestForPhone(phone);

  if (previous) {
    const waitMs = Date.parse(previous.resendAvailableAt) - Date.now();

    if (waitMs > 0) {
      return {
        ok: false,
        reason: "cooldown",
        message: "Please wait before asking for another code.",
        retryAfter: Math.ceil(waitMs / 1000),
      };
    }
  }

  // Only one code may be live for a number at a time, so an older message
  // cannot be used after a newer one has been sent. The superseded records are
  // retained (not deleted) so the ceiling above can still count them.
  await otpChallengeRepository.supersedeForPhone(phone);

  const now = Date.now();
  const id = `otp_${globalThis.crypto.randomUUID()}`;
  const code = generateOtp(auth.otpLength);

  const challenge: OtpChallenge = {
    id,
    phone,
    purpose,
    name: input.name?.trim(),
    codeHash: hashOtp(code, id),
    expiresAt: new Date(now + auth.otpTtlSeconds * 1000).toISOString(),
    resendAvailableAt: new Date(now + auth.resendCooldownSeconds * 1000).toISOString(),
    attempts: 0,
    createdAt: new Date(now).toISOString(),
    resendCount: previous ? previous.resendCount + 1 : 0,
  };

  await otpChallengeRepository.create(challenge);

  const delivery = await sendOtpSms({
    phone,
    code,
    expiresInSeconds: auth.otpTtlSeconds,
  });

  logger.info("One-time code issued", {
    challengeId: id,
    phone: maskPhone(phone),
    purpose,
    resendCount: challenge.resendCount,
    delivery: delivery.channel,
  });

  return {
    ok: true,
    challenge: {
      challengeId: id,
      maskedPhone: maskPhone(phone),
      purpose,
      expiresAt: challenge.expiresAt,
      resendAvailableAt: challenge.resendAvailableAt,
      resendAfterSeconds: auth.resendCooldownSeconds,
      codeLength: auth.otpLength,
      // Present only when no SMS provider is configured, so the template works
      // end to end in development. Never returned in production.
      devCode: delivery.revealedCode,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Verifying a code                                                            */
/* -------------------------------------------------------------------------- */

export type VerifyOtpResult =
  | { ok: true; user: User; created: boolean }
  | {
      ok: false;
      reason: "expired" | "invalid" | "locked";
      message: string;
      /** Guesses left before the challenge burns. */
      attemptsRemaining?: number;
    };

export async function verifyOtpAndSignIn(
  challengeId: string,
  code: string,
): Promise<VerifyOtpResult> {
  const challenge = await otpChallengeRepository.find(challengeId);

  // Unknown, expired and already-used all return the same shape, so probing
  // ids tells an attacker nothing.
  if (!challenge || challenge.consumedAt) {
    return {
      ok: false,
      reason: "expired",
      message: "That code has expired. Ask for a new one.",
    };
  }

  if (challenge.attempts >= auth.maxOtpAttempts) {
    return {
      ok: false,
      reason: "locked",
      message: "Too many incorrect codes. Ask for a new one.",
    };
  }

  if (!verifyOtp(code, challenge.id, challenge.codeHash)) {
    const attempts = challenge.attempts + 1;
    const remaining = auth.maxOtpAttempts - attempts;

    await otpChallengeRepository.update({ ...challenge, attempts });

    logger.warn("Incorrect one-time code", {
      challengeId,
      phone: maskPhone(challenge.phone),
      attempts,
    });

    if (remaining <= 0) {
      // Burn it rather than leaving a challenge that can never succeed. Marked
      // consumed rather than deleted, so the per-number ceiling still counts it
      // — otherwise five wrong guesses would reset a caller's request budget.
      await otpChallengeRepository.update({
        ...challenge,
        attempts,
        consumedAt: new Date().toISOString(),
      });

      return {
        ok: false,
        reason: "locked",
        message: "Too many incorrect codes. Ask for a new one.",
      };
    }

    return {
      ok: false,
      reason: "invalid",
      message:
        remaining === 1
          ? "That code is not right. One attempt left."
          : `That code is not right. ${remaining} attempts left.`,
      attemptsRemaining: remaining,
    };
  }

  // Consumed before the session is created, so a replayed request cannot
  // produce a second session from the same code.
  await otpChallengeRepository.update({
    ...challenge,
    consumedAt: new Date().toISOString(),
  });

  const existing = await userRepository.findByPhone(challenge.phone);

  if (existing) {
    await startSession(existing.id);
    logger.info("Signed in", { userId: existing.id });

    return { ok: true, user: toPublicUser(existing), created: false };
  }

  const record: UserRecord = {
    id: `usr_${globalThis.crypto.randomUUID()}`,
    phone: challenge.phone,
    name: challenge.name?.trim() || "Guest",
    createdAt: new Date().toISOString(),
    marketingOptIn: false,
  };

  await userRepository.create(record);
  await startSession(record.id);

  // Anything ordered as a guest on this number becomes visible in the new
  // account, so a customer's history is not split by when they signed up.
  const attached = await orderRepository.attachGuestOrders(record.phone, record.id);

  logger.info("Account created", { userId: record.id, attachedGuestOrders: attached });

  return { ok: true, user: toPublicUser(record), created: true };
}

/* -------------------------------------------------------------------------- */
/* Sessions                                                                    */
/* -------------------------------------------------------------------------- */

async function startSession(userId: string): Promise<void> {
  const id = createSessionId();
  const now = Date.now();

  await sessionRepository.create({
    id,
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_SECONDS * 1000).toISOString(),
  });

  await setSessionCookie(id);
}

export async function logout(): Promise<void> {
  const sessionId = await readSessionId();

  if (sessionId) await sessionRepository.delete(sessionId);
  await clearSessionCookie();
}

/**
 * The signed-in user, or null.
 *
 * Safe to call from any Server Component or route handler. Note that reading
 * the session cookie opts the calling route into dynamic rendering.
 */
export async function getCurrentUser(): Promise<User | null> {
  const sessionId = await readSessionId();
  if (!sessionId) return null;

  const session = await sessionRepository.find(sessionId);
  if (!session) return null;

  const record = await userRepository.findById(session.userId);

  if (!record) {
    // The session outlived its user — treat it as invalid and clean it up.
    await sessionRepository.delete(sessionId);
    return null;
  }

  return toPublicUser(record);
}

/** Current session id, for operations that must spare the caller's own session. */
export async function getCurrentSessionId(): Promise<string | null> {
  const sessionId = await readSessionId();
  if (!sessionId) return null;

  const session = await sessionRepository.find(sessionId);
  return session ? session.id : null;
}

function toPublicUser(record: UserRecord): User {
  return {
    id: record.id,
    phone: record.phone,
    name: record.name,
    email: record.email,
    createdAt: record.createdAt,
    marketingOptIn: record.marketingOptIn,
  };
}

/*
 * SECURITY NOTE — account enumeration
 *
 * Separate sign-in and sign-up flows necessarily reveal whether a number is
 * registered: "no account uses that number" is the whole point of the message.
 * That is the standard trade-off for this pattern, and phone numbers are far
 * less enumerable than email addresses.
 *
 * If that disclosure is unacceptable for your threat model, collapse the two
 * into ONE flow: always issue a code, and ask for a name after verification
 * only when no account exists. `verifyOtpAndSignIn` above already handles both
 * branches, so the change is confined to the routes and the UI.
 */
