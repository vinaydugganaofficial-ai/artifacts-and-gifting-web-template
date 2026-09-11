import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth/guard";
import { getRecentOrdersForUser } from "@/lib/services/order.service";
import { listAddresses } from "@/lib/services/account.service";
import { listCouponOffers } from "@/lib/services/coupon.service";
import { siteConfig } from "@/config/site";
import { OrderCard } from "@/components/orders/OrderCard";
import { StatCard, LocalCountCards } from "@/components/account/WishlistCountCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Account",
  description: "Your orders, addresses, saved pieces and offers.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await requireUser("/account");

  // Independent reads, issued together rather than in sequence.
  const [recentOrders, addresses, offers] = await Promise.all([
    getRecentOrdersForUser(user.id, siteConfig.commerce.recentOrderLimit),
    listAddresses(user.id),
    listCouponOffers({ subtotal: 0, signedIn: true }),
  ]);

  const firstName = user.name.split(" ")[0];
  const bestOffer = offers[0];

  return (
    <div>
      <header>
        <p className="text-[11px] uppercase tracking-[0.38em] text-gold-muted">
          Overview
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
          Good to see you, {firstName}.
        </h1>
        <span className="mt-6 block h-px w-16 bg-gold" aria-hidden />
      </header>

      {/* Counts: two from the server, two from this browser. */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Orders"
          value={recentOrders.length}
          caption={recentOrders.length === 1 ? "order placed" : "orders placed"}
          href="/account/orders"
          action="View orders"
        />
        <StatCard
          label="Addresses"
          value={addresses.length}
          caption={addresses.length === 1 ? "address saved" : "addresses saved"}
          href="/account/addresses"
          action="Manage addresses"
        />
        <LocalCountCards />
      </div>

      {/* Recent orders */}
      <section className="mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl">Recent orders</h2>
          {recentOrders.length > 0 ? (
            <Link
              href="/account/orders"
              className="text-[10px] uppercase tracking-[0.22em] text-charcoal/60 transition-colors hover:text-gold"
            >
              View all
            </Link>
          ) : null}
        </div>

        <span className="mt-4 block h-px w-10 bg-gold" aria-hidden />

        {recentOrders.length > 0 ? (
          <div className="mt-8 space-y-4">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-8"
            title="No orders yet."
            description="When you place an order it will appear here, with its progress from the workshop to your door."
            action={{ href: "/shop", label: "Explore the collection" }}
          />
        )}
      </section>

      {/* Offers */}
      <section className="mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl">Offers for you</h2>
          <Link
            href="/account/coupons"
            className="text-[10px] uppercase tracking-[0.22em] text-charcoal/60 transition-colors hover:text-gold"
          >
            All offers
          </Link>
        </div>

        <span className="mt-4 block h-px w-10 bg-gold" aria-hidden />

        {bestOffer ? (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border border-gold/40 bg-gold/5 p-6">
            <div className="min-w-0">
              <p className="font-display text-xl">{bestOffer.title}</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-charcoal/65">
                {bestOffer.description}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-gold-muted">
                Code {bestOffer.code}
                {bestOffer.minSubtotal > 0
                  ? ` · over ${formatPrice(bestOffer.minSubtotal)}`
                  : ""}
              </p>
            </div>

            <Link
              href="/shop"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <p className="mt-8 text-sm text-charcoal/55">
            No offers are running at the moment. New ones appear here first.
          </p>
        )}
      </section>

      {/* Quick links */}
      <section className="mt-16 border-t border-charcoal/10 pt-10">
        <h2 className="text-[11px] uppercase tracking-[0.24em] text-charcoal/45">
          Also here
        </h2>

        <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {[
            { href: "/account/orders", label: "View orders" },
            { href: "/track-order", label: "Track an order" },
            { href: "/account/addresses", label: "Addresses" },
            { href: "/account/settings", label: "Account settings" },
            { href: "/wishlist", label: "Wishlist" },
            { href: "/account/coupons", label: "Coupons" },
          ].map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="link-underline text-charcoal/75">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
