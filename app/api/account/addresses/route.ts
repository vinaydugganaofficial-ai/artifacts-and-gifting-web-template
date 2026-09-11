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
import { createAddress, listAddresses } from "@/lib/services/account.service";

export async function GET(): Promise<Response> {
  return withErrorHandling("GET /api/account/addresses", async () => {
    const auth = await requireApiUser();
    if (!auth.ok) return auth.response;

    const addresses = await listAddresses(auth.user.id);
    return jsonOk(addresses);
  });
}

export async function POST(request: NextRequest): Promise<Response> {
  return withErrorHandling("POST /api/account/addresses", async () => {
    const blocked = guardSameOrigin(request);
    if (blocked) return blocked;

    const auth = await requireApiUser();
    if (!auth.ok) return auth.response;

    const parsed = await parseJsonBody(request, addressSchema);
    if (!parsed.ok) return parsed.response;

    const result = await createAddress(auth.user.id, {
      ...parsed.data,
      line2: parsed.data.line2 || undefined,
    });

    if (!result.ok) return jsonError("bad_request", result.reason);

    return jsonOk(result.address, { status: 201 });
  });
}
