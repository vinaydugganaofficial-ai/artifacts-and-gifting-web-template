import type { NextRequest } from "next/server";

import {
  guardSameOrigin,
  jsonError,
  jsonOk,
  parseJsonBody,
  withErrorHandling,
} from "@/lib/api/response";
import { quoteSchema } from "@/lib/api/schemas";
import {
  checkRateLimit,
  clientKey,
  rateLimitHeaders,
  RATE_LIMITS,
} from "@/lib/api/rate-limit";
import { priceCart } from "@/lib/services/order.service";
import { getCurrentUser } from "@/lib/services/auth.service";

/**
 * Prices a cart, optionally with a coupon.
 *
 * The checkout summary is rendered entirely from this response, so what the
 * customer sees is produced by the same function that prices the real order.
 */
export async function POST(request: NextRequest): Promise<Response> {
  return withErrorHandling("POST /api/checkout/quote", async () => {
    const blocked = guardSameOrigin(request);
    if (blocked) return blocked;

    const limit = checkRateLimit(clientKey(request, "quote"), RATE_LIMITS.quote);
    if (!limit.allowed) {
      return jsonError("rate_limited", "Too many requests. Please slow down a moment.", {
        headers: rateLimitHeaders(limit),
      });
    }

    const parsed = await parseJsonBody(request, quoteSchema);
    if (!parsed.ok) return parsed.response;

    const user = await getCurrentUser();

    const priced = await priceCart(parsed.data.items, {
      couponCode: parsed.data.couponCode || undefined,
      signedIn: Boolean(user),
    });

    return jsonOk(priced, { headers: rateLimitHeaders(limit) });
  });
}
