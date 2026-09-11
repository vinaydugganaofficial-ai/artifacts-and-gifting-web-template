"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

type CuratedArtifactsProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  products: readonly Product[];
  action?: {
    href: string;
    label: string;
  };
};

export function CuratedArtifacts({
  eyebrow = "The Gifting Selection",
  title = "Objects Worth Giving.",
  description = "A gathering of hand-finished brass idols, sacred deepams, and artisanal treasures crafted by master artisans across India.",
  products,
  action = { href: "/shop", label: "View all artifacts" },
}: CuratedArtifactsProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-sand py-20 md:py-28 border-b border-copper/15" aria-label="Curated Artifacts">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              description={description}
            />
            {action ? (
              <Link
                href={action.href}
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-forest hover:text-terracotta transition-colors self-start md:self-end"
              >
                <span>{action.label}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            ) : null}
          </div>
        </Reveal>

        {/* 4-column product grid with object catalogue styling and varied material backgrounds */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.04}>
              <ProductCard
                product={product}
                priority={index < 4}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export const FeaturedArtifacts = CuratedArtifacts;
