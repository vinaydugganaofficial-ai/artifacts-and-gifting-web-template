"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";

import type { CouponOffer } from "@/types/coupon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, formatPrice, toDateTimeAttribute, cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store/ui";

type CouponListProps = {
  offers: readonly CouponOffer[];
  /** When set, eligibility is described against this cart subtotal. */
  subtotal?: number;
};

export function CouponList({ offers, subtotal }: CouponListProps) {
  if (offers.length === 0) {
    return (
      <p className="text-sm text-charcoal/55">
        No offers are running at the moment. New ones appear here first.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {offers.map((offer) => (
        <li key={offer.code}>
          <CouponCard offer={offer} subtotal={subtotal} />
        </li>
      ))}
    </ul>
  );
}

function CouponCard({ offer, subtotal }: { offer: CouponOffer; subtotal?: number }) {
  const showToast = useUIStore((state) => state.showToast);
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      showToast(`${offer.code} copied`, "success");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied; the code is visible either way.
      showToast("Could not copy — the code is shown above.", "error");
    }
  }

  return (
    <article
      className={cn(
        "flex h-full flex-col justify-between border p-6",
        offer.eligible ? "border-gold/50 bg-gold/5" : "border-charcoal/10",
      )}
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="font-display text-xl leading-snug">{offer.title}</p>
          {offer.membersOnly ? <Badge tone="gold">Members</Badge> : null}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
          {offer.description}
        </p>

        <dl className="mt-5 space-y-1.5 text-xs text-charcoal/55">
          {offer.minSubtotal > 0 ? (
            <div className="flex gap-2">
              <dt>Minimum</dt>
              <dd className="text-charcoal/75">{formatPrice(offer.minSubtotal)}</dd>
            </div>
          ) : null}

          <div className="flex gap-2">
            <dt>Expires</dt>
            <dd className="text-charcoal/75">
              <time dateTime={toDateTimeAttribute(offer.expiresAt)}>
                {formatDate(offer.expiresAt)}
              </time>
            </dd>
          </div>

          {offer.eligible && offer.projectedDiscount > 0 ? (
            <div className="flex gap-2">
              <dt>On your bag</dt>
              <dd className="text-success">
                saves {formatPrice(offer.projectedDiscount)}
              </dd>
            </div>
          ) : null}
        </dl>

        {!offer.eligible && offer.reason ? (
          <p className="mt-4 text-xs leading-relaxed text-charcoal/50">{offer.reason}</p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-charcoal/10 pt-5">
        <code className="border border-dashed border-charcoal/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em]">
          {offer.code}
        </code>

        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-charcoal/60 transition-colors hover:text-gold"
        >
          {copied ? (
            <Check className="size-3.5" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </button>

        {subtotal === undefined ? (
          <Link
            href="/shop"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "ml-auto px-0",
            )}
          >
            Shop
          </Link>
        ) : null}
      </div>
    </article>
  );
}
