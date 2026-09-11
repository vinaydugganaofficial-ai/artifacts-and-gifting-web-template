"use client";

import { useCallback, useState } from "react";

import type { OtpChallengeView } from "@/types/account";
import { requestOtp, verifyOtp } from "@/lib/api/client";
import { OtpInput } from "@/components/auth/OtpInput";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/lib/hooks/use-countdown";
import { useUIStore } from "@/lib/store/ui";
import type { User } from "@/types/account";

type OtpVerifyStepProps = {
  /** The live challenge. Replaced wholesale when a code is resent. */
  challenge: OtpChallengeView;
  onChallengeChange: (challenge: OtpChallengeView) => void;
  /** What to resend with — the server re-derives everything else. */
  resendPayload: { phone: string; purpose: "sign-in" | "sign-up"; name?: string };
  onVerified: (user: User, created: boolean) => void;
  /** Returns to the number entry step. */
  onEditNumber: () => void;
};

/**
 * The second step of both sign-in and sign-up.
 *
 * Identical in either flow, so it lives here once and takes everything it needs
 * as props. The resend countdown mirrors `challenge.resendAvailableAt` from the
 * server; pressing resend early is refused server-side regardless.
 */
export function OtpVerifyStep({
  challenge,
  onChallengeChange,
  resendPayload,
  onVerified,
  onEditNumber,
}: OtpVerifyStepProps) {
  const showToast = useUIStore((state) => state.showToast);

  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const secondsLeft = useCountdown(challenge.resendAvailableAt);
  const expirySeconds = useCountdown(challenge.expiresAt);
  const canResend = secondsLeft === 0 && !resending && !verifying;
  const expired = expirySeconds === 0;

  const submit = useCallback(
    async (submitted: string) => {
      if (verifying) return;

      setVerifying(true);
      setError(null);

      const result = await verifyOtp({
        challengeId: challenge.challengeId,
        code: submitted,
      });

      if (!result.ok) {
        setError(result.error.message);
        setCode("");
        setVerifying(false);
        return;
      }

      // Left in the verifying state: the parent navigates away, and re-enabling
      // the button first would invite a second submit.
      onVerified(result.data.user, result.data.created);
    },
    [challenge.challengeId, onVerified, verifying],
  );

  async function onResend() {
    if (!canResend) return;

    setResending(true);
    setError(null);

    const result = await requestOtp({
      ...resendPayload,
      previousChallengeId: challenge.challengeId,
    });

    setResending(false);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setCode("");
    onChallengeChange(result.data);
    showToast("A new code is on its way", "success");
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm text-charcoal/70">
          We sent a {challenge.codeLength}-digit code to{" "}
          <span className="whitespace-nowrap text-charcoal">{challenge.maskedPhone}</span>
          .
        </p>

        <button
          type="button"
          onClick={onEditNumber}
          className="link-underline mt-2 text-xs text-charcoal/60"
        >
          Use a different number
        </button>
      </div>

      {/* Development affordance: with no SMS provider configured the API returns
          the code so the flow can be completed without one. */}
      {challenge.devCode ? (
        <p className="border border-gold/40 bg-gold/5 px-4 py-3 text-xs leading-relaxed text-charcoal/70">
          <span className="font-medium uppercase tracking-[0.2em] text-gold-muted">
            Development
          </span>
          <br />
          No SMS provider is configured, so the code is shown here:{" "}
          <span className="text-base tracking-[0.3em] text-charcoal">
            {challenge.devCode}
          </span>
        </p>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (code.length === challenge.codeLength) void submit(code);
        }}
        noValidate
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="otp-code"
            className="text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
          >
            Verification code
          </label>

          <div className="mt-3">
            <OtpInput
              id="otp-code"
              value={code}
              onChange={setCode}
              onComplete={(complete) => void submit(complete)}
              length={challenge.codeLength}
              invalid={Boolean(error)}
              disabled={verifying || expired}
              aria-describedby={error ? "otp-error" : "otp-hint"}
            />
          </div>

          {error ? (
            <p id="otp-error" role="alert" className="mt-3 text-sm text-danger">
              {error}
            </p>
          ) : (
            <p id="otp-hint" className="mt-3 text-xs text-charcoal/50">
              {expired
                ? "That code has expired. Ask for a new one."
                : `The code expires in ${formatSeconds(expirySeconds)}.`}
            </p>
          )}
        </div>

        <Button
          type="submit"
          loading={verifying}
          disabled={code.length !== challenge.codeLength || expired}
          className="w-full"
        >
          {verifying ? "Verifying…" : "Verify and continue"}
        </Button>
      </form>

      <div className="border-t border-charcoal/10 pt-6">
        {canResend ? (
          <button
            type="button"
            onClick={onResend}
            className="link-underline text-sm text-charcoal"
          >
            Resend code
          </button>
        ) : (
          <p aria-live="polite" className="text-sm text-charcoal/50">
            {resending ? "Sending…" : `Resend code in ${secondsLeft}s`}
          </p>
        )}
      </div>
    </div>
  );
}

function formatSeconds(total: number): string {
  if (total <= 0) return "0:00";

  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
