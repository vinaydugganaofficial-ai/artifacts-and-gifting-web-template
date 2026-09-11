import Image from "next/image";

import type { PricedCart } from "@/lib/services/order.types";
import { formatPrice, cn } from "@/lib/utils";

type CheckoutSummaryProps = {
  quote: PricedCart | null;
  loading: boolean;
  freeShippingThreshold: number;
  className?: string;
};

/**
 * Order summary.
 *
 * Purely presentational — every figure arrives already priced by the server.
 * Nothing here does arithmetic on money.
 */
export function CheckoutSummary({
  quote,
  loading,
  freeShippingThreshold,
  className,
}: CheckoutSummaryProps) {
  if (loading && !quote) {
    return (
      <div className={cn("animate-pulse border border-deep-brown/10 p-6", className)}>
        <div className="h-3 w-24 bg-deep-brown/10" />
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full bg-deep-brown/10" />
          <div className="h-4 w-2/3 bg-deep-brown/10" />
        </div>
        <div className="mt-8 h-5 w-1/2 bg-deep-brown/10" />
      </div>
    );
  }

  if (!quote) return null;

  const { lines, totals, coupon } = quote;
  const shortfall = freeShippingThreshold - totals.subtotal;

  return (
    <div className={cn("border border-deep-brown/15 bg-sand/30 p-6", className)}>
      <p className="text-[11px] uppercase tracking-[0.28em] text-terracotta font-medium">Your Order</p>

      <ul className="mt-5 space-y-4">
        {lines.map((line) => (
          <li key={line.productId} className="flex gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden border border-deep-brown/10 bg-[#EAE0CF] p-1">
              <Image
                src={line.image}
                alt={line.imageAlt}
                fill
                sizes="64px"
                className="object-contain p-0.5"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-deep-brown font-medium">{line.name}</p>
              <p className="mt-1 text-xs text-deep-brown/60">
                {formatPrice(line.unitPrice)} × {line.quantity}
              </p>
            </div>

            <p className="shrink-0 text-sm tabular-nums font-medium text-deep-brown">{formatPrice(line.lineTotal)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3 border-t border-deep-brown/12 pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-deep-brown/70">Subtotal</dt>
          <dd className="tabular-nums font-medium text-deep-brown">{formatPrice(totals.subtotal)}</dd>
        </div>

        {totals.discount > 0 && coupon ? (
          <div className="flex justify-between gap-4">
            <dt className="text-deep-brown/70">
              {coupon.title}
              <span className="ml-1 text-deep-brown/50">({coupon.code})</span>
            </dt>
            <dd className="tabular-nums text-forest font-medium">−{formatPrice(totals.discount)}</dd>
          </div>
        ) : null}

        <div className="flex justify-between gap-4">
          <dt className="text-deep-brown/70">Delivery</dt>
          <dd className="tabular-nums font-medium text-deep-brown">
            {totals.shipping === 0 ? "Included" : formatPrice(totals.shipping)}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-deep-brown/70">Bespoke Gift Boxing</dt>
          <dd className="text-forest font-medium">Complimentary</dd>
        </div>
      </dl>

      {totals.shipping > 0 && shortfall > 0 ? (
        <p className="mt-4 text-xs leading-relaxed text-deep-brown/60">
          Add {formatPrice(shortfall)} more and delivery is included.
        </p>
      ) : null}

      <div className="mt-5 flex justify-between border-t border-deep-brown/12 pt-5 text-base font-medium text-deep-brown">
        <span>Total</span>
        <span className="tabular-nums font-semibold text-deep-brown">{formatPrice(totals.total)}</span>
      </div>

      {loading ? (
        <p className="mt-4 text-xs text-deep-brown/50" role="status">
          Updating…
        </p>
      ) : null}
    </div>
  );
}
