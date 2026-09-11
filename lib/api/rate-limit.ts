import "server-only";

import { logger } from "@/lib/observability/logger";

/**
 * Fixed-window rate limiter for write endpoints.
 *
 * Deliberately in-process: it needs no infrastructure and protects a single
 * instance against casual abuse and accidental double-submits.
 *
 * SCALING NOTE: with more than one instance behind a load balancer, each holds
 * its own counters, so the effective limit is `limit x instances`. For a
 * cluster-wide guarantee, swap the Map for Redis/Upstash — the `check()`
 * signature is designed to stay identical.
 */

type Window = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Window>();

/** Highest number of distinct keys held before the oldest are evicted. */
const MAX_TRACKED_KEYS = 10_000;

export type RateLimitRule = {
  /** Requests permitted per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
};

function sweep(now: number): void {
  for (const [key, window] of buckets) {
    if (window.resetAt <= now) buckets.delete(key);
  }

  // Hard ceiling so a flood of unique keys cannot grow the map without bound.
  if (buckets.size > MAX_TRACKED_KEYS) {
    const excess = buckets.size - MAX_TRACKED_KEYS;
    let removed = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      if (++removed >= excess) break;
    }
    logger.warn("Rate limit table trimmed", { removed, size: buckets.size });
  }
}

export function checkRateLimit(key: string, rule: RateLimitRule): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + rule.windowMs });
    return {
      allowed: true,
      limit: rule.limit,
      remaining: rule.limit - 1,
      retryAfter: Math.ceil(rule.windowMs / 1000),
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, rule.limit - existing.count);
  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  return {
    allowed: existing.count <= rule.limit,
    limit: rule.limit,
    remaining,
    retryAfter,
  };
}

/**
 * Best-effort client identity.
 *
 * Proxy headers are spoofable, so this throttles honest traffic and casual
 * abuse — it is not an authentication boundary. Behind a trusted proxy, prefer
 * the leftmost `x-forwarded-for` entry that the proxy itself appended.
 */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";

  return `${scope}:${ip}`;
}

/** Response headers describing the caller's current allowance. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(result.retryAfter),
  };
  if (!result.allowed) headers["Retry-After"] = String(result.retryAfter);
  return headers;
}

/** Shared rules, named so limits are reviewable in one place. */
export const RATE_LIMITS = {
  newsletter: { limit: 5, windowMs: 60 * 60 * 1000 },
  /**
   * Per-IP code issuance. A per-NUMBER ceiling is enforced separately in the
   * auth service — this one stops a single machine spraying many numbers.
   */
  otpRequest: { limit: 15, windowMs: 15 * 60 * 1000 },
  /** Second layer over the per-challenge attempt ceiling. */
  otpVerify: { limit: 20, windowMs: 15 * 60 * 1000 },
  /** Order placement — generous enough for retries after a validation failure. */
  placeOrder: { limit: 20, windowMs: 60 * 60 * 1000 },
  /** Guessing an order number + email pair should not be cheap. */
  trackOrder: { limit: 20, windowMs: 15 * 60 * 1000 },
  /** Coupon codes are guessable, so quoting is throttled too. */
  quote: { limit: 120, windowMs: 60 * 1000 },
  account: { limit: 60, windowMs: 60 * 1000 },
  contact: { limit: 5, windowMs: 60 * 60 * 1000 },
  order: { limit: 10, windowMs: 60 * 60 * 1000 },
  search: { limit: 120, windowMs: 60 * 1000 },
} as const satisfies Record<string, RateLimitRule>;
