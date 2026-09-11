"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { CountryCode } from "@/components/auth/PhoneField";
import { PhoneField } from "@/components/auth/PhoneField";
import { OtpVerifyStep } from "@/components/auth/OtpVerifyStep";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { requestOtp } from "@/lib/api/client";
import { normalizePhone } from "@/lib/auth/phone";
import { useUIStore } from "@/lib/store/ui";
import type { OtpChallengeView, User } from "@/types/account";

type SignUpFormProps = {
  returnTo: string;
  countryCodes: readonly CountryCode[];
  defaultCountryCode: string;
};

/**
 * Create an account with a name, a mobile number and a one-time code.
 *
 * The name travels with the challenge and is applied by the server when the
 * code is verified, so the account is created in one atomic step rather than
 * left half-made if the customer abandons the code.
 */
export function SignUpForm({
  returnTo,
  countryCodes,
  defaultCountryCode,
}: SignUpFormProps) {
  const router = useRouter();
  const showToast = useUIStore((state) => state.showToast);

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [phone, setPhone] = useState("");
  const [challenge, setChallenge] = useState<OtpChallengeView | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [sending, setSending] = useState(false);

  const combined = `${countryCode}${phone.replace(/\D/g, "")}`;

  async function onRequest(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;

    setNameError(null);
    setPhoneError(null);
    setAlreadyRegistered(false);

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setNameError("Please tell us your name.");
      return;
    }

    const parsed = normalizePhone(combined, countryCode);

    if (!parsed.ok) {
      setPhoneError(parsed.reason);
      return;
    }

    setSending(true);
    const result = await requestOtp({
      phone: parsed.e164,
      purpose: "sign-up",
      name: trimmedName,
    });
    setSending(false);

    if (!result.ok) {
      setPhoneError(result.error.message);
      // Branch on the machine-readable reason, never on the prose message.
      setAlreadyRegistered(result.error.reason === "already_registered");
      return;
    }

    setChallenge(result.data);
  }

  function onVerified(user: User) {
    showToast(`Welcome, ${user.name.split(" ")[0]}`, "success");

    router.replace(returnTo);
    router.refresh();
  }

  if (challenge) {
    return (
      <OtpVerifyStep
        challenge={challenge}
        onChallengeChange={setChallenge}
        resendPayload={{ phone: combined, purpose: "sign-up", name: name.trim() }}
        onVerified={onVerified}
        onEditNumber={() => {
          setChallenge(null);
          setPhoneError(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={onRequest} noValidate className="space-y-7">
      <Field htmlFor="signup-name" label="Your name" error={nameError ?? undefined}>
        <Input
          id="signup-name"
          autoComplete="name"
          autoFocus
          value={name}
          disabled={sending}
          invalid={Boolean(nameError)}
          aria-describedby={nameError ? "signup-name-error" : undefined}
          onChange={(event) => setName(event.target.value)}
        />
      </Field>

      <PhoneField
        id="signup-phone"
        label="Mobile number"
        countryCode={countryCode}
        onCountryCodeChange={setCountryCode}
        value={phone}
        onChange={setPhone}
        countryCodes={countryCodes}
        error={phoneError ?? undefined}
        hint="We will send a one-time code to confirm it is yours."
        disabled={sending}
      />

      {alreadyRegistered ? (
        <p className="text-sm text-charcoal/70">
          <Link
            href={`/sign-in?next=${encodeURIComponent(returnTo)}`}
            className="link-underline text-charcoal"
          >
            Sign in
          </Link>{" "}
          with that number instead.
        </p>
      ) : null}

      <Button type="submit" loading={sending} className="w-full">
        {sending ? "Sending code…" : "Send code"}
      </Button>

      <p className="text-xs leading-relaxed text-charcoal/50">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="link-underline text-charcoal/70">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="link-underline text-charcoal/70">
          privacy policy
        </Link>
        . Anything you have ordered as a guest on this number will appear in your order
        history.
      </p>
    </form>
  );
}
