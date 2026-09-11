import Link from "next/link";

import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pageCount: number;
  /** Base path, e.g. `/shop`. */
  basePath: string;
  /** Current filters, preserved across page changes. */
  params: Record<string, string | undefined>;
};

function hrefFor(
  basePath: string,
  params: Record<string, string | undefined>,
  page: number,
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }

  // Page 1 is the canonical, unparameterised URL.
  if (page > 1) search.set("page", String(page));

  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** Server-rendered pagination. Real links, so each page is crawlable. */
export function Pagination({ page, pageCount, basePath, params }: PaginationProps) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const linkClass =
    "grid h-11 min-w-11 place-items-center border px-3 text-[11px] uppercase tracking-[0.2em] transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={hrefFor(basePath, params, page - 1)}
          rel="prev"
          className={cn(linkClass, "border-deep-brown/15 text-deep-brown hover:border-forest hover:text-forest")}
        >
          Previous
        </Link>
      ) : null}

      {pages.map((value) => (
        <Link
          key={value}
          href={hrefFor(basePath, params, value)}
          aria-current={value === page ? "page" : undefined}
          className={cn(
            linkClass,
            value === page
              ? "border-forest bg-forest text-off-white font-medium"
              : "border-deep-brown/15 text-deep-brown/70 hover:border-forest hover:text-forest",
          )}
        >
          {value}
        </Link>
      ))}

      {page < pageCount ? (
        <Link
          href={hrefFor(basePath, params, page + 1)}
          rel="next"
          className={cn(linkClass, "border-deep-brown/15 text-deep-brown hover:border-forest hover:text-forest")}
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
