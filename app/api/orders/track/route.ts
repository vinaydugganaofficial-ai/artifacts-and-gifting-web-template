import type { NextRequest } from "next/server";

import {
  guardSameOrigin,
  jsonError,
  jsonOk,
  parseJsonBody,
  withErrorHandling,
} from "@/lib/api/response";
import { trackOrderSchema } from "@/lib/api/schemas";
import {
  checkRateLimit,
  clientKey,
  rateLimitHeaders,
  RATE_LIMITS,
} from "@/lib/api/rate-limit";
import { trackOrder } from "@/lib/services/order.service";
import { normalizePhone } from "@/lib/auth/phone";

/**
 * Public order tracking.
 *
 * Requires the order number AND the email it was placed with. A wrong pair and
 * an unknown order return the identical message, so this cannot be used to
 * discover which order numbers exist.
 */
export async function POST(request: NextRequest): Promise<Response> {
  return withErrorHandling("POST /api/orders/track", async () => {
    const blocked = guardSameOrigin(request);
    if (blocked) return blocked;

    const limit = checkRateLimit(clientKey(request, "track"), RATE_LIMITS.trackOrder);
    if (!limit.allowed) {
      return jsonError("rate_limited", "Too many lookups. Please wait a moment.", {
        headers: rateLimitHeaders(limit),
      });
    }

    const parsed = await parseJsonBody(request, trackOrderSchema);
    if (!parsed.ok) return parsed.response;

    const phone = normalizePhone(parsed.data.phone);

    if (!phone.ok) {
      return jsonError("bad_request", phone.reason, {
        fields: [{ path: "phone", message: phone.reason }],
        headers: rateLimitHeaders(limit),
      });
    }

    const order = await trackOrder(parsed.data.orderNumber, phone.e164);

    if (!order) {
      return jsonError(
        "not_found",
        "We could not find an order with that number and mobile number.",
        { headers: rateLimitHeaders(limit) },
      );
    }

    // The full delivery address is deliberately omitted — the recipient's name
    // and city are enough to confirm the right order without exposing it.
    return jsonOk(
      {
        orderNumber: order.orderNumber,
        status: order.status,
        placedAt: order.placedAt,
        history: order.history,
        estimatedDelivery: order.estimatedDelivery,
        trackingNumber: order.trackingNumber,
        itemCount: order.lines.reduce((count, line) => count + line.quantity, 0),
        total: order.totals.total,
        recipient: order.shippingAddress.recipient,
        city: order.shippingAddress.city,
        lines: order.lines.map((line) => ({
          name: line.name,
          slug: line.slug,
          image: line.image,
          imageAlt: line.imageAlt,
          quantity: line.quantity,
        })),
      },
      { headers: rateLimitHeaders(limit) },
    );
  });
}
