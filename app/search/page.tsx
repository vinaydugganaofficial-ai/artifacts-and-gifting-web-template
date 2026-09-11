import type { Metadata } from "next";

import { listProducts } from "@/lib/services/catalog.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductGrid } from "@/components/products/ProductGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/products/Pagination";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Aaranya collection of handcrafted Indian brass.",
  // Search result pages should not be indexed or dilute the catalog's ranking.
  robots: { index: false, follow: true },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Full search results.
 *
 * The destination the search overlay hands off to, so pressing Enter lands on a
 * real, shareable, linkable page instead of dropping the query.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = (readParam(params, "q") ?? "").trim();
  const page = Number.parseInt(readParam(params, "page") ?? "1", 10);

  const result = query
    ? await listProducts({ q: query, page: Number.isFinite(page) ? page : 1 })
    : null;

  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="Search"
          title={query ? `Results for “${query}”` : "Search the collection"}
          description={
            result
              ? result.total === 1
                ? "One piece matches."
                : `${result.total} pieces match.`
              : "Use the search in the header to look for a name, a form, or a collection."
          }
        />

        {result && result.items.length > 0 ? (
          <>
            <ProductGrid products={result.items} className="mt-14" priorityCount={3} />
            <Pagination
              page={result.page}
              pageCount={result.pageCount}
              basePath="/search"
              params={{ q: query }}
            />
          </>
        ) : null}

        {result && result.items.length === 0 ? (
          <EmptyState
            className="mt-14"
            title="No pieces match that search."
            description="Try a name such as Nataraja or Ganesha, a form such as lamp or bell, or browse the full collection."
            action={{ href: "/shop", label: "View all artifacts" }}
          />
        ) : null}

        {!result ? (
          <EmptyState
            className="mt-14"
            title="Nothing searched yet."
            description="Open the search from the header, or browse the collection by room."
            action={{ href: "/collections", label: "Browse collections" }}
          />
        ) : null}
      </div>
    </section>
  );
}
