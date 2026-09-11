"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { trackOrderSchema, type TrackOrderInput } from "@/lib/api/schemas";
import { trackOrder, type TrackedOrder } from "@/lib/api/client";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice, toDateTimeAttribute } from "@/lib/utils";

/**
 * Public order tracking.
 *
 * Needs the order number AND the mobile number it was placed with, so a guessed
 * order number on its own reveals nothing.
 */
export function TrackOrderForm({ defaultPhone = "" }: { defaultPhone?: string }) {
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackOrderInput>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { orderNumber: "", phone: defaultPhone },
  });

  async function onSubmit(values: TrackOrderInput) {
    setSubmitError(null);
    setOrder(null);

    const result = await trackOrder(values);

    if (!result.ok) {
      setSubmitError(result.error.message);
      return;
    }

    setOrder(result.data);
  }

  return (
    <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-20">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <Field
          htmlFor="track-number"
          label="Order number"
          hint="On your confirmation, e.g. AAR-2026-K4T9M."
          error={errors.orderNumber?.message}
        >
          <Input
            id="track-number"
            autoComplete="off"
            placeholder="AAR-2026-K4T9M"
            invalid={Boolean(errors.orderNumber)}
            className="uppercase tracking-[0.1em]"
            {...register("orderNumber")}
          />
        </Field>

        <Field
          htmlFor="track-phone"
          label="Mobile number"
          hint="The number the order was placed with, including the country code."
          error={errors.phone?.message}
        >
          <Input
            id="track-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98200 11223"
            invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
        </Field>

        {submitError ? (
          <p role="alert" className="text-sm text-danger">
            {submitError}
          </p>
        ) : null}

        <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Looking…" : "Track order"}
        </Button>

        <p className="text-xs leading-relaxed text-charcoal/50">
          Have an account?{" "}
          <Link href="/account/orders" className="link-underline text-charcoal/70">
            Your orders are listed there
          </Link>{" "}
          without needing a number.
        </p>
      </form>

      <div aria-live="polite">
        {order ? (
          <article className="border border-charcoal/10 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="font-display text-3xl">{order.orderNumber}</h2>
              <OrderStatusBadge status={order.status} />
            </div>

            <p className="mt-4 text-sm text-charcoal/60">
              Placed{" "}
              <time dateTime={toDateTimeAttribute(order.placedAt)}>
                {formatDate(order.placedAt)}
              </time>
              {" · "}
              {order.itemCount === 1 ? "1 piece" : `${order.itemCount} pieces`}
              {" · "}
              {formatPrice(order.total)}
            </p>

            <p className="mt-1 text-sm text-charcoal/60">
              For {order.recipient} in {order.city}
            </p>

            {order.estimatedDelivery && order.status !== "delivered" ? (
              <p className="mt-4 border-t border-charcoal/10 pt-4 text-sm text-charcoal/70">
                Estimated delivery{" "}
                <time dateTime={toDateTimeAttribute(order.estimatedDelivery)}>
                  {formatDate(order.estimatedDelivery)}
                </time>
                {order.trackingNumber ? (
                  <>
                    {" · Reference "}
                    <span className="text-charcoal">{order.trackingNumber}</span>
                  </>
                ) : null}
              </p>
            ) : null}

            <ul className="mt-6 flex flex-wrap gap-4 border-y border-charcoal/10 py-5">
              {order.lines.map((line) => (
                <li key={line.slug} className="flex items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden bg-charcoal">
                    <Image
                      src={line.image}
                      alt={line.imageAlt}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm text-charcoal/70">
                    {line.name}
                    <span className="text-charcoal/40"> × {line.quantity}</span>
                  </span>
                </li>
              ))}
            </ul>

            <OrderTimeline
              status={order.status}
              history={order.history}
              className="mt-8"
            />
          </article>
        ) : null}
      </div>
    </div>
  );
}
