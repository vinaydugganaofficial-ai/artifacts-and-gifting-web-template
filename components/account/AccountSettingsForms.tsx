"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { profileSchema, type ProfileInput } from "@/lib/api/schemas";
import { updateProfile } from "@/lib/api/client";
import type { User } from "@/types/account";
import { formatPhone } from "@/lib/auth/phone";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store/ui";
import { formatDate, toDateTimeAttribute } from "@/lib/utils";

/** Profile details. */
export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const showToast = useUIStore((state) => state.showToast);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email ?? "",
      marketingOptIn: user.marketingOptIn,
    },
  });

  async function onSubmit(values: ProfileInput) {
    setSubmitError(null);

    const result = await updateProfile(values);

    if (!result.ok) {
      setSubmitError(result.error.message);
      return;
    }

    showToast("Details saved", "success");
    // Re-renders the layout so the sidebar shows the new name.
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-lg space-y-6">
      <Field htmlFor="profile-name" label="Your name" error={errors.name?.message}>
        <Input
          id="profile-name"
          autoComplete="name"
          invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "profile-name-error" : undefined}
          {...register("name")}
        />
      </Field>

      <Field htmlFor="profile-phone" label="Mobile number">
        {/* The account's identity. Moving it would need its own verified flow,
            so it is shown as a fact rather than an editable field. */}
        <Input id="profile-phone" value={formatPhone(user.phone)} readOnly disabled />
      </Field>

      <p className="text-xs text-charcoal/50">
        Your mobile number is how you sign in. To move your account to a different number,
        write to the atelier and we will verify the change for you.
      </p>

      <Field
        htmlFor="profile-email"
        label="Email"
        hint="Optional. Used only for written order confirmations."
        error={errors.email?.message}
      >
        <Input
          id="profile-email"
          type="email"
          autoComplete="email"
          invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "profile-email-error" : "profile-email-hint"}
          {...register("email")}
        />
      </Field>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-charcoal/70">
        <input
          type="checkbox"
          className="mt-0.5 size-4 accent-[var(--color-gold)]"
          {...register("marketingOptIn")}
        />
        <span>Send me new collections and artisan stories.</span>
      </label>

      {submitError ? (
        <p role="alert" className="text-sm text-danger">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
        {isSubmitting ? "Saving…" : "Save details"}
      </Button>

      <p className="text-xs text-charcoal/45">
        Member since{" "}
        <time dateTime={toDateTimeAttribute(user.createdAt)}>
          {formatDate(user.createdAt)}
        </time>
        .
      </p>
    </form>
  );
}

/**
 * How signing in works.
 *
 * Replaces the old password form: there is no password to change, so this
 * explains the mechanism and where to go if the number itself must move.
 */
export function SignInMethodPanel({ user }: { user: User }) {
  return (
    <div className="max-w-lg space-y-4 border border-charcoal/10 p-6">
      <p className="text-[11px] uppercase tracking-[0.24em] text-gold-muted">
        One-time code
      </p>

      <p className="text-[15px] leading-relaxed text-charcoal/70">
        You sign in with a code sent to{" "}
        <span className="whitespace-nowrap text-charcoal">{formatPhone(user.phone)}</span>
        . There is no password on this account, so there is nothing to forget, reuse or
        have stolen.
      </p>

      <p className="text-sm leading-relaxed text-charcoal/55">
        Codes expire a few minutes after they are sent and can only be used once. If you
        receive one you did not ask for, someone has your number but not your phone —
        ignore it, and tell us if it keeps happening.
      </p>
    </div>
  );
}
