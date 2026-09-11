import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Session token format and signing.
 *
 * Deliberately free of `next/headers` and of any shared module state, so this
 * can be imported by `proxy.ts` as well as by the request-handling code. Next
 * warns that proxy code must not rely on shared modules or globals; everything
 * here is pure crypto over the token string itself.
 */

export const SESSION_COOKIE = "aaranya_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

function secret(): string {
  const configured = process.env.AUTH_SECRET;

  if (configured && configured.length >= 32) return configured;

  if (process.env.NODE_ENV === "production") {
    // Failing loudly beats silently signing every session with a known key.
    throw new Error(
      "AUTH_SECRET must be set to at least 32 characters in production. See .env.example.",
    );
  }

  // Development only: stable across a run so sessions survive hot reloads.
  return "development-only-insecure-secret-value-32ch";
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionId(): string {
  return randomBytes(32).toString("hex");
}

/** `<id>.<hmac>` — the format stored in the cookie. */
export function serializeSessionToken(sessionId: string): string {
  return `${sessionId}.${sign(sessionId)}`;
}

/**
 * Returns the session id only if the signature verifies.
 *
 * This proves the cookie was issued by us; it does NOT prove the session is
 * still live. Whether it has been revoked or has expired is decided by the
 * session store, which only the request-handling code consults.
 */
export function parseSessionToken(token: string | undefined): string | null {
  if (!token) return null;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const sessionId = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = sign(sessionId);

  if (signature.length !== expected.length) return null;

  try {
    if (!timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))) {
      return null;
    }
  } catch {
    return null;
  }

  return sessionId;
}
