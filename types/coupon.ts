/** Coupon domain model. */

export type CouponKind = "percentage" | "fixed" | "free_shipping";

export type Coupon = {
  code: string;
  title: string;
  description: string;
  kind: CouponKind;
  /** Percent for `percentage`, minor-unit-free amount for `fixed`, 0 otherwise. */
  value: number;
  /** Order subtotal required before the coupon applies. */
  minSubtotal: number;
  /** Caps the discount on percentage coupons. 0 means uncapped. */
  maxDiscount: number;
  /** ISO date; the coupon is invalid from this instant. */
  expiresAt: string;
  /** Only signed-in customers may use it. */
  membersOnly: boolean;
  active: boolean;
};

/** A coupon plus whether it can be used against the cart in hand. */
export type CouponOffer = Coupon & {
  eligible: boolean;
  /** Why it cannot be used, when `eligible` is false. */
  reason?: string;
  /** What it would take off the current subtotal. */
  projectedDiscount: number;
};

export type AppliedCoupon = {
  code: string;
  title: string;
  discount: number;
  /** Set when the coupon also waives delivery. */
  freeShipping: boolean;
};
