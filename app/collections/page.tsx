import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { listCollections } from "@/lib/services/catalog.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Curated Collections — Viraasat Indian Heritage & Gifting",
  description:
    "Explore the thematic curations of Viraasat — Brass Heritage, Living India, Gifting Edit, and Collector's Shelf.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const collections = await listCollections();

  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="Viraasat Edits"
          title="Curated Collections"
          description="Four foundational expressions of Indian craftsmanship — sacred brass figurines, living home vessels, celebratory gifting edits, and limited collector pieces."
        />

        <ul className="mt-14 grid gap-6 md:grid-cols-2">
          {collections.map((collection) => (
            <li key={collection.slug}>
              <Link
                href={`/collections/${collection.slug}`}
                data-cursor="VIEW"
                className="group relative block min-h-[380px] overflow-hidden border border-deep-brown/15 bg-sand"
              >
                <Image
                  src={collection.image}
                  alt={collection.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/35 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 text-off-white">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-sand font-medium">
                      {collection.count === 1 ? "1 piece" : `${collection.count} curated pieces`}
                    </p>
                    <span className="text-xs uppercase tracking-[0.2em] text-sand/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center gap-1">
                      Explore Edit &rarr;
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl text-off-white">{collection.title}</h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-sand/85">
                    {collection.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
