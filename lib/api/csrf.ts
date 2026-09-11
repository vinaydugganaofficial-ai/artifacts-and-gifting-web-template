import "server-only";

import { siteConfig } from "@/config/site";

/**
 * Cross-site request forgery guard for state-changing endpoints.
 *
 * The session cookie is `SameSite=Lax`, which already blocks it being sent on a
 * cross-site POST. This is the second layer: it rejects any state-changing
 * request whose `Origin` is not our own, which also covers the same-site-but-
 * different-subdomain case that Lax permits.
 *
 * Checked on every mutating route, not just the sensitive-looking ones.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  // Same-origin fetches from some browsers omit Origin on GET, but every
  // mutating request we handle is made by our own client, which always sends it.
  if (!origin) return false;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  // `host` reflects the request as it actually arrived, including the port used
  // in development, so it is the right thing to compare against.
  const requestHost = request.headers.get("host");
  if (requestHost && originHost === requestHost) return true;

  // Behind a proxy that rewrites Host, fall back to the configured public URL.
  try {
    if (originHost === new URL(siteConfig.baseUrl).host) return true;
  } catch {
    // A malformed NEXT_PUBLIC_SITE_URL should not crash the check.
  }

  return false;
}
