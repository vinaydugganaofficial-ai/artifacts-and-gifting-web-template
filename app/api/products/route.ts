import type { NextRequest } from "next/server";

import { jsonOk, parseQuery, withErrorHandling } from "@/lib/api/response";
import { productListQuerySchema } from "@/lib/api/schemas";
import { listProducts } from "@/lib/services/catalog.service";
import type { ProductSort } from "@/types/product";

/** Filtered, sorted, paginated catalog listing. */
export async function GET(request: NextRequest): Promise<Response> {
  return withErrorHandling("GET /api/products", async () => {
    const parsed = parseQuery(new URL(request.url), productListQuerySchema);
    if (!parsed.ok) return parsed.response;

    const page = await listProducts({
      ...parsed.data,
      sort: parsed.data.sort as ProductSort | undefined,
    });

    return jsonOk(page);
  });
}
