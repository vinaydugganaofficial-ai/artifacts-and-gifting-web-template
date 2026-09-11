import "server-only";

import { couponRepository } from "@/lib/repositories";
import { siteConfig } from "@/config/site";
import type { AppliedCoupon, Coupon, CouponOffer } from "@/types/coupon";

/**
 * Coupon rules.
 *
 * The single place a discount is ever calculated. Both the checkout preview and
 * order placement call `evaluateCoupon`, so what a customer is quoted and what
 * they are charged cannot diverge.
 */

export type CouponContext = {
  subtotal: number;
  /** Members-only coupons require this. */
  signedIn: boolean;
};

export type CouponEvaluation =
  { ok: true; applied: AppliedCoupon } | { ok: false; reason: string };

function isExpired(coupon: Coupon, now: number): boolean {
  return Date.parse(coupon.expiresAt) <= now;
}

/** The money a coupon takes off, floored at 0 and capped at the subtotal. */
function discountFor(coupon: Coupon, subtotal: number): number {
  if (coupon.kind === "free_shipping") return 0;

  const raw =
    coupon.kind === "percentage"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;

  const capped = coupon.maxDiscount > 0 ? Math.min(raw, coupon.maxDiscount) : raw;

  // A discount may never exceed the subtotal — that would invert the total.
  return Math.max(0, Math.min(capped, subtotal));
}

export function evaluateCoupon(
  coupon: Coupon | null,
  context: CouponContext,
  now: number = Date.now(),
): CouponEvaluation {
  if (!coupon || !coupon.active) {
    return { ok: false, reason: "That code is not recognised." };
  }

  if (isExpired(coupon, now)) {
    return { ok: false, reason: "That offer has expired." };
  }

  if (coupon.membersOnly && !context.signedIn) {
    return {
      ok: false,
      reason: "That offer is for signed-in customers. Sign in to use it.",
    };
  }

  if (context.subtotal < coupon.minSubtotal) {
    const shortfall = coupon.minSubtotal - context.subtotal;
    return {
      ok: false,
      reason: `Add ${formatShortfall(shortfall)} more to use this offer.`,
    };
  }

  return {
    ok: true,
    applied: {
      code: coupon.code,
      title: coupon.title,
      discount: discountFor(coupon, context.subtotal),
      freeShipping: coupon.kind === "free_shipping",
    },
  };
}

function formatShortfall(amount: number): string {
  return new Intl.NumberFormat(siteConfig.commerce.priceLocale, {
    style: "currency",
    currency: siteConfig.commerce.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function applyCouponCode(
  code: string,
  context: CouponContext,
): Promise<CouponEvaluation> {
  const coupon = await couponRepository.findByCode(code);
  return evaluateCoupon(coupon, context);
}

/**
 * Every live offer, annotated for the cart in hand.
 *
 * Ineligible coupons are returned rather than hidden, with the reason, so the
 * customer can see what an offer would take to unlock.
 */
export async function listCouponOffers(context: CouponContext): Promise<CouponOffer[]> {
  const all = await couponRepository.list();
  const now = Date.now();

  return all
    .filter((coupon) => !isExpired(coupon, now))
    .map((coupon) => {
      const evaluation = evaluateCoupon(coupon, context, now);

      return {
        ...coupon,
        eligible: evaluation.ok,
        reason: evaluation.ok ? undefined : evaluation.reason,
        projectedDiscount: evaluation.ok ? evaluation.applied.discount : 0,
      };
    })
    .sort(
      (a, b) =>
        Number(b.eligible) - Number(a.eligible) ||
        b.projectedDiscount - a.projectedDiscount,
    );
}
