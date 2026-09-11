import type { NextRequest } from "next/server";

import {
  guardSameOrigin,
  jsonError,
  jsonOk,
  parseJsonBody,
  requireApiUser,
  withErrorHandling,
} from "@/lib/api/response";
import { addressSchema } from "@/lib/api/schemas";
import { deleteAddress, updateAddress } from "@/lib/services/account.service";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: Context): Promise<Response> {
  return withErrorHandling("PUT /api/account/addresses/[id]", async () => {
    const blocked = guardSameOrigin(request);
    if (blocked) return blocked;

    const auth = await requireApiUser();
    if (!auth.ok) return auth.response;

    const parsed = await parseJsonBody(request, addressSchema);
    if (!parsed.ok) return parsed.response;

    const { id } = await context.params;

    // Ownership is enforced inside the service, which returns the same "not
    // found" for someone else's address as for one that does not exist.
    const result = await updateAddress(auth.user.id, id, {
      ...parsed.data,
      line2: parsed.data.line2 || undefined,
    });

    if (!result.ok) return jsonError("not_found", result.reason);

    return jsonOk(result.address);
  });
}

export async function DELETE(request: NextRequest, context: Context): Promise<Response> {
  return withErrorHandling("DELETE /api/account/addresses/[id]", async () => {
    const blocked = guardSameOrigin(request);
    if (blocked) return blocked;

    const auth = await requireApiUser();
    if (!auth.ok) return auth.response;

    const { id } = await context.params;
    const result = await deleteAddress(auth.user.id, id);

    if (!result.ok) return jsonError("not_found", result.reason);

    return jsonOk({ deleted: true });
  });
}
