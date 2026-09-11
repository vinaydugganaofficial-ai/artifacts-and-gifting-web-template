import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: {
    href: string;
    label: string;
  };
  className?: string;
};

/**
 * Shown wherever a list legitimately has nothing in it — an empty bag, an
 * unfilled wishlist, a collection with no pieces, a search with no matches.
 *
 * Always states what happened and offers a way onward, so an empty result never
 * reads as a broken page.
 */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("max-w-md border border-deep-brown/12 bg-off-white/60 p-8 sm:p-10", className)}>
      <p className="font-display text-2xl leading-snug text-forest">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-deep-brown/75">{description}</p>

      {action ? (
        <Link
          href={action.href}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-7")}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
