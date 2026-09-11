"use client";

import { useState } from "react";
import Image from "next/image";

import type { ProductImage } from "@/types/product";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: readonly ProductImage[];
  productName: string;
};

/**
 * Product image viewer with thumbnails.
 *
 * Replaces the previous single-image layout, which rendered only `images[0]`
 * and left every other photograph of a piece unreachable.
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE0CF] p-6 sm:p-8 border border-deep-brown/10">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority
          className="object-contain p-4 transition-all duration-500"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 ? (
        <ul className="flex gap-3" aria-label={`More images of ${productName}`}>
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={image.alt}
                aria-current={index === active}
                className={cn(
                  "relative block size-20 overflow-hidden bg-[#EAE0CF] p-1 border border-deep-brown/10 transition-opacity",
                  index === active
                    ? "opacity-100 outline outline-2 outline-offset-2 outline-terracotta"
                    : "opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  aria-hidden
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
