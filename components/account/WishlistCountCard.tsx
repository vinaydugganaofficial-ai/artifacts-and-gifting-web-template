"use client";

import Link from "next/link";

import {
  useCommerceStore,
  selectCartCount,
  selectWishlistCount,
} from "@/lib/store/commerce";
import { useStoreBase } from "@/lib/use-store-base";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: number | string;
  caption: string;
  href: string;
  action: string;
  className?: string;
};

/** Presentational stat tile. Takes its numbers as props. */
export function StatCard({
  label,
  value,
  caption,
  href,
  action,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between border border-deep-brown/15 bg-sand/20 p-6",
        className,
      )}
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.24em] text-terracotta font-medium">
          {label}
        </p>
        <p className="mt-4 font-display text-4xl tabular-nums leading-none text-forest">{value}</p>
        <p className="mt-2 text-sm text-deep-brown/65">{caption}</p>
      </div>

      <Link
        href={href}
        className="mt-6 text-[10px] uppercase tracking-[0.22em] text-deep-brown/70 font-medium transition-colors hover:text-terracotta"
      >
        {action}
      </Link>
    </div>
  );
}

/**
 * Saved-items and bag counts.
 *
 * These live in the visitor's browser, not on the server, so they are read on
 * the client and rendered as 0 until hydration — which is what the SSR-safe
 * store selector guarantees.
 */
export function LocalCountCards() {
  const wishlistCount = useStoreBase(useCommerceStore, selectWishlistCount, 0);
  const cartCount = useStoreBase(useCommerceStore, selectCartCount, 0);

  return (
    <>
      <StatCard
        label="Saved items"
        value={wishlistCount}
        caption={wishlistCount === 1 ? "piece set aside" : "pieces set aside"}
        href="/wishlist"
        action="View wishlist"
      />
      <StatCard
        label="In your bag"
        value={cartCount}
        caption={cartCount === 1 ? "piece ready" : "pieces ready"}
        href="/cart"
        action="View bag"
      />
    </>
  );
}
