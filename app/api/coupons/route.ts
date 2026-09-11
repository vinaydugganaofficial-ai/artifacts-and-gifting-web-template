import type { NextRequest } from "next/server";

import { jsonOk, parseQuery, withErrorHandling } from "@/lib/api/response";
import { listCouponOffers } from "@/lib/services/coupon.service";
import { getCurrentUser } from "@/lib/services/auth.service";
import { z } from "zod";

const querySchema = z.object({
  /** Optional cart subtotal, so each offer can be annotated with eligibility. */
  subtotal: z.coerce.number().int().min(0).max(100_000_000).optional(),
});

export async function GET(request: NextRequest): Promise<Response> {
  return withErrorHandling("GET /api/coupons", async () => {
    const parsed = parseQuery(new URL(request.url), querySchema);
    if (!parsed.ok) return parsed.response;

    const user = await getCurrentUser();

    const offers = await listCouponOffers({
      subtotal: parsed.data.subtotal ?? 0,
      signedIn: Boolean(user),
    });

    return jsonOk(offers);
  });
}
