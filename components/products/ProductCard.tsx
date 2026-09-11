"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Product, MaterialBackground } from "@/types/product";
import { cn, formatPrice } from "@/lib/utils";
import { useCommerceStore, selectWishlist } from "@/lib/store/commerce";
import { useUIStore } from "@/lib/store/ui";
import { useStoreBase, EMPTY_STRING_ARRAY } from "@/lib/use-store-base";
import { Badge } from "@/components/ui/badge";

type ProductCardProps = {
  product: Product;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

const DEFAULT_SIZES = "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw";

const materialBgClasses: Record<MaterialBackground, string> = {
  stone: "bg-[#EAE0CF]",
  paper: "bg-[#EAE0CF]",
  sand: "bg-[#EAE0CF]",
  wood: "bg-[#EAE0CF]",
  textile: "bg-[#EAE0CF]",
};

export function ProductCard({
  product,
  className,
  priority = false,
  sizes = DEFAULT_SIZES,
}: ProductCardProps) {
  const reduce = useReducedMotion();
  const wishlist = useStoreBase(useCommerceStore, selectWishlist, EMPTY_STRING_ARRAY);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const addToCart = useCommerceStore((state) => state.addToCart);
  const openQuickView = useUIStore((state) => state.openQuickView);
  const showToast = useUIStore((state) => state.showToast);
  const pulseCart = useUIStore((state) => state.pulseCart);

  const wished = wishlist.includes(product.id);
  const [primary, secondary] = product.images;
  const hoverImage = secondary && secondary.src !== primary?.src ? secondary : null;

  const bgClass = product.materialBg ? materialBgClasses[product.materialBg] : "bg-[#EAE0CF]";

  function onAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product.id);
    pulseCart();
    showToast(`Added to your collection`, "success");
  }

  function onQuickView(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product.slug);
  }

  function onToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  }

  return (
    <article
      data-interactive
      className={cn(
        "group relative flex flex-col bg-off-white/80 border border-copper/15 hover:border-copper/35 transition-colors duration-300",
        className,
      )}
    >
      {/* Object Image Container with Material-Specific Background */}
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "relative block aspect-[4/5] w-full overflow-hidden transition-colors",
          bgClass,
        )}
        aria-label={`View ${product.name}, crafted in ${product.material}`}
      >
        <Image
          src={primary.src}
          alt={primary.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            "object-contain p-4 sm:p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]",
            hoverImage && "group-hover:opacity-0 transition-opacity duration-500",
          )}
        />

        {hoverImage ? (
          <Image
            src={hoverImage.src}
            alt=""
            aria-hidden
            fill
            sizes={sizes}
            className="object-contain p-4 sm:p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        ) : null}

        {!product.inStock ? (
          <Badge tone="onIvory" className="absolute left-3 top-3 text-[9px] uppercase tracking-wider bg-forest/80 text-sand">
            Reserved
          </Badge>
        ) : null}

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={
            wished
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wished}
          onClick={onToggleWishlist}
          className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-off-white/80 text-deep-brown/70 backdrop-blur-sm transition-colors hover:text-terracotta hover:bg-off-white"
        >
          <motion.span
            animate={wished && !reduce ? { scale: [1, 1.18, 1] } : { scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <Heart
              className={cn(
                "size-3.5 transition-colors",
                wished && "fill-terracotta text-terracotta",
              )}
            />
          </motion.span>
        </button>

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center justify-center opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            type="button"
            onClick={onQuickView}
            className="w-full py-2 text-[10px] uppercase tracking-[0.22em] font-medium bg-forest/90 text-off-white backdrop-blur-sm hover:bg-forest transition-colors shadow-sm"
          >
            Quick View
          </button>
        </div>
      </Link>

      {/* Product Metadata — Object Catalogue Style */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] uppercase tracking-[0.24em] text-copper font-medium truncate">
            {product.category}
          </p>
          <span className="text-[10px] text-deep-brown/50 font-sans truncate">
            {product.material}
          </span>
        </div>

        <h3 className="mt-1.5 font-display text-base font-normal leading-snug text-forest">
          <Link href={`/products/${product.slug}`} className="hover:text-terracotta transition-colors">
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-copper/10">
          <p className="text-xs font-sans font-medium text-deep-brown">
            {formatPrice(product.price)}
          </p>

          <button
            type="button"
            onClick={onAdd}
            disabled={!product.inStock}
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] font-medium text-forest hover:text-terracotta transition-colors disabled:cursor-not-allowed disabled:text-deep-brown/30"
          >
            <Plus className="size-3" />
            <span>{product.inStock ? "Add to Bag" : "Reserved"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
