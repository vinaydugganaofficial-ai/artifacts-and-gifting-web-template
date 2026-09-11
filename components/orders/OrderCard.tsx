import Link from "next/link";
import Image from "next/image";

import type { OrderSummaryView } from "@/types/order";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { formatDate, formatPrice, toDateTimeAttribute, cn } from "@/lib/utils";

type OrderCardProps = {
  order: OrderSummaryView;
  className?: string;
};

/** One row in an order listing. */
export function OrderCard({ order, className }: OrderCardProps) {
  return (
    <article
      className={cn(
        "flex flex-wrap items-center gap-5 border border-charcoal/10 p-5 transition-colors hover:border-gold/40 sm:flex-nowrap",
        className,
      )}
    >
      <div className="relative size-20 shrink-0 overflow-hidden bg-charcoal">
        <Image
          src={order.previewImage}
          alt={order.previewAlt}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-xl">
            <Link
              href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
              className="link-underline"
            >
              {order.orderNumber}
            </Link>
          </h3>
          <OrderStatusBadge status={order.status} />
        </div>

        <p className="mt-2 text-sm text-charcoal/55">
          <time dateTime={toDateTimeAttribute(order.placedAt)}>
            {formatDate(order.placedAt)}
          </time>
          {" · "}
          {order.itemCount === 1 ? "1 piece" : `${order.itemCount} pieces`}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <p className="text-sm tabular-nums">{formatPrice(order.total)}</p>
        <Link
          href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
          className="text-[10px] uppercase tracking-[0.22em] text-charcoal/60 transition-colors hover:text-gold"
        >
          View
        </Link>
      </div>
    </article>
  );
}
