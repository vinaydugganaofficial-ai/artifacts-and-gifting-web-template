import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth/guard";
import { listOrdersForUser } from "@/lib/services/order.service";
import { OrderCard } from "@/components/orders/OrderCard";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = {
  title: "Your orders",
  description: "Every order you have placed with Viraasat.",
  robots: { index: false, follow: false },
};

export default async function AccountOrdersPage() {
  const user = await requireUser("/account/orders");
  const orders = await listOrdersForUser(user.id);

  return (
    <div>
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-terracotta">Orders</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-forest sm:text-5xl">
          Your orders
        </h1>
        <span className="mt-6 block h-px w-16 bg-terracotta" aria-hidden />
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-deep-brown/80">
          Everything you have curated and ordered, newest first. Open an order to follow its progress
          from the master workshop.
        </p>
      </header>

      {orders.length > 0 ? (
        <>
          <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.22em] text-terracotta">
            {orders.length === 1 ? "1 order" : `${orders.length} orders`}
          </p>

          <div className="mt-5 space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          className="mt-12"
          title="Nothing ordered yet."
          description="When you place an order it will appear here, with its full history and delivery estimate."
          action={{ href: "/shop", label: "Explore the collection" }}
        />
      )}

      <p className="mt-12 border-t border-deep-brown/15 pt-8 text-sm text-deep-brown/65">
        Ordered as a guest?{" "}
        <Link href="/track-order" className="link-underline font-medium text-forest hover:text-terracotta">
          Track it with your order number
        </Link>
        .
      </p>
    </div>
  );
}
