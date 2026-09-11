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
        "flex flex-wrap items-center gap-5 border border-deep-brown/15 bg-sand/20 p-5 transition-colors hover:border-terracotta sm:flex-nowrap",
        className,
      )}
    >
      <div className="relative size-20 shrink-0 overflow-hidden bg-[#EAE0CF] p-1">
        <Image
          src={order.previewImage}
          alt={order.previewAlt}
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-xl text-forest hover:text-terracotta">
            <Link
              href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
              className="link-underline"
            >
              {order.orderNumber}
            </Link>
          </h3>
          <OrderStatusBadge status={order.status} />
        </div>

        <p className="mt-2 text-sm text-deep-brown/65">
          <time dateTime={toDateTimeAttribute(order.placedAt)}>
            {formatDate(order.placedAt)}
          </time>
          {" · "}
          {order.itemCount === 1 ? "1 piece" : `${order.itemCount} pieces`}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <p className="text-sm font-medium text-deep-brown tabular-nums">{formatPrice(order.total)}</p>
        <Link
          href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
          className="text-[10px] font-medium uppercase tracking-[0.22em] text-deep-brown/70 transition-colors hover:text-terracotta"
        >
          View
        </Link>
      </div>
    </article>
  );
}
