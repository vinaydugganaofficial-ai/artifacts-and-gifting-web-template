import { jsonError, jsonOk, withErrorHandling } from "@/lib/api/response";
import { getCollectionPage } from "@/lib/services/catalog.service";

/** A collection together with exactly the products it contains. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
): Promise<Response> {
  return withErrorHandling("GET /api/collections/[slug]", async () => {
    const { slug } = await context.params;
    const page = await getCollectionPage(slug);

    if (!page) {
      return jsonError("not_found", "No collection matches that address.");
    }

    return jsonOk(page);
  });
}
