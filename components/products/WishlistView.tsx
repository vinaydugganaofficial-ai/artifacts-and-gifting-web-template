"use client";

import { useCommerceStore, selectWishlist } from "@/lib/store/commerce";
import { useStoreBase, EMPTY_STRING_ARRAY } from "@/lib/use-store-base";
import { useCatalogProducts } from "@/lib/hooks/use-catalog-products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { EmptyState } from "@/components/shared/EmptyState";

export function WishlistView() {
  const wishlist = useStoreBase(useCommerceStore, selectWishlist, EMPTY_STRING_ARRAY);
  const { products, loading, error } = useCatalogProducts(wishlist);

  if (wishlist.length === 0) {
    return (
      <EmptyState
        className="mt-12"
        title="Your wishlist is empty."
        description="Artifacts and gifting curations you set aside will remain saved here until you are ready."
        action={{ href: "/shop", label: "Explore the Collection" }}
      />
    );
  }

  if (loading && products.length === 0) {
    return (
      <div className="mt-14 grid animate-pulse grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: Math.min(wishlist.length, 6) }).map((_, index) => (
          <div key={index} className="aspect-[3/4] bg-[#EAE0CF]/40 border border-deep-brown/10" />
        ))}
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <EmptyState
        className="mt-12"
        title="Your wishlist could not be loaded."
        description={error}
        action={{ href: "/shop", label: "Browse the collection" }}
      />
    );
  }

  // A saved piece that has left the catalog is absent from the API response and
  // therefore simply not shown — it can never surface as an undefined entry.
  if (products.length === 0) {
    return (
      <EmptyState
        className="mt-12"
        title="These pieces have found homes."
        description="Everything you had saved has since left the collection. New castings arrive regularly."
        action={{ href: "/shop", label: "See what is here now" }}
      />
    );
  }

  return <ProductGrid products={products} className="mt-14" />;
}
