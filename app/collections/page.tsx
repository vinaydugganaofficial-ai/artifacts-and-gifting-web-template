import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { listCollections } from "@/lib/services/catalog.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "The rooms of the Aaranya gallery — sacred forms, heritage objects, artisan craft, and pieces made for gifting.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const collections = await listCollections();

  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="The Rooms"
          title="Collections"
          description="Four ways into the same workshop. A piece may appear in more than one — a lamp is both a heritage object and, often, a gift."
        />

        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {collections.map((collection) => (
            <li key={collection.slug}>
              <Link
                href={`/collections/${collection.slug}`}
                data-cursor="VIEW"
                className="group relative block min-h-[320px] overflow-hidden bg-charcoal"
              >
                <Image
                  src={collection.image}
                  alt={collection.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 text-ivory">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                    {collection.count === 1 ? "1 piece" : `${collection.count} pieces`}
                  </p>
                  <h2 className="mt-2 font-display text-3xl">{collection.title}</h2>
                  <p className="mt-2 max-w-sm text-sm text-ivory/70">
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
