import Link from "next/link";

import { cn } from "@/lib/utils";

export type Crumb = {
  label: string;
  /** Omit on the final crumb — the current page is not a link. */
  href?: string;
};

type BreadcrumbsProps = {
  items: readonly Crumb[];
  className?: string;
};

/** Trail showing where the current page sits. */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("text-[11px]", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 uppercase tracking-[0.2em] text-deep-brown/50">
        {items.map((item, index) => {
          const last = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-terracotta"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className="text-deep-brown font-medium"
                >
                  {item.label}
                </span>
              )}

              {!last ? <span aria-hidden>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
