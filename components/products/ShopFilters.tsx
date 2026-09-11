"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import type { Collection, ProductSort } from "@/types/product";
import { PRODUCT_SORTS, PRODUCT_SORT_LABELS } from "@/types/product";
import { CustomSelect } from "@/components/ui/custom-select";
import { Button } from "@/components/ui/button";

type ShopFiltersProps = {
  collections: readonly Collection[];
  collection: string;
  occasion?: string;
  budget?: string;
  sort: ProductSort;
  inStockOnly: boolean;
  /** Route the form submits to, e.g. `/shop`. */
  action: string;
  resultCount: number;
};

const OCCASIONS = [
  { value: "", label: "All Occasions" },
  { value: "corporate", label: "Corporate Gifting" },
  { value: "wedding", label: "Wedding & Favors" },
  { value: "housewarming", label: "Housewarming (Griha Pravesh)" },
  { value: "festivals", label: "Festive & Ceremonial" },
];

const BUDGETS = [
  { value: "", label: "All Budgets" },
  { value: "under-500", label: "Under ₹500" },
  { value: "500-1000", label: "₹500 – ₹1,000" },
  { value: "1000-2500", label: "₹1,000 – ₹2,500" },
  { value: "2500-5000", label: "₹2,500 – ₹5,000" },
  { value: "premium", label: "Premium (₹5,000+)" },
];

export function ShopFilters({
  collections,
  collection,
  occasion = "",
  budget = "",
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

    params.delete("page");
    const query = params.toString();
    router.push(query ? `${action}?${query}` : action, { scroll: false });
  }

  const collectionOptions = [
    { value: "", label: "All collections" },
    ...collections.map((item) => ({
      value: item.slug,
      label: item.title,
      count: item.count,
    })),
  ];

  const occasionOptions = OCCASIONS;
  const budgetOptions = BUDGETS;
  const sortOptions = PRODUCT_SORTS.map((value) => ({
    value,
    label: PRODUCT_SORT_LABELS[value],
  }));

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
      className="mt-12 flex flex-col gap-6 border-y border-deep-brown/15 py-6 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end gap-5 sm:gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="filter-collection"
            className="text-[10px] uppercase tracking-[0.22em] text-deep-brown/60"
          >
            Collection
          </label>
          <CustomSelect
            id="filter-collection"
            name="collection"
            defaultValue={collection}
            options={collectionOptions}
            className="min-w-44"
            onValueChange={() => formRef.current && submitNow(formRef.current)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="filter-occasion"
            className="text-[10px] uppercase tracking-[0.22em] text-deep-brown/60"
          >
            Occasion
          </label>
          <CustomSelect
            id="filter-occasion"
            name="occasion"
            defaultValue={occasion}
            options={occasionOptions}
            className="min-w-44"
            onValueChange={() => formRef.current && submitNow(formRef.current)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="filter-budget"
            className="text-[10px] uppercase tracking-[0.22em] text-deep-brown/60"
          >
            Budget
          </label>
          <CustomSelect
            id="filter-budget"
            name="budget"
            defaultValue={budget}
            options={budgetOptions}
            className="min-w-44"
            onValueChange={() => formRef.current && submitNow(formRef.current)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="filter-sort"
            className="text-[10px] uppercase tracking-[0.22em] text-deep-brown/60"
          >
            Sort
          </label>
          <CustomSelect
            id="filter-sort"
            name="sort"
            defaultValue={sort}
            options={sortOptions}
            className="min-w-40"
            onValueChange={() => formRef.current && submitNow(formRef.current)}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 pb-3 text-[11px] uppercase tracking-[0.2em] text-deep-brown/80">
          <input
            type="checkbox"
            name="inStockOnly"
            value="true"
            defaultChecked={inStockOnly}
            className="size-4 accent-[var(--color-terracotta)]"
          />
          Available only
        </label>
      </div>

      <div className="flex items-center gap-6">
        <p
          aria-live="polite"
          className="text-[11px] uppercase tracking-[0.22em] text-terracotta font-medium"
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
