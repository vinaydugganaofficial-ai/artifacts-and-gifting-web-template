import type { NextRequest } from "next/server";

import {
  guardSameOrigin,
  jsonError,
  jsonOk,
  parseJsonBody,
  withErrorHandling,
} from "@/lib/api/response";
import { placeOrderSchema } from "@/lib/api/schemas";
import {
  checkRateLimit,
  clientKey,
  rateLimitHeaders,
  RATE_LIMITS,
} from "@/lib/api/rate-limit";
import { placeOrder } from "@/lib/services/order.service";
import { getCurrentUser } from "@/lib/services/auth.service";
import { addressRepository } from "@/lib/repositories";
import { createAddress, toShippingAddress } from "@/lib/services/account.service";
import { logger } from "@/lib/observability/logger";
import { normalizePhone } from "@/lib/auth/phone";
import type { ShippingAddress } from "@/types/account";

/**
 * Places an order.
 *
 * The body carries product ids, quantities, a delivery address and an optional
 * coupon code — never money. Every figure is recomputed from the catalog inside
 * the service, so a forged subtotal or discount is ignored.
 */
export async function POST(request: NextRequest): Promise<Response> {
  return withErrorHandling("POST /api/orders", async () => {
    const blocked = guardSameOrigin(request);
    if (blocked) return blocked;

    const limit = checkRateLimit(
      clientKey(request, "place-order"),
      RATE_LIMITS.placeOrder,
    );
    if (!limit.allowed) {
      return jsonError("rate_limited", "Too many orders from here. Try again later.", {
        headers: rateLimitHeaders(limit),
      });
    }

    const parsed = await parseJsonBody(request, placeOrderSchema);
    if (!parsed.ok) return parsed.response;

    // Honeypot tripped: acknowledge without placing anything.
    if (parsed.data.company) {
      return jsonOk(
        { orderNumber: "AAR-0000-IGNORED", status: "placed", total: 0 },
        { status: 201, headers: rateLimitHeaders(limit) },
      );
    }

    const user = await getCurrentUser();

    const resolved = await resolveShippingAddress(parsed.data, user?.id);
    if (!resolved.ok) {
      return jsonError("bad_request", resolved.reason, {
        headers: rateLimitHeaders(limit),
      });
    }

    // A signed-in customer's own number is authoritative; a guest supplies one.
    let phone = user?.phone;

    if (!phone) {
      const parsedPhone = normalizePhone(parsed.data.phone);

      if (!parsedPhone.ok) {
        return jsonError("bad_request", parsedPhone.reason, {
          fields: [{ path: "phone", message: parsedPhone.reason }],
          headers: rateLimitHeaders(limit),
        });
      }

      phone = parsedPhone.e164;
    }

    const result = await placeOrder({
      items: parsed.data.items,
      phone,
      // A member's stored address wins; otherwise use whatever a guest gave.
      email: user?.email ?? (parsed.data.email || undefined),
      shippingAddress: resolved.address,
      note: parsed.data.note || undefined,
      couponCode: parsed.data.couponCode || undefined,
      userId: user?.id,
    });

    if (!result.ok) {
      return jsonError("conflict", result.reason, { headers: rateLimitHeaders(limit) });
    }

    // Saving the address is a convenience, never a reason to fail an order that
    // has already been placed.
    if (user && parsed.data.saveAddress && parsed.data.shippingAddress) {
      try {
        await createAddress(user.id, {
          ...parsed.data.shippingAddress,
          line2: parsed.data.shippingAddress.line2 || undefined,
          label: "Saved at checkout",
          isDefault: false,
        });
      } catch (error) {
        logger.warn("Could not save the checkout address", {
          userId: user.id,
          orderNumber: result.order.orderNumber,
          error: String(error),
        });
      }
    }

    const { order } = result;

    return jsonOk(
      {
        orderNumber: order.orderNumber,
        status: order.status,
        placedAt: order.placedAt,
        totals: order.totals,
        itemCount: order.lines.reduce((count, line) => count + line.quantity, 0),
        estimatedDelivery: order.estimatedDelivery,
        phone: order.phone,
        email: order.email,
        paymentMethod: parsed.data.paymentMethod,
      },
      { status: 201, headers: rateLimitHeaders(limit) },
    );
  });
}

type ResolvedAddress =
  { ok: true; address: ShippingAddress } | { ok: false; reason: string };

/**
 * Determines where the order ships to.
 *
 * A saved-address id is looked up and ownership verified server-side, so an id
 * belonging to another account cannot be used to read their address.
 */
async function resolveShippingAddress(
  input: { addressId?: string; shippingAddress?: Omit<ShippingAddress, never> },
  userId: string | undefined,
): Promise<ResolvedAddress> {
  if (input.addressId) {
    if (!userId) {
      return { ok: false, reason: "Sign in to use a saved address." };
    }

    const saved = await addressRepository.find(input.addressId);

    if (!saved || saved.userId !== userId) {
      return { ok: false, reason: "That saved address could not be found." };
    }

    return { ok: true, address: toShippingAddress(saved) };
  }

  if (input.shippingAddress) {
    return { ok: true, address: input.shippingAddress };
  }

  return { ok: false, reason: "A delivery address is required." };
}
