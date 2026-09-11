import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { listArtisans } from "@/lib/services/content.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Artisans",
  description:
    "The casters, chasers and bell-founders behind every Aaranya piece — their workshops, their regions, and the way each of them works brass.",
  alternates: { canonical: "/artisans" },
};

export default async function ArtisansPage() {
  const artisans = await listArtisans();

  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="The Makers"
          title="Every piece has a maker."
          description="We work with casters and chasers in Moradabad, Swamimalai and Jaipur. These are their names, their workshops, and the particular ways they work brass."
        />

        <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {artisans.map((artisan, index) => (
            <li key={artisan.slug}>
              <Link href={`/artisans/${artisan.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
                  <Image
                    src={artisan.portrait}
                    alt={artisan.portraitAlt}
                    fill
                    priority={index < 3}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>

                <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-gold-muted">
                  {artisan.craft}
                </p>

                <h2 className="mt-2 font-display text-2xl">
                  <span className="link-underline">{artisan.name}</span>
                </h2>

                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-charcoal/45">
                  {artisan.region} · {artisan.yearsActive} years
                </p>

                <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal/65">
                  {artisan.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
