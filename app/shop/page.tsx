import type { Metadata } from "next";

import { listProducts, listCollections } from "@/lib/services/catalog.service";
import { PRODUCT_SORTS, type ProductSort } from "@/types/product";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ShopFilters } from "@/components/products/ShopFilters";
import { Pagination } from "@/components/products/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Collection — Handcrafted Indian Artifacts & Heritage Gifting",
  description:
    "Explore the complete Viraasat collection — traditional brass figurines, heritage home décor, sacred forms, and curated gifting edits.",
  alternates: { canonical: "/shop" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function readSort(value: string | undefined): ProductSort {
  return PRODUCT_SORTS.includes(value as ProductSort)
    ? (value as ProductSort)
    : "featured";
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const collection = readParam(params, "collection") ?? "";
  const occasion = readParam(params, "occasion") ?? "";
  const budget = readParam(params, "budget") ?? "";
  const sort = readSort(readParam(params, "sort"));
  const inStockOnly = readParam(params, "inStockOnly") === "true";
  const page = Number.parseInt(readParam(params, "page") ?? "1", 10);

  const [result, collections] = await Promise.all([
    listProducts({
      collection: collection || undefined,
      occasion: occasion || undefined,
      budget: budget || undefined,
      sort,
      inStockOnly,
      page: Number.isFinite(page) ? page : 1,
    }),
    listCollections(),
  ]);

  const activeCollection = collections.find((item) => item.slug === collection);

  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="Viraasat Catalogue"
          title="All Artifacts & Gifting"
          description="A gathering of hand-cast brass idols, heirloom vessels, and curated gifts. Each piece is crafted in generational workshops and wrapped for meaningful moments."
        />

        <ShopFilters
          collections={collections}
          collection={collection}
          occasion={occasion}
          budget={budget}
          sort={sort}
          inStockOnly={inStockOnly}
          action="/shop"
          resultCount={result.total}
        />

        {result.items.length > 0 ? (
          <>
            <ProductGrid products={result.items} className="mt-12" priorityCount={3} />
            <Pagination
              page={result.page}
              pageCount={result.pageCount}
              basePath="/shop"
              params={{
                collection: collection || undefined,
                occasion: occasion || undefined,
                budget: budget || undefined,
                sort: sort === "featured" ? undefined : sort,
                inStockOnly: inStockOnly ? "true" : undefined,
              }}
            />
          </>
        ) : (
          <EmptyState
            className="mt-12"
            title="Nothing matches those filters."
            description={
              activeCollection
                ? `There are no pieces in ${activeCollection.title} matching the rest of your selection.`
                : "Try widening the selection or clearing your filters to view the full collection."
            }
            action={{ href: "/shop", label: "Clear filters" }}
          />
        )}
      </div>
    </section>
  );
}
