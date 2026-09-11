import type { NextRequest } from "next/server";

import { jsonError, jsonOk, parseJsonBody, withErrorHandling } from "@/lib/api/response";
import { contactSchema } from "@/lib/api/schemas";
import {
  checkRateLimit,
  clientKey,
  rateLimitHeaders,
  RATE_LIMITS,
} from "@/lib/api/rate-limit";
import { submitContactMessage } from "@/lib/services/submission.service";

export async function POST(request: NextRequest): Promise<Response> {
  return withErrorHandling("POST /api/contact", async () => {
    const limit = checkRateLimit(clientKey(request, "contact"), RATE_LIMITS.contact);
    if (!limit.allowed) {
      return jsonError("rate_limited", "Too many messages from here. Try again later.", {
        headers: rateLimitHeaders(limit),
      });
    }

    const parsed = await parseJsonBody(request, contactSchema);
    if (!parsed.ok) return parsed.response;

    if (parsed.data.company) {
      return jsonOk(
        {
          id: "msg_ignored",
          receivedAt: new Date().toISOString(),
          message: "Your message has reached the atelier.",
        },
        // Same status as the real path, so even the status code is not a tell.
        { status: 201, headers: rateLimitHeaders(limit) },
      );
    }

    const receipt = await submitContactMessage(parsed.data);
    return jsonOk(receipt, { status: 201, headers: rateLimitHeaders(limit) });
  });
}
