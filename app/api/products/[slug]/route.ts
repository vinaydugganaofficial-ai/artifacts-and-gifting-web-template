import { jsonError, jsonOk, withErrorHandling } from "@/lib/api/response";
import { getProductBySlug } from "@/lib/services/catalog.service";

/** A single product by slug. Powers the quick-view dialog. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
): Promise<Response> {
  return withErrorHandling("GET /api/products/[slug]", async () => {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return jsonError("not_found", "No piece matches that address.");
    }

    return jsonOk(product);
  });
}
