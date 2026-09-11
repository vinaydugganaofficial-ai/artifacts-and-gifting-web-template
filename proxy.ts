import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { parseSessionToken, SESSION_COOKIE } from "@/lib/auth/token";

/**
 * Fast gate on the account section.
 *
 * Verifies only that a session cookie is present and carries OUR signature —
 * pure crypto over the cookie string, with no shared module state, which is the
 * constraint Next places on proxy code.
 *
 * That is deliberately not the authoritative check. A validly-signed cookie for
 * a revoked or expired session still reaches `app/account/layout.tsx`, which
 * consults the session store and redirects if it is no longer live.
 *
 * The value here is the signed-OUT case: without this, `redirect()` fires after
 * the response has begun streaming, and Next falls back to a one-second
 * meta-refresh. Catching it at the edge returns a real 307 immediately.
 */
export function proxy(request: NextRequest): NextResponse {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (parseSessionToken(token)) return NextResponse.next();

  const signIn = new URL("/sign-in", request.url);
  // Preserve where they were heading so sign-in can return them there.
  signIn.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(signIn);
}

export const config = {
  // Scoped to the account section only: every other route stays untouched, and
  // static assets never reach this function.
  matcher: ["/account", "/account/:path*"],
};
