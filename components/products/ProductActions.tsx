"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { useCommerceStore, selectWishlist } from "@/lib/store/commerce";
import { useUIStore } from "@/lib/store/ui";
import { useStoreBase, EMPTY_STRING_ARRAY } from "@/lib/use-store-base";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCommerceStore((state) => state.addToCart);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const wishlist = useStoreBase(useCommerceStore, selectWishlist, EMPTY_STRING_ARRAY);
  const showToast = useUIStore((state) => state.showToast);
  const pulseCart = useUIStore((state) => state.pulseCart);

  const wished = wishlist.includes(product.id);

  function onAdd() {
    if (!product.inStock) return;
    addToCart(product.id, quantity);
    pulseCart();
    showToast(`${product.name} added to bag`, "success");
  }

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-4">
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          disabled={!product.inStock}
          label={`Quantity for ${product.name}`}
        />

        <Button onClick={onAdd} disabled={!product.inStock} className="min-w-44">
          {product.inStock ? "Add to Cart" : "Sold Out"}
        </Button>

        <button
          type="button"
          aria-label={
            wished
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wished}
          onClick={() => toggleWishlist(product.id)}
          className="grid size-12 place-items-center border border-deep-brown/20 bg-off-white/80 transition-colors hover:border-terracotta"
        >
          <Heart className={cn("size-4 text-deep-brown/60", wished && "fill-terracotta text-terracotta")} />
        </button>
      </div>

      {!product.inStock ? (
        <p className="mt-4 text-sm text-deep-brown/70">
          This piece is currently with a collector. Write to our concierge and we will notify
          you when the next workshop casting is ready.
        </p>
      ) : null}
    </div>
  );
}
