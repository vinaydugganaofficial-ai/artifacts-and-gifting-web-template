import { jsonOk, withErrorHandling } from "@/lib/api/response";
import { getCurrentUser } from "@/lib/services/auth.service";

/** The signed-in user, or `{ user: null }`. Never 401s — absence is the answer. */
export async function GET(): Promise<Response> {
  return withErrorHandling("GET /api/auth/session", async () => {
    const user = await getCurrentUser();
    return jsonOk({ user });
  });
}
