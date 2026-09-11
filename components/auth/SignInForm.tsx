"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { CountryCode } from "@/components/auth/PhoneField";
import { PhoneField } from "@/components/auth/PhoneField";
import { OtpVerifyStep } from "@/components/auth/OtpVerifyStep";
import { Button } from "@/components/ui/button";
import { requestOtp } from "@/lib/api/client";
import { normalizePhone } from "@/lib/auth/phone";
import { useUIStore } from "@/lib/store/ui";
import type { OtpChallengeView, User } from "@/types/account";

type SignInFormProps = {
  /** Where to send the customer once signed in. Already validated server-side. */
  returnTo: string;
  countryCodes: readonly CountryCode[];
  defaultCountryCode: string;
  /** Shown above the form when set. */
  notice?: string;
  /** Prefills the number in development so the demo account is one tap away. */
  demoPhone?: string;
};

/**
 * Sign in with a mobile number and a one-time code.
 *
 * Two steps in one component: enter the number, then verify. The challenge
 * returned by the server is the only state that carries between them.
 */
export function SignInForm({
  returnTo,
  countryCodes,
  defaultCountryCode,
  notice,
  demoPhone,
}: SignInFormProps) {
  const router = useRouter();
  const showToast = useUIStore((state) => state.showToast);

  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [phone, setPhone] = useState("");
  const [challenge, setChallenge] = useState<OtpChallengeView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsSignUp, setNeedsSignUp] = useState(false);
  const [sending, setSending] = useState(false);

  /** The combined number, as the API will receive it. */
  const combined = `${countryCode}${phone.replace(/\D/g, "")}`;

  async function onRequest(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;

    setError(null);
    setNeedsSignUp(false);

    // Validated with the same normaliser the server uses, so the two can never
    // disagree about what counts as a number.
    const parsed = normalizePhone(combined, countryCode);

    if (!parsed.ok) {
      setError(parsed.reason);
      return;
    }

    setSending(true);
    const result = await requestOtp({ phone: parsed.e164, purpose: "sign-in" });
    setSending(false);

    if (!result.ok) {
      setError(result.error.message);
      // Branch on the machine-readable reason, never on the prose message.
      setNeedsSignUp(result.error.reason === "not_registered");
      return;
    }

    setChallenge(result.data);
  }

  function onVerified(user: User) {
    showToast(`Welcome back, ${user.name.split(" ")[0]}`, "success");

    router.replace(returnTo);
    // Re-runs the Server Components so the header reflects the new session.
    router.refresh();
  }

  if (challenge) {
    return (
      <OtpVerifyStep
        challenge={challenge}
        onChallengeChange={setChallenge}
        resendPayload={{ phone: combined, purpose: "sign-in" }}
        onVerified={onVerified}
        onEditNumber={() => {
          setChallenge(null);
          setError(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={onRequest} noValidate className="space-y-7">
      {notice ? (
        <p
          role="status"
          className="border border-gold/40 bg-gold/5 px-5 py-4 text-sm text-charcoal/75"
        >
          {notice}
        </p>
      ) : null}

      <PhoneField
        id="signin-phone"
        label="Mobile number"
        countryCode={countryCode}
        onCountryCodeChange={setCountryCode}
        value={phone}
        onChange={setPhone}
        countryCodes={countryCodes}
        error={error ?? undefined}
        hint="We will send you a one-time code."
        disabled={sending}
        autoFocus
      />

      {needsSignUp ? (
        <p className="text-sm text-charcoal/70">
          <Link
            href={`/sign-up?next=${encodeURIComponent(returnTo)}`}
            className="link-underline text-charcoal"
          >
            Create an account
          </Link>{" "}
          with that number instead.
        </p>
      ) : null}

      <Button type="submit" loading={sending} className="w-full">
        {sending ? "Sending code…" : "Send code"}
      </Button>

      {demoPhone ? (
        <div className="border border-charcoal/10 bg-ivory-deep/40 p-4 text-xs leading-relaxed text-charcoal/60">
          <p className="font-medium uppercase tracking-[0.2em] text-charcoal/50">
            Demo account
          </p>
          <p className="mt-2">{demoPhone}</p>
          <button
            type="button"
            onClick={() => {
              const parsed = normalizePhone(demoPhone);
              if (!parsed.ok) return;

              const match = countryCodes.find((entry) =>
                parsed.e164.startsWith(entry.code),
              );

              if (match) {
                setCountryCode(match.code);
                setPhone(parsed.e164.slice(match.code.length));
              }
            }}
            className="link-underline mt-2 text-charcoal/80"
          >
            Fill this in
          </button>
        </div>
      ) : null}
    </form>
  );
}
