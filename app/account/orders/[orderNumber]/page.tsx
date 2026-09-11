import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { requireUser } from "@/lib/auth/guard";
import { getOrderForUser } from "@/lib/services/order.service";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { formatDate, formatPrice, toDateTimeAttribute } from "@/lib/utils";

type Props = {
  params: Promise<{ orderNumber: string }>;
};

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

export default async function OrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;
  const user = await requireUser(`/account/orders/${orderNumber}`);

  // The service checks ownership, so an order belonging to someone else is
  // indistinguishable from one that does not exist.
  const order = await getOrderForUser(decodeURIComponent(orderNumber), user.id);
  if (!order) notFound();

  const { totals } = order;

  return (
    <div>
      <Breadcrumbs
        items={[
          { href: "/account", label: "Account" },
          { href: "/account/orders", label: "Orders" },
          { label: order.orderNumber },
        ]}
      />

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="font-display text-4xl leading-tight text-forest sm:text-5xl">
            {order.orderNumber}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>

        <span className="mt-6 block h-px w-16 bg-terracotta" aria-hidden />

        <p className="mt-6 text-sm text-deep-brown/70">
          Placed{" "}
          <time dateTime={toDateTimeAttribute(order.placedAt)}>
            {formatDate(order.placedAt)}
          </time>
          {order.estimatedDelivery && order.status !== "delivered" ? (
            <>
              {" · Estimated delivery "}
              <time dateTime={toDateTimeAttribute(order.estimatedDelivery)}>
                {formatDate(order.estimatedDelivery)}
              </time>
            </>
          ) : null}
        </p>

        {order.trackingNumber ? (
          <p className="mt-2 text-sm text-deep-brown/70">
            Tracking reference{" "}
            <span className="font-medium text-forest">{order.trackingNumber}</span>
          </p>
        ) : null}
      </header>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div>
          {/* Progress */}
          <section>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.24em] text-terracotta">
              Progress
            </h2>
            <OrderTimeline
              status={order.status}
              history={order.history}
              className="mt-8"
            />
          </section>

          {/* Items */}
          <section className="mt-14">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.24em] text-terracotta">
              Curated Pieces
            </h2>

            <ul className="mt-6 divide-y divide-deep-brown/15 border-y border-deep-brown/15">
              {order.lines.map((line) => (
                <li key={line.productId} className="flex gap-5 py-5">
                  <Link
                    href={`/products/${line.slug}`}
                    className="relative size-24 shrink-0 overflow-hidden bg-[#EAE0CF] p-1.5"
                  >
                    <Image
                      src={line.image}
                      alt={line.imageAlt}
                      fill
                      sizes="96px"
                      className="object-contain"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${line.slug}`}
                      className="link-underline font-display text-lg text-forest hover:text-terracotta"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-1 text-sm text-deep-brown/65">
                      {formatPrice(line.unitPrice)} × {line.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-medium tabular-nums text-deep-brown">
                    {formatPrice(line.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {order.note ? (
            <section className="mt-12">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.24em] text-terracotta">
                Gifting / Bespoke Note
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-deep-brown/80">
                {order.note}
              </p>
            </section>
          ) : null}
        </div>

        {/* Summary + delivery */}
        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <div className="border border-deep-brown/15 bg-sand/20 p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-terracotta">Summary</p>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-deep-brown/70">Subtotal</dt>
                <dd className="tabular-nums font-medium text-deep-brown">{formatPrice(totals.subtotal)}</dd>
              </div>

              {totals.discount > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-deep-brown/70">
                    Discount
                    {order.couponCode ? (
                      <span className="ml-1 text-deep-brown/50">({order.couponCode})</span>
                    ) : null}
                  </dt>
                  <dd className="tabular-nums font-medium text-forest">
                    −{formatPrice(totals.discount)}
                  </dd>
                </div>
              ) : null}

              <div className="flex justify-between gap-4">
                <dt className="text-deep-brown/70">Delivery</dt>
                <dd className="tabular-nums font-medium text-deep-brown">
                  {totals.shipping === 0 ? "Included" : formatPrice(totals.shipping)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex justify-between border-t border-deep-brown/15 pt-5 text-base font-medium text-forest">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(totals.total)}</span>
            </div>
          </div>

          <div className="border border-deep-brown/15 bg-sand/20 p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-terracotta">
              Delivering to
            </p>

            <address className="mt-4 text-sm not-italic leading-relaxed text-deep-brown/80">
              <span className="block font-medium text-forest">
                {order.shippingAddress.recipient}
              </span>
              <span className="block">{order.shippingAddress.line1}</span>
              {order.shippingAddress.line2 ? (
                <span className="block">{order.shippingAddress.line2}</span>
              ) : null}
              <span className="block">
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </span>
              <span className="block">{order.shippingAddress.country}</span>
              <span className="mt-2 block text-deep-brown/60">
                {order.shippingAddress.phone}
              </span>
            </address>
          </div>

          <p className="text-xs leading-relaxed text-deep-brown/60">
            Something not right with this order?{" "}
            <Link href="/contact" className="link-underline font-medium text-forest hover:text-terracotta">
              Write to the concierge
            </Link>{" "}
            quoting {order.orderNumber}.
          </p>
        </aside>
      </div>
    </div>
  );
}
