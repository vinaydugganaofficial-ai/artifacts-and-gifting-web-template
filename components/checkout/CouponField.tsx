"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import type { AppliedCoupon } from "@/types/coupon";
import { couponCodeSchema } from "@/lib/api/schemas";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type CouponFieldProps = {
  value: string;
  /** Lifts the applied code so the parent can re-quote the cart. */
  onApply: (code: string) => void;
  /** The coupon the server accepted, if any. */
  applied: AppliedCoupon | null;
  /** Why the server rejected the current code. */
  errorMessage?: string;
  signedIn: boolean;
};

/**
 * Coupon entry.
 *
 * Validates only the code's shape locally; whether it is real, live and
 * applicable is decided by the server, which is what re-prices the cart.
 */
export function CouponField({
  value,
  onApply,
  applied,
  errorMessage,
  signedIn,
}: CouponFieldProps) {
  const [draft, setDraft] = useState(value);
  const [localError, setLocalError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const parsed = couponCodeSchema.safeParse({ code: draft });

    if (!parsed.success) {
      setLocalError(parsed.error.issues[0]?.message ?? "Enter a valid code.");
      return;
    }

    setLocalError(null);
    onApply(parsed.data.code.toUpperCase());
  }

  function onRemove() {
    setDraft("");
    setLocalError(null);
    onApply("");
  }

  if (applied) {
    return (
      <div className="border border-success/40 bg-success/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-success">
              Applied
            </p>
            <p className="mt-2 text-sm text-charcoal">{applied.title}</p>
            <p className="mt-1 text-xs text-charcoal/55">
              {applied.code}
              {applied.discount > 0 ? ` · saves ${formatPrice(applied.discount)}` : ""}
              {applied.freeShipping ? " · delivery included" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove coupon ${applied.code}`}
            className="grid size-8 shrink-0 place-items-center text-charcoal/50 transition-colors hover:text-danger"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  const message = localError ?? errorMessage;

  return (
    <div className="border border-charcoal/10 p-5">
      <label
        htmlFor="coupon-code"
        className="text-[11px] uppercase tracking-[0.24em] text-charcoal/50"
      >
        Have a coupon?
      </label>

      {/* Not a nested <form>: this sits inside the checkout form, so it commits
          on click and on Enter rather than through form submission. */}
      <div className="mt-3 flex gap-3">
        <Input
          id="coupon-code"
          value={draft}
          onChange={(event) => setDraft(event.target.value.toUpperCase())}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSubmit(event);
          }}
          placeholder="WELCOME10"
          autoComplete="off"
          invalid={Boolean(message)}
          aria-describedby={message ? "coupon-error" : undefined}
          className="uppercase tracking-[0.1em]"
        />

        <Button type="button" variant="outline" size="sm" onClick={onSubmit}>
          Apply
        </Button>
      </div>

      {message ? (
        <p id="coupon-error" role="alert" className="mt-3 text-xs text-danger">
          {message}
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-charcoal/50">
        {signedIn ? (
          <>
            Your offers are on the{" "}
            <Link href="/account/coupons" className="link-underline text-charcoal/70">
              coupons page
            </Link>
            .
          </>
        ) : (
          <>
            <Link
              href="/sign-in?next=%2Fcheckout"
              className="link-underline text-charcoal/70"
            >
              Sign in
            </Link>{" "}
            for offers reserved for members.
          </>
        )}
      </p>
    </div>
  );
}
