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
        <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-terracotta">Offers & Courtesies</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-forest sm:text-5xl">
          Coupons and offers
        </h1>
        <span className="mt-6 block h-px w-16 bg-terracotta" aria-hidden />
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-deep-brown/80">
          Apply a code in the bag or at checkout.{" "}
          {memberOffers.length > 0
            ? `${memberOffers.length === 1 ? "One courtesy is" : `${memberOffers.length} courtesies are`} reserved for registered patrons — that includes you.`
            : "We add new seasonal curations and member privileges here first."}
        </p>
      </header>

      <div className="mt-12">
        <CouponList offers={offers} />
      </div>

      <p className="mt-12 border-t border-deep-brown/15 pt-8 text-xs leading-relaxed text-deep-brown/60">
        One courtesy coupon per order. Offers cannot be combined, and the discount is applied to
        the subtotal before delivery.
      </p>
    </div>
  );
}
