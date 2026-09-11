import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/guard";
import { listCouponOffers } from "@/lib/services/coupon.service";
import { CouponList } from "@/components/account/CouponList";

export const metadata: Metadata = {
  title: "Coupons",
  description: "Offers available on your account.",
  robots: { index: false, follow: false },
};

export default async function AccountCouponsPage() {
  await requireUser("/account/coupons");

  // Subtotal 0: every live offer is listed, each annotated with what it needs.
  const offers = await listCouponOffers({ subtotal: 0, signedIn: true });
  const memberOffers = offers.filter((offer) => offer.membersOnly);

  return (
    <div>
      <header>
        <p className="text-[11px] uppercase tracking-[0.38em] text-gold-muted">Offers</p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
          Coupons and offers
        </h1>
        <span className="mt-6 block h-px w-16 bg-gold" aria-hidden />
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-charcoal/70">
          Apply a code in the bag or at checkout.{" "}
          {memberOffers.length > 0
            ? `${memberOffers.length === 1 ? "One offer is" : `${memberOffers.length} offers are`} reserved for members — that includes you.`
            : "We add new offers here first."}
        </p>
      </header>

      <div className="mt-12">
        <CouponList offers={offers} />
      </div>

      <p className="mt-12 border-t border-charcoal/10 pt-8 text-xs leading-relaxed text-charcoal/50">
        One coupon per order. Offers cannot be combined, and the discount is applied to
        the subtotal before delivery.
      </p>
    </div>
  );
}
