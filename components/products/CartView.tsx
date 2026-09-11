"use client";

import Image from "next/image";
import Link from "next/link";

import { formatPrice, cn } from "@/lib/utils";
import { useCommerceStore, selectCart } from "@/lib/store/commerce";
import { useStoreBase } from "@/lib/use-store-base";
import { useCatalogProducts } from "@/lib/hooks/use-catalog-products";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import type { CartItem } from "@/lib/store/commerce";

const EMPTY_CART: readonly CartItem[] = Object.freeze([]);

export function CartView() {
  const cart = useStoreBase(useCommerceStore, selectCart, EMPTY_CART as CartItem[]);
  const setQuantity = useCommerceStore((state) => state.setQuantity);
  const removeFromCart = useCommerceStore((state) => state.removeFromCart);

  const { products, loading, error } = useCatalogProducts(
    cart.map((item) => item.productId),
  );

  const byId = new Map(products.map((product) => [product.id, product]));

  // Driven by the cart, joined to the catalog: an id the server no longer knows
  // simply has no line, so a stale entry cannot break the page.
  const lines = cart
    .map((item) => {
      const product = byId.get(item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);

  const subtotal = lines.reduce(
    (total, line) => total + line.product.price * line.quantity,
    0,
  );

  const unavailableCount = cart.length - lines.length;

  if (cart.length === 0) {
    return (
      <EmptyState
        className="mt-12"
        title="Your bag is empty."
        description="Nothing has been set aside yet. The collection is a good place to begin."
        action={{ href: "/shop", label: "Explore the collection" }}
      />
    );
  }

  if (loading && lines.length === 0) {
    return <CartSkeleton />;
  }

  if (error && lines.length === 0) {
    return (
      <EmptyState
        className="mt-12"
        title="Your bag could not be loaded."
        description={error}
        action={{ href: "/cart", label: "Try again" }}
      />
    );
  }

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_340px]">
      <div>
        {unavailableCount > 0 ? (
          <p className="mb-6 border border-danger/30 bg-danger/5 px-5 py-4 text-sm text-charcoal/75">
            {unavailableCount === 1
              ? "One piece in your bag is no longer available and has been left out of the total."
              : `${unavailableCount} pieces in your bag are no longer available and have been left out of the total.`}
          </p>
        ) : null}

        <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-5 py-6">
              <Link
                href={`/products/${product.slug}`}
                className="relative size-28 shrink-0 overflow-hidden bg-charcoal"
              >
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between gap-4">
                <div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="link-underline font-display text-xl"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-charcoal/60">
                    {formatPrice(product.price)}
                  </p>
                  {!product.inStock ? (
                    <Badge tone="soldOut" className="mt-2">
                      Sold out
                    </Badge>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <QuantitySelector
                    value={quantity}
                    onChange={(value) => setQuantity(product.id, value)}
                    label={`Quantity for ${product.name}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 transition-colors hover:text-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p className="hidden w-28 shrink-0 text-right text-sm tabular-nums text-charcoal sm:block">
                {formatPrice(product.price * quantity)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit border border-charcoal/10 p-6 lg:sticky lg:top-28">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Summary</p>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-charcoal/60">Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-charcoal/60">Shipping</dt>
            <dd className="text-charcoal/60">Quoted at confirmation</dd>
          </div>
        </dl>

        <div className="mt-5 flex justify-between border-t border-charcoal/10 pt-5 text-base">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>

        <Link
          href="/checkout"
          className={cn(buttonVariants({ variant: "primary" }), "mt-6 w-full")}
          aria-disabled={lines.length === 0}
        >
          Proceed to checkout
        </Link>

        <p className="mt-4 text-xs leading-relaxed text-charcoal/50">
          Nothing is charged at this step. The atelier confirms every piece by hand before
          an invoice is raised.
        </p>
      </aside>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="mt-12 grid animate-pulse gap-12 lg:grid-cols-[1fr_340px]">
      <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
        {[0, 1].map((index) => (
          <li key={index} className="flex gap-5 py-6">
            <div className="size-28 shrink-0 bg-charcoal/10" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-1/2 bg-charcoal/10" />
              <div className="h-4 w-24 bg-charcoal/10" />
              <div className="h-11 w-32 bg-charcoal/10" />
            </div>
          </li>
        ))}
      </ul>
      <div className="h-64 border border-charcoal/10" />
    </div>
  );
}
