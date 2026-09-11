"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { fetchProductBySlug } from "@/lib/api/client";
import type { Product } from "@/types/product";
import { formatPrice, cn } from "@/lib/utils";
import { useCommerceStore, selectWishlist } from "@/lib/store/commerce";
import { useUIStore } from "@/lib/store/ui";
import { useStoreBase, EMPTY_STRING_ARRAY } from "@/lib/use-store-base";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { easeTactile } from "@/lib/motion";

export function QuickView() {
  const slug = useUIStore((state) => state.quickViewSlug);
  const close = useUIStore((state) => state.closeQuickView);
  const addToCart = useCommerceStore((state) => state.addToCart);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const wishlist = useStoreBase(useCommerceStore, selectWishlist, EMPTY_STRING_ARRAY);
  const showToast = useUIStore((state) => state.showToast);
  const pulseCart = useUIStore((state) => state.pulseCart);

  const [settled, setSettled] = useState<{
    slug: string;
    product: Product | null;
    error: string | null;
  } | null>(null);

  const [quantityFor, setQuantityFor] = useState<{ slug: string; value: number } | null>(
    null,
  );

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    fetchProductBySlug(slug, { signal: controller.signal }).then((result) => {
      if (controller.signal.aborted) return;

      setSettled(
        result.ok
          ? { slug, product: result.data, error: null }
          : { slug, product: null, error: result.error.message },
      );
    });

    return () => controller.abort();
  }, [slug]);

  const isCurrent = slug !== null && settled?.slug === slug;
  const loading = slug !== null && !isCurrent;
  const product = isCurrent ? settled.product : null;
  const error = isCurrent ? settled.error : null;
  const quantity = quantityFor?.slug === slug ? quantityFor.value : 1;

  function setQuantity(value: number) {
    if (!slug) return;
    setQuantityFor({ slug, value });
  }

  function onOpenChange(open: boolean) {
    if (open) return;
    close();
  }

  function onAdd() {
    if (!product || !product.inStock) return;
    addToCart(product.id, quantity);
    pulseCart();
    showToast(`Added to your collection`, "success");
    close();
  }

  const open = Boolean(slug);
  const wished = product ? wishlist.includes(product.id) : false;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[var(--z-overlay)] bg-forest/65 backdrop-blur-[3px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className="fixed left-1/2 top-1/2 z-[var(--z-dialog)] max-h-[92vh] w-[min(94vw,920px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-copper/20 bg-off-white text-deep-brown shadow-2xl focus:outline-none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, ease: easeTactile }}
              >
                <VisuallyHidden>
                  <DialogPrimitive.Title>
                    {product ? product.name : "Loading artifact"}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description>
                    {product
                      ? product.description
                      : "Fetching artifact specifications and availability."}
                  </DialogPrimitive.Description>
                </VisuallyHidden>

                <DialogPrimitive.Close
                  aria-label="Close quick view"
                  className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-sand/60 text-forest hover:bg-sand transition-colors"
                >
                  <X className="size-4" />
                </DialogPrimitive.Close>

                {loading ? <QuickViewSkeleton /> : null}

                {!loading && error ? (
                  <div className="px-8 py-20 text-center sm:px-12">
                    <p className="font-display text-2xl text-forest">
                      This piece could not be loaded.
                    </p>
                    <p className="mt-3 text-sm text-deep-brown/60">{error}</p>
                  </div>
                ) : null}

                {!loading && product ? (
                  <div className="grid md:grid-cols-2">
                    <div className="relative aspect-[4/5] bg-sand/40 p-6 md:aspect-auto md:min-h-[480px] flex items-center justify-center border-b md:border-b-0 md:border-r border-copper/15">
                      <Image
                        src={product.images[0].src}
                        alt={product.images[0].alt}
                        fill
                        className="object-contain p-8"
                        sizes="(max-width: 768px) 100vw, 460px"
                      />
                      {!product.inStock ? (
                        <Badge tone="onIvory" className="absolute left-4 top-4 text-[9px] uppercase tracking-wider bg-forest/80 text-sand">
                          Reserved
                        </Badge>
                      ) : null}
                    </div>

                    <div className="flex flex-col justify-center p-6 sm:p-10">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-terracotta font-medium">
                          {product.category}
                        </p>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          className="flex items-center gap-1.5 text-xs text-copper hover:text-terracotta transition-colors"
                          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart className={cn("size-3.5", wished && "fill-terracotta text-terracotta")} />
                          <span className="text-[10px] tracking-wider uppercase font-sans">
                            {wished ? "Saved" : "Save"}
                          </span>
                        </button>
                      </div>

                      <h3 className="mt-2 font-display text-2xl sm:text-3xl text-forest font-medium leading-tight">
                        {product.name}
                      </h3>

                      <p className="mt-3 text-lg font-sans font-medium text-deep-brown">
                        {formatPrice(product.price)}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3 border-y border-copper/15 py-3 text-xs text-deep-brown/75">
                        <div>
                          <span className="text-[9px] uppercase tracking-[0.2em] text-copper block">Material</span>
                          <span className="font-medium text-forest">{product.material}</span>
                        </div>
                        {product.dimensions ? (
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-copper block">Dimensions</span>
                            <span className="font-medium text-forest">{product.dimensions}</span>
                          </div>
                        ) : null}
                      </div>

                      <p className="mt-4 text-xs leading-relaxed text-deep-brown/80 line-clamp-3">
                        {product.description}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <QuantitySelector
                          value={quantity}
                          onChange={setQuantity}
                          disabled={!product.inStock}
                          label={`Quantity for ${product.name}`}
                        />
                        <Button
                          onClick={onAdd}
                          disabled={!product.inStock}
                          className="flex-1 bg-forest text-off-white hover:bg-forest-light transition-colors py-3 text-xs uppercase tracking-[0.2em]"
                        >
                          {product.inStock ? "Add to Bag" : "Reserved"}
                        </Button>
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        onClick={close}
                        className="link-underline mt-5 self-start text-[10px] uppercase tracking-[0.22em] text-copper hover:text-terracotta font-medium"
                      >
                        View Full Artifact Story
                      </Link>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

function QuickViewSkeleton() {
  return (
    <div className="grid animate-pulse md:grid-cols-2">
      <div className="aspect-[4/5] bg-copper/10 md:aspect-auto md:min-h-[480px]" />
      <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
        <div className="h-3 w-20 bg-copper/10" />
        <div className="h-8 w-3/4 bg-copper/10" />
        <div className="h-5 w-24 bg-copper/10" />
        <div className="mt-2 space-y-2">
          <div className="h-3 w-full bg-copper/10" />
          <div className="h-3 w-full bg-copper/10" />
        </div>
        <div className="mt-4 h-11 w-full bg-copper/10" />
      </div>
    </div>
  );
}
