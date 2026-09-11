"use client";

import { useEffect, useState } from "react";

import { fetchProductsByIds } from "@/lib/api/client";
import type { Product } from "@/types/product";

const NO_PRODUCTS: Product[] = [];

type Settled = {
  /** The id list this result belongs to. */
  key: string;
  products: Product[];
  error: string | null;
};

export type CatalogProductsState = {
  products: Product[];
  /** True while the current id list has no settled response yet. */
  loading: boolean;
  error: string | null;
};

/**
 * Resolves product ids held in browser storage against the catalog API.
 *
 * Keeping this out of the component tree's import graph is what stops the whole
 * product catalog being bundled into the client JavaScript: the cart and
 * wishlist know ids, and ask the server for the rest.
 *
 * Ids the server no longer recognises are simply absent from the response, so a
 * product removed from the catalog degrades to "not shown" rather than a crash.
 *
 * The effect writes state only from its async callback, and `loading` is
 * DERIVED by comparing the settled result's key against the current one. That
 * avoids a synchronous setState per id change (which would cascade an extra
 * render) and makes it impossible for `loading` to disagree with the data.
 */
export function useCatalogProducts(ids: readonly string[]): CatalogProductsState {
  // Ids arrive as a fresh array each render; the joined string gives the effect
  // a stable primitive dependency so it re-runs on content change, not identity.
  const key = ids.join(",");
  const [settled, setSettled] = useState<Settled | null>(null);

  useEffect(() => {
    if (!key) return;

    const controller = new AbortController();

    fetchProductsByIds(key.split(","), { signal: controller.signal }).then((result) => {
      if (controller.signal.aborted) return;

      setSettled(
        result.ok
          ? { key, products: result.data, error: null }
          : { key, products: NO_PRODUCTS, error: result.error.message },
      );
    });

    return () => controller.abort();
  }, [key]);

  if (!key) {
    return { products: NO_PRODUCTS, loading: false, error: null };
  }

  const isCurrent = settled?.key === key;

  return {
    products: isCurrent ? settled.products : NO_PRODUCTS,
    loading: !isCurrent,
    error: isCurrent ? settled.error : null,
  };
}
