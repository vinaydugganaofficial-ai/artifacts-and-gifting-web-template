import "server-only";

import { cookies } from "next/headers";

import { logger } from "@/lib/observability/logger";
import {
  parseSessionToken,
  serializeSessionToken,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from "@/lib/auth/token";

/**
 * Session cookie handling.
 *
 * The cookie carries an opaque session id plus an HMAC of it (see
 * `lib/auth/token.ts`). The id is looked up in the server-side session store,
 * so a session can be revoked instantly — unlike a self-contained JWT, which
 * stays valid until it expires. The signature lets us reject forged ids before
 * touching the store at all.
 */

export { SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionId } from "@/lib/auth/token";

const isProduction = process.env.NODE_ENV === "production";

export async function setSessionCookie(sessionId: string): Promise<void> {
  const store = await cookies();

  store.set(SESSION_COOKIE, serializeSessionToken(sessionId), {
    httpOnly: true, // unreadable from JavaScript, so XSS cannot steal it
    secure: isProduction, // HTTPS only outside local development
    sameSite: "lax", // blocks cross-site POSTs while keeping normal links working
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();

  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function readSessionId(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  const sessionId = parseSessionToken(raw);

  if (raw && !sessionId) {
    logger.warn("Rejected a session cookie with an invalid signature");
  }

  return sessionId;
}
