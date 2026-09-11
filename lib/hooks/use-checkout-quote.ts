"use client";

import { useEffect, useState } from "react";

import { fetchQuote } from "@/lib/api/client";
import type { PricedCart } from "@/lib/services/order.types";
import type { CartItem } from "@/lib/store/commerce";

export type CheckoutQuoteState = {
  quote: PricedCart | null;
  loading: boolean;
  error: string | null;
};

/**
 * Server-priced quote for the current cart.
 *
 * The checkout summary renders only from this, never from figures computed in
 * the browser — so what a customer is shown always comes from the same code
 * that prices the real order.
 *
 * State is written only from the async callback and `loading` is derived from a
 * settled key, so the effect never triggers a cascading render.
 */
export function useCheckoutQuote(
  items: readonly CartItem[],
  couponCode: string,
): CheckoutQuoteState {
  // A stable primitive that changes whenever the request would change.
  const key = JSON.stringify({
    items: items.map((item) => [item.productId, item.quantity]),
    couponCode,
  });

  const [settled, setSettled] = useState<{
    key: string;
    quote: PricedCart | null;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    const payload = JSON.parse(key) as {
      items: Array<[string, number]>;
      couponCode: string;
    };

    if (payload.items.length === 0) {
      return;
    }

    const controller = new AbortController();

    fetchQuote(
      {
        items: payload.items.map(([productId, quantity]) => ({ productId, quantity })),
        couponCode: payload.couponCode || undefined,
      },
      { signal: controller.signal },
    ).then((result) => {
      if (controller.signal.aborted) return;

      setSettled(
        result.ok
          ? { key, quote: result.data, error: null }
          : { key, quote: null, error: result.error.message },
      );
    });

    return () => controller.abort();
  }, [key]);

  if (items.length === 0) {
    return { quote: null, loading: false, error: null };
  }

  const isCurrent = settled?.key === key;

  return {
    quote: isCurrent ? settled.quote : null,
    loading: !isCurrent,
    error: isCurrent ? settled.error : null,
  };
}
