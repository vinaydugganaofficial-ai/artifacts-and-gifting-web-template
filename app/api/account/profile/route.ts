import type { NextRequest } from "next/server";

import {
  guardSameOrigin,
  jsonError,
  jsonOk,
  parseJsonBody,
  requireApiUser,
  withErrorHandling,
} from "@/lib/api/response";
import { profileSchema } from "@/lib/api/schemas";
import { updateProfile } from "@/lib/services/account.service";

export async function PATCH(request: NextRequest): Promise<Response> {
  return withErrorHandling("PATCH /api/account/profile", async () => {
    const blocked = guardSameOrigin(request);
    if (blocked) return blocked;

    const auth = await requireApiUser();
    if (!auth.ok) return auth.response;

    const parsed = await parseJsonBody(request, profileSchema);
    if (!parsed.ok) return parsed.response;

    const result = await updateProfile(auth.user.id, {
      name: parsed.data.name,
      email: parsed.data.email || undefined,
      marketingOptIn: parsed.data.marketingOptIn,
    });

    if (!result.ok) return jsonError("bad_request", result.reason);

    return jsonOk(result.user);
  });
}
