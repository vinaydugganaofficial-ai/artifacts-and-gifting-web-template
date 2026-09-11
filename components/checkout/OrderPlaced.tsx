import Link from "next/link";

import type { PlacedOrderReceipt } from "@/lib/api/client";
import { buttonVariants } from "@/components/ui/button";
import { formatPhone } from "@/lib/auth/phone";
import { formatDate, formatPrice, toDateTimeAttribute, cn } from "@/lib/utils";

type OrderPlacedProps = {
  receipt: PlacedOrderReceipt;
  /** Signed-in customers get a link into their order history. */
  signedIn: boolean;
  paymentLabel: string;
};

/** Confirmation shown once an order has been accepted. */
export function OrderPlaced({ receipt, signedIn, paymentLabel }: OrderPlacedProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-[11px] uppercase tracking-[0.38em] text-gold-muted">Confirmed</p>

      <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
        Thank you. Your order is placed.
      </h1>

      <span className="mt-6 block h-px w-16 bg-gold" aria-hidden />

      <p className="mt-6 text-[16px] leading-relaxed text-charcoal/70">
        We have sent a confirmation to{" "}
        <span className="whitespace-nowrap text-charcoal">
          {formatPhone(receipt.phone)}
        </span>
        {receipt.email ? (
          <>
            {" and "}
            <span className="text-charcoal">{receipt.email}</span>
          </>
        ) : null}
        . The atelier checks every piece by hand before it is packed, and will be in touch
        if anything needs saying.
      </p>

      <dl className="mt-10 grid gap-x-8 gap-y-6 border-y border-charcoal/10 py-8 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
            Order number
          </dt>
          <dd className="mt-2 font-display text-2xl">{receipt.orderNumber}</dd>
        </div>

        <div>
          <dt className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
            Total
          </dt>
          <dd className="mt-2 font-display text-2xl tabular-nums">
            {formatPrice(receipt.totals.total)}
          </dd>
        </div>

        <div>
          <dt className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
            Payment
          </dt>
          <dd className="mt-2 text-sm text-charcoal/75">{paymentLabel}</dd>
        </div>

        {receipt.estimatedDelivery ? (
          <div>
            <dt className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
              Estimated delivery
            </dt>
            <dd className="mt-2 text-sm text-charcoal/75">
              <time dateTime={toDateTimeAttribute(receipt.estimatedDelivery)}>
                {formatDate(receipt.estimatedDelivery)}
              </time>
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-8 text-sm leading-relaxed text-charcoal/60">
        Keep your order number — it is all you need to follow the piece from the workshop
        to your door.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        {signedIn ? (
          <Link
            href={`/account/orders/${encodeURIComponent(receipt.orderNumber)}`}
            className={buttonVariants({ variant: "primary" })}
          >
            View this order
          </Link>
        ) : (
          <Link href="/track-order" className={buttonVariants({ variant: "primary" })}>
            Track this order
          </Link>
        )}

        <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }))}>
          Continue looking
        </Link>
      </div>

      {!signedIn ? (
        <p className="mt-10 border-t border-charcoal/10 pt-6 text-sm text-charcoal/60">
          <Link href="/sign-up" className="link-underline text-charcoal">
            Create an account
          </Link>{" "}
          with {receipt.email} and this order will appear in your history automatically.
        </p>
      ) : null}
    </div>
  );
}
