import { jsonOk, withErrorHandling } from "@/lib/api/response";
import { listCollections } from "@/lib/services/catalog.service";

/** All collections, each with a count derived from the live catalog. */
export async function GET(): Promise<Response> {
  return withErrorHandling("GET /api/collections", async () => {
    const collections = await listCollections();
    return jsonOk(collections);
  });
}
