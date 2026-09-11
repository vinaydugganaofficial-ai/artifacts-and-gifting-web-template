"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import type { Product } from "@/types/product";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { formatPrice } from "@/lib/utils";

type SignatureArtifactsProps = {
  products: readonly Product[];
};

export function SignatureArtifacts({ products }: SignatureArtifactsProps) {
  // Filter for signature products or select top 3 high-impact pieces
  const signatures = products.filter((p) => p.signature).slice(0, 3);
  const displayItems = signatures.length >= 3 ? signatures : products.slice(0, 3);

  if (displayItems.length === 0) return null;

  return (
    <section className="bg-sand py-20 md:py-28 border-b border-copper/15" aria-label="Signature Artifacts">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
            <SectionHeading
              eyebrow="Heirloom Collectibles"
              title="Pieces With Presence."
              description="Singular works distinguished by exceptional casting scale, weight, and chiselled detail. Created to be the defining presence in a room."
            />
            <div className="flex items-center gap-2 text-xs font-sans text-copper font-medium self-start md:self-end">
              <Sparkles className="size-3.5 text-terracotta" />
              <span>Limited Masterwork Castings</span>
            </div>
          </div>
        </Reveal>

        {/* 3 High-Impact Signature Showcases */}
        <div className="mt-8 space-y-12">
          {displayItems.map((item, index) => {
            const isReversed = index % 2 === 1;

            return (
              <Reveal key={item.id} delay={index * 0.1}>
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 bg-off-white border border-copper/20 p-6 sm:p-10 lg:p-12 shadow-sm">
                  {/* Imagery with Deep Material Matting */}
                  <div
                    className={`lg:col-span-6 relative ${
                      isReversed ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-sand/30 border border-copper/15">
                      <Image
                        src={item.images[0].src}
                        alt={item.images[0].alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 580px"
                        className="object-contain p-6 sm:p-10 transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-forest px-3 py-1 text-[9px] uppercase tracking-[0.24em] text-sand font-medium">
                          Signature No. 0{index + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Curatorial Dossier & Specs */}
                  <div
                    className={`lg:col-span-6 flex flex-col justify-center ${
                      isReversed ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.28em] text-terracotta font-medium">
                        {item.category}
                      </span>
                      <span className="text-deep-brown/30">·</span>
                      <span className="text-xs text-deep-brown/60 font-sans">
                        {item.origin}
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-forest leading-tight">
                      {item.name}
                    </h3>

                    <p className="mt-3 text-lg sm:text-xl font-sans font-medium text-deep-brown">
                      {formatPrice(item.price)}
                    </p>

                    <p className="mt-4 text-xs sm:text-sm leading-relaxed text-deep-brown/80 font-sans">
                      {item.description}
                    </p>

                    {/* Technical Specifications */}
                    <div className="mt-6 grid grid-cols-3 gap-3 border-y border-copper/15 py-4 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-copper block">Material</span>
                        <span className="font-medium text-forest text-xs">{item.material}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-copper block">Dimensions</span>
                        <span className="font-medium text-forest text-xs">{item.dimensions ?? "Custom"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-copper block">Weight</span>
                        <span className="font-medium text-forest text-xs">{item.weight ?? "Heirloom"}</span>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-4">
                      <Link
                        href={`/products/${item.slug}`}
                        className="group inline-flex items-center justify-center gap-2 bg-forest px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-off-white hover:bg-forest-light transition-colors shadow-sm"
                      >
                        <span>Acquire Piece</span>
                        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>

                      <span className="text-xs text-deep-brown/60 font-sans italic">
                        By {item.artisan}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
