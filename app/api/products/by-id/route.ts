import type { NextRequest } from "next/server";

import { jsonOk, parseQuery, withErrorHandling } from "@/lib/api/response";
import { productIdsQuerySchema } from "@/lib/api/schemas";
import { getProductsByIds } from "@/lib/services/catalog.service";

/**
 * Resolves product ids held in a visitor's browser storage (cart, wishlist).
 *
 * Ids that no longer exist in the catalog are omitted from the response rather
 * than returned as holes, so a stale entry can never crash a client render.
 */
export async function GET(request: NextRequest): Promise<Response> {
  return withErrorHandling("GET /api/products/by-id", async () => {
    const parsed = parseQuery(new URL(request.url), productIdsQuerySchema);
    if (!parsed.ok) return parsed.response;

    const products = await getProductsByIds(parsed.data.ids);
    return jsonOk(products);
  });
}
