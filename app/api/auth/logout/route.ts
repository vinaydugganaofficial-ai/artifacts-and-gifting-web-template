import type { NextRequest } from "next/server";

import { guardSameOrigin, jsonOk, withErrorHandling } from "@/lib/api/response";
import { logout } from "@/lib/services/auth.service";

export async function POST(request: NextRequest): Promise<Response> {
  return withErrorHandling("POST /api/auth/logout", async () => {
    const blocked = guardSameOrigin(request);
    if (blocked) return blocked;

    // Idempotent: signing out when already signed out is a success, not an error.
    await logout();

    return jsonOk({ signedOut: true });
  });
}
