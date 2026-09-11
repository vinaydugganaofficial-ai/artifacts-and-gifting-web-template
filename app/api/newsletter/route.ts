import type { NextRequest } from "next/server";

import { jsonError, jsonOk, parseJsonBody, withErrorHandling } from "@/lib/api/response";
import { newsletterSchema } from "@/lib/api/schemas";
import {
  checkRateLimit,
  clientKey,
  rateLimitHeaders,
  RATE_LIMITS,
} from "@/lib/api/rate-limit";
import { subscribeToNewsletter } from "@/lib/services/submission.service";

export async function POST(request: NextRequest): Promise<Response> {
  return withErrorHandling("POST /api/newsletter", async () => {
    const limit = checkRateLimit(
      clientKey(request, "newsletter"),
      RATE_LIMITS.newsletter,
    );
    if (!limit.allowed) {
      return jsonError("rate_limited", "Too many sign-ups from here. Try again later.", {
        headers: rateLimitHeaders(limit),
      });
    }

    const parsed = await parseJsonBody(request, newsletterSchema);
    if (!parsed.ok) return parsed.response;

    // Honeypot tripped: answer exactly as we would a success so a bot learns
    // nothing, but record nothing.
    if (parsed.data.company) {
      return jsonOk(
        {
          id: "nl_ignored",
          receivedAt: new Date().toISOString(),
          message: "You are on the list. We write rarely, and only when it matters.",
        },
        // Same status as the real path, so even the status code is not a tell.
        { status: 201, headers: rateLimitHeaders(limit) },
      );
    }

    const receipt = await subscribeToNewsletter(parsed.data);
    return jsonOk(receipt, { status: 201, headers: rateLimitHeaders(limit) });
  });
}
