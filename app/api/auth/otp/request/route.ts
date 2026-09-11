import type { NextRequest } from "next/server";

import {
  guardSameOrigin,
  jsonError,
  jsonOk,
  parseJsonBody,
  withErrorHandling,
} from "@/lib/api/response";
import { otpRequestSchema } from "@/lib/api/schemas";
import {
  checkRateLimit,
  clientKey,
  rateLimitHeaders,
  RATE_LIMITS,
} from "@/lib/api/rate-limit";
import { normalizePhone } from "@/lib/auth/phone";
import { requestOtp } from "@/lib/services/auth.service";

/**
 * Issues a one-time code.
 *
 * Two independent limits apply: this per-IP one, and a per-number ceiling
 * enforced in the service. The first stops one machine spraying many numbers;
 * the second stops one number being spammed from many machines.
 */
export async function POST(request: NextRequest): Promise<Response> {
  return withErrorHandling("POST /api/auth/otp/request", async () => {
    const blocked = guardSameOrigin(request);
    if (blocked) return blocked;

    const limit = checkRateLimit(
      clientKey(request, "otp-request"),
      RATE_LIMITS.otpRequest,
    );
    if (!limit.allowed) {
      return jsonError(
        "rate_limited",
        "Too many codes requested. Please wait a moment.",
        {
          headers: rateLimitHeaders(limit),
        },
      );
    }

    const parsed = await parseJsonBody(request, otpRequestSchema);
    if (!parsed.ok) return parsed.response;

    // Honeypot tripped: acknowledge without issuing anything.
    if (parsed.data.company) {
      return jsonOk(
        {
          challengeId: "otp_ignored",
          maskedPhone: "",
          purpose: parsed.data.purpose,
          expiresAt: new Date(Date.now() + 300_000).toISOString(),
          resendAvailableAt: new Date(Date.now() + 30_000).toISOString(),
          resendAfterSeconds: 30,
          codeLength: 6,
        },
        { status: 201, headers: rateLimitHeaders(limit) },
      );
    }

    const phone = normalizePhone(parsed.data.phone);

    if (!phone.ok) {
      return jsonError("bad_request", phone.reason, {
        fields: [{ path: "phone", message: phone.reason }],
        headers: rateLimitHeaders(limit),
      });
    }

    const result = await requestOtp({
      phone: phone.e164,
      purpose: parsed.data.purpose,
      name: parsed.data.name,
      previousChallengeId: parsed.data.previousChallengeId,
    });

    if (!result.ok) {
      const headers = rateLimitHeaders(limit);
      if (result.retryAfter) headers["Retry-After"] = String(result.retryAfter);

      // The reason travels in the body so the form can route the customer to
      // the other flow rather than only showing an error.
      return jsonError(
        result.reason === "cooldown" || result.reason === "too_many"
          ? "rate_limited"
          : "conflict",
        result.message,
        {
          reason: result.reason,
          fields: [{ path: "phone", message: result.message }],
          headers,
        },
      );
    }

    return jsonOk(result.challenge, { status: 201, headers: rateLimitHeaders(limit) });
  });
}
