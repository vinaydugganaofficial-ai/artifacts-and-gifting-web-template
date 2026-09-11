import type { NextRequest } from "next/server";

import { jsonError, jsonOk, parseQuery, withErrorHandling } from "@/lib/api/response";
import { searchQuerySchema } from "@/lib/api/schemas";
import {
  checkRateLimit,
  clientKey,
  rateLimitHeaders,
  RATE_LIMITS,
} from "@/lib/api/rate-limit";
import { searchProducts } from "@/lib/services/catalog.service";

/** Typeahead search. Rate limited because it is called on every keystroke. */
export async function GET(request: NextRequest): Promise<Response> {
  return withErrorHandling("GET /api/search", async () => {
    const limit = checkRateLimit(clientKey(request, "search"), RATE_LIMITS.search);
    if (!limit.allowed) {
      return jsonError("rate_limited", "Too many searches. Please slow down a moment.", {
        headers: rateLimitHeaders(limit),
      });
    }

    const parsed = parseQuery(new URL(request.url), searchQuerySchema);
    if (!parsed.ok) return parsed.response;

    const results = await searchProducts(parsed.data.q, parsed.data.limit);
    return jsonOk(results, { headers: rateLimitHeaders(limit) });
  });
}
