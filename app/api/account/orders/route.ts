import { jsonOk, requireApiUser, withErrorHandling } from "@/lib/api/response";
import { listOrdersForUser } from "@/lib/services/order.service";

/** The signed-in customer's orders, newest first. */
export async function GET(): Promise<Response> {
  return withErrorHandling("GET /api/account/orders", async () => {
    const auth = await requireApiUser();
    if (!auth.ok) return auth.response;

    const orders = await listOrdersForUser(auth.user.id);
    return jsonOk(orders);
  });
}
