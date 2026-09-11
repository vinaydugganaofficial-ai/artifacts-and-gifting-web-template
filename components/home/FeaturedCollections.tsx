"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import type { Collection } from "@/types/product";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

type FeaturedCollectionsProps = {
  eyebrow?: string;
  title?: string;
  collections: readonly Collection[];
};

export function FeaturedCollections({
  eyebrow = "Crafted Rooms",
  title = "Curated From Indian Craft",
  collections,
}: FeaturedCollectionsProps) {
  if (collections.length === 0) return null;

  return (
    <section className="bg-sand py-20 md:py-28 border-b border-copper/15" aria-label="Featured Collections">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              description="Four deliberate curations exploring cast metals, domestic rituals, gifting treasures, and rare collector's artifacts."
            />
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-forest hover:text-terracotta transition-colors self-start md:self-end"
            >
              <span>View All Collections</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </Reveal>

        {/* Asymmetric 4-Collection Editorial Composition */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Collection 1: Brass Heritage (Large Editorial Lead - 7 columns) */}
          {collections[0] && (
            <div className="lg:col-span-7">
              <CollectionCard
                collection={collections[0]}
                aspect="aspect-[16/11]"
                priority
              />
            </div>
          )}

          {/* Collection 2: Living India (Tall vertical card - 5 columns) */}
          {collections[1] && (
            <div className="lg:col-span-5">
              <CollectionCard
                collection={collections[1]}
                aspect="aspect-[4/5] lg:aspect-auto lg:h-full"
              />
            </div>
          )}

          {/* Collection 3: Gifting Edit (Balanced card - 5 columns) */}
          {collections[2] && (
            <div className="lg:col-span-5">
              <CollectionCard
                collection={collections[2]}
                aspect="aspect-[4/5] lg:aspect-auto lg:h-full"
              />
            </div>
          )}

          {/* Collection 4: Collector's Shelf (Wide horizontal - 7 columns) */}
          {collections[3] && (
            <div className="lg:col-span-7">
              <CollectionCard
                collection={collections[3]}
                aspect="aspect-[16/11]"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({
  collection,
  aspect,
  priority = false,
}: {
  collection: Collection;
  aspect: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      data-interactive
      className={cn(
        "group relative block w-full overflow-hidden border border-copper/20 bg-off-white transition-all duration-300 hover:border-copper/45 shadow-sm",
        aspect,
      )}
    >
      <Image
        src={collection.image}
        alt={collection.imageAlt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      />

      {/* Editorial Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/35 to-transparent transition-opacity duration-300 group-hover:from-forest/95" />

      {/* Content Container */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end text-off-white">
        <div className="flex items-center justify-between">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-saffron font-medium transition-transform duration-300 group-hover:-translate-y-0.5">
            {collection.count === 1 ? "1 Masterwork" : `${collection.count} Artifacts`}
          </p>
          <span className="text-[9px] uppercase tracking-[0.2em] text-sand/70 font-sans">
            Curated Edit
          </span>
        </div>

        <h3 className="mt-2 font-display text-2xl sm:text-3xl font-normal text-off-white leading-tight transition-colors duration-300 group-hover:text-sand">
          {collection.title}
        </h3>

        <p className="mt-2 max-w-md text-xs sm:text-sm text-sand/80 font-sans leading-relaxed line-clamp-2">
          {collection.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-sand/90 transition-all duration-300 group-hover:text-off-white">
          <span>Explore Collection</span>
          <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
