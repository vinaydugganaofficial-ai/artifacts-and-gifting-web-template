"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import type { Collection, ProductSort } from "@/types/product";
import { PRODUCT_SORTS, PRODUCT_SORT_LABELS } from "@/types/product";
import { Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type ShopFiltersProps = {
  collections: readonly Collection[];
  collection: string;
  sort: ProductSort;
  inStockOnly: boolean;
  /** Route the form submits to, e.g. `/shop`. */
  action: string;
  resultCount: number;
};

/**
 * Catalog filters.
 *
 * A real `<form method="get">`: with JavaScript disabled it still submits and
 * filters, because the page reads its state from the URL on the server. The
 * client enhancement simply submits on change so no "Apply" press is needed.
 */
export function ShopFilters({
  collections,
  collection,
  sort,
  inStockOnly,
  action,
  resultCount,
}: ShopFiltersProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  function submitNow(form: HTMLFormElement) {
    const data = new FormData(form);
    const params = new URLSearchParams();

    for (const [key, value] of data.entries()) {
      if (typeof value === "string" && value !== "") params.set(key, value);
    }

    // Any filter change invalidates the current page number.
    params.delete("page");

    const query = params.toString();
    router.push(query ? `${action}?${query}` : action, { scroll: false });
  }

  return (
    <form
      ref={formRef}
      method="get"
      action={action}
      onChange={(event) => submitNow(event.currentTarget)}
      onSubmit={(event) => {
        event.preventDefault();
        submitNow(event.currentTarget);
      }}
      className="mt-12 flex flex-col gap-6 border-y border-charcoal/10 py-6 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="filter-collection"
            className="text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
          >
            Collection
          </label>
          <Select
            id="filter-collection"
            name="collection"
            defaultValue={collection}
            className="min-w-52"
          >
            <option value="">All collections</option>
            {collections.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title} ({item.count})
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="filter-sort"
            className="text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
          >
            Sort
          </label>
          <Select id="filter-sort" name="sort" defaultValue={sort} className="min-w-52">
            {PRODUCT_SORTS.map((value) => (
              <option key={value} value={value}>
                {PRODUCT_SORT_LABELS[value]}
              </option>
            ))}
          </Select>
        </div>

        <label className="flex cursor-pointer items-center gap-3 pb-3 text-[11px] uppercase tracking-[0.2em] text-charcoal/70">
          <input
            type="checkbox"
            name="inStockOnly"
            value="true"
            defaultChecked={inStockOnly}
            className="size-4 accent-[var(--color-gold)]"
          />
          Available only
        </label>
      </div>

      <div className="flex items-center gap-6">
        <p
          aria-live="polite"
          className="text-[11px] uppercase tracking-[0.22em] text-charcoal/50"
        >
          {resultCount === 1 ? "1 piece" : `${resultCount} pieces`}
        </p>

        {/* Visible only without JavaScript, where `onChange` cannot submit. */}
        <noscript>
          <Button type="submit" variant="outline" size="sm">
            Apply
          </Button>
        </noscript>
      </div>
    </form>
  );
}
