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
    <div className="mx-auto max-w-2xl bg-off-white/80 p-8 sm:p-12 border border-deep-brown/12">
      <p className="text-[11px] uppercase tracking-[0.38em] text-terracotta font-medium">Order Confirmed</p>

      <h1 className="mt-4 font-display text-3xl sm:text-4xl leading-tight text-forest">
        Thank you. Your order is placed.
      </h1>

      <span className="mt-5 block h-px w-16 bg-terracotta" aria-hidden />

      <p className="mt-6 text-[16px] leading-relaxed text-deep-brown/80">
        We have sent a confirmation to{" "}
        <span className="whitespace-nowrap text-deep-brown font-medium">
          {formatPhone(receipt.phone)}
        </span>
        {receipt.email ? (
          <>
            {" and "}
            <span className="text-deep-brown font-medium">{receipt.email}</span>
          </>
        ) : null}
        . The Viraasat concierge inspects every piece by hand and prepares our bespoke ceremonial gift packaging before dispatch.
      </p>

      <dl className="mt-10 grid gap-x-8 gap-y-6 border-y border-deep-brown/15 py-8 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.22em] text-deep-brown/50 font-medium">
            Order number
          </dt>
          <dd className="mt-2 font-display text-2xl text-forest">{receipt.orderNumber}</dd>
        </div>

        <div>
          <dt className="text-[10px] uppercase tracking-[0.22em] text-deep-brown/50 font-medium">
            Total
          </dt>
          <dd className="mt-2 font-display text-2xl tabular-nums text-forest">
            {formatPrice(receipt.totals.total)}
          </dd>
        </div>

        <div>
          <dt className="text-[10px] uppercase tracking-[0.22em] text-deep-brown/50 font-medium">
            Payment
          </dt>
          <dd className="mt-2 text-sm text-deep-brown font-medium">{paymentLabel}</dd>
        </div>

        {receipt.estimatedDelivery ? (
          <div>
            <dt className="text-[10px] uppercase tracking-[0.22em] text-deep-brown/50 font-medium">
              Estimated delivery
            </dt>
            <dd className="mt-2 text-sm text-deep-brown font-medium">
              <time dateTime={toDateTimeAttribute(receipt.estimatedDelivery)}>
                {formatDate(receipt.estimatedDelivery)}
              </time>
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-8 text-sm leading-relaxed text-deep-brown/70">
        Keep your order number handy — our concierge will keep you updated as your artifact journeys from the artisan&apos;s workshop to your threshold.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        {signedIn ? (
          <Link
            href={`/account/orders/${encodeURIComponent(receipt.orderNumber)}`}
            className={buttonVariants({ variant: "primary" })}
          >
            View This Order
          </Link>
        ) : (
          <Link href="/track-order" className={buttonVariants({ variant: "primary" })}>
            Track This Order
          </Link>
        )}

        <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }))}>
          Continue Exploring
        </Link>
      </div>

      {!signedIn ? (
        <p className="mt-10 border-t border-deep-brown/12 pt-6 text-sm text-deep-brown/70">
          <Link href="/sign-up" className="link-underline font-medium text-forest hover:text-terracotta">
            Create an account
          </Link>{" "}
          with this phone number to track orders and save gifting preferences automatically.
        </p>
      ) : null}
    </div>
  );
}
