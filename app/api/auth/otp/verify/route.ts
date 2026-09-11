import type { NextRequest } from "next/server";

import {
  guardSameOrigin,
  jsonError,
  jsonOk,
  parseJsonBody,
  withErrorHandling,
} from "@/lib/api/response";
import { otpVerifySchema } from "@/lib/api/schemas";
import {
  checkRateLimit,
  clientKey,
  rateLimitHeaders,
  RATE_LIMITS,
} from "@/lib/api/rate-limit";
import { verifyOtpAndSignIn } from "@/lib/services/auth.service";

/**
 * Redeems a one-time code and starts a session.
 *
 * The per-challenge attempt ceiling in the service is the real defence against
 * guessing; this per-IP limit is a second layer covering someone cycling
 * through many challenges.
 */
export async function POST(request: NextRequest): Promise<Response> {
  return withErrorHandling("POST /api/auth/otp/verify", async () => {
    const blocked = guardSameOrigin(request);
    if (blocked) return blocked;

    const limit = checkRateLimit(clientKey(request, "otp-verify"), RATE_LIMITS.otpVerify);
    if (!limit.allowed) {
      return jsonError("rate_limited", "Too many attempts. Please wait a moment.", {
        headers: rateLimitHeaders(limit),
      });
    }

    const parsed = await parseJsonBody(request, otpVerifySchema);
    if (!parsed.ok) return parsed.response;

    const result = await verifyOtpAndSignIn(parsed.data.challengeId, parsed.data.code);

    if (!result.ok) {
      return jsonError(
        result.reason === "invalid" ? "bad_request" : "unauthorized",
        result.message,
        {
          fields: [{ path: "code", message: result.message }],
          headers: rateLimitHeaders(limit),
        },
      );
    }

    return jsonOk(
      { user: result.user, created: result.created },
      { headers: rateLimitHeaders(limit) },
    );
  });
}
