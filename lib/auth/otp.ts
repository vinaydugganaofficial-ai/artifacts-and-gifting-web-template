import "server-only";

import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

import { siteConfig } from "@/config/site";

/**
 * One-time code generation and verification.
 *
 * Security properties, all enforced here rather than at the call sites:
 *
 * - Codes are generated with a CSPRNG, digit by digit, so every value in the
 *   space is equally likely (including ones with leading zeros).
 * - Codes are NEVER stored in plaintext. Only an HMAC of the code is kept, so a
 *   dump of the challenge store cannot be replayed.
 * - Comparison is constant-time, so response timing reveals nothing about how
 *   much of a guess was right.
 *
 * The HMAC is keyed with AUTH_SECRET rather than being a bare hash: a 6-digit
 * space is small enough to reverse a plain SHA-256 of instantly, whereas an
 * HMAC is useless without the key.
 */

function secret(): string {
  const configured = process.env.AUTH_SECRET;

  if (configured && configured.length >= 32) return configured;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SECRET must be set to at least 32 characters in production. See .env.example.",
    );
  }

  return "development-only-insecure-secret-value-32ch";
}

/** Uniformly random numeric code of the configured length. */
export function generateOtp(length: number = siteConfig.auth.otpLength): string {
  let code = "";
  for (let index = 0; index < length; index += 1) {
    // randomInt is rejection-sampled, so there is no modulo bias.
    code += String(randomInt(0, 10));
  }
  return code;
}

/** Keyed digest of a code, bound to the challenge it belongs to. */
export function hashOtp(code: string, challengeId: string): string {
  return (
    createHmac("sha256", secret())
      // Binding the id in stops a code captured for one challenge being replayed
      // against another.
      .update(`${challengeId}:${code}`)
      .digest("hex")
  );
}

/** Constant-time comparison of a submitted code against a stored digest. */
export function verifyOtp(
  code: string,
  challengeId: string,
  storedHash: string,
): boolean {
  const candidate = hashOtp(code, challengeId);

  try {
    const a = Buffer.from(candidate, "hex");
    const b = Buffer.from(storedHash, "hex");

    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
