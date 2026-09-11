/** Account, address, session and one-time-code domain model. */

export type User = {
  id: string;
  /** E.164, e.g. `+919820011223`. This is the account's identity. */
  phone: string;
  name: string;
  /** Optional: used for order confirmations, never for signing in. */
  email?: string;
  createdAt: string;
  /** Opted into the correspondence list. */
  marketingOptIn: boolean;
};

/**
 * A user as stored.
 *
 * Identical to `User` now that authentication is by one-time code — there is no
 * password to keep out of responses. The alias is kept so the repository
 * contract does not have to change if a secret is reintroduced later.
 */
export type UserRecord = User;

export type Session = {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

/* -------------------------------------------------------------------------- */
/* One-time codes                                                              */
/* -------------------------------------------------------------------------- */

export type OtpPurpose = "sign-in" | "sign-up";

/**
 * A pending sign-in or sign-up.
 *
 * The code itself is never stored — only `codeHash`, an HMAC bound to this
 * challenge's id (see `lib/auth/otp.ts`).
 */
export type OtpChallenge = {
  id: string;
  phone: string;
  purpose: OtpPurpose;
  /** Carried through sign-up so the account can be created on verification. */
  name?: string;
  codeHash: string;
  /** ISO-8601. After this the code is dead regardless of attempts left. */
  expiresAt: string;
  /** ISO-8601. "Resend code" is refused before this instant. */
  resendAvailableAt: string;
  /** Wrong guesses so far. The challenge burns when this hits the maximum. */
  attempts: number;
  createdAt: string;
  /** Set once used, so a code cannot be redeemed twice. */
  consumedAt?: string;
  /** How many codes have been issued in this conversation, for the log trail. */
  resendCount: number;
};

/** What the client is told after asking for a code. Never includes the code. */
export type OtpChallengeView = {
  challengeId: string;
  /** Masked for display, e.g. `+91 ••••• 11223`. */
  maskedPhone: string;
  purpose: OtpPurpose;
  expiresAt: string;
  resendAvailableAt: string;
  /** Seconds until "Resend code" becomes available. Mirrors the server clock. */
  resendAfterSeconds: number;
  codeLength: number;
  /**
   * The code itself, returned ONLY outside production where no SMS provider is
   * configured. It lets the template be used end to end without one.
   */
  devCode?: string;
};

/* -------------------------------------------------------------------------- */
/* Addresses                                                                   */
/* -------------------------------------------------------------------------- */

export type Address = {
  id: string;
  userId: string;
  /** A short name the customer gives it, e.g. "Home". */
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

/** The address as captured on an order — a frozen copy, not a live reference. */
export type ShippingAddress = Omit<Address, "id" | "userId" | "isDefault" | "label">;
