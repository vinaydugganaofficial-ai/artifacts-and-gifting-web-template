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
  title: "Handcrafted Indian Artifacts — Master Sculptures & Heritage Décor",
  description:
    "Discover authentic Indian lost-wax brass figurines, sacred deities, ritual oil lamps, hand-cast urlis, and heritage artifacts cast by generational artisan families.",
  alternates: { canonical: "/artifacts" },
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

export default async function ArtifactsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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
          eyebrow="Indian Craftsmanship & Sculptures"
          title={activeCollection ? activeCollection.title : "Heritage Artifacts"}
          description={
            activeCollection
              ? activeCollection.description
              : "Every piece is cast solid using lost-wax bronze and brass techniques preserved across centuries in Swamimalai, Moradabad, and Bastar. Each artifact carries the chisel mark of the maker."
          }
        />

        <div className="mt-14">
          <ShopFilters
            collections={collections}
            collection={collection}
            occasion={occasion}
            budget={budget}
            sort={sort}
            inStockOnly={inStockOnly}
            action="/artifacts"
            resultCount={result.total}
          />
        </div>

        {result.items.length > 0 ? (
          <>
            <ProductGrid products={result.items} className="mt-10" priorityCount={4} />
            <Pagination
              page={result.page}
              pageCount={result.pageCount}
              basePath="/artifacts"
              params={{
                collection,
                occasion,
                budget,
                sort,
                inStockOnly: inStockOnly ? "true" : undefined,
              }}
            />
          </>
        ) : (
          <EmptyState
            className="mt-14"
            title="No artifacts match the selected criteria."
            description="Clear or adjust your filters to view pieces across all craft collections."
            action={{ href: "/artifacts", label: "Reset filters" }}
          />
        )}
      </div>
    </section>
  );
}
