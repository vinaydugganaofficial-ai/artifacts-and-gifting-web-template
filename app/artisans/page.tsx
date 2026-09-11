import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { listArtisans } from "@/lib/services/content.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Master Artisans — Viraasat Heritage Gifting House",
  description:
    "Meet the master casters, wax sculptors, and patina specialists behind every Viraasat creation — their workshops, their regions, and generational craft methods.",
  alternates: { canonical: "/artisans" },
};

export default async function ArtisansPage() {
  const artisans = await listArtisans();

  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="Maker Dignity"
          title="Master Artisans of India"
          description="We partner directly with master casters, lost-wax sculptors, and detail chasers across Moradabad, Swamimalai, and Jaipur. These are their workshops, their stories, and their generational crafts."
        />

        <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {artisans.map((artisan, index) => (
            <li key={artisan.slug}>
              <Link href={`/artisans/${artisan.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden border border-deep-brown/15 bg-sand">
                  <Image
                    src={artisan.portrait}
                    alt={artisan.portraitAlt}
                    fill
                    priority={index < 3}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>

                <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-terracotta font-medium">
                  {artisan.craft}
                </p>

                <h2 className="mt-2 font-display text-2xl text-forest">
                  <span className="link-underline group-hover:text-terracotta transition-colors">{artisan.name}</span>
                </h2>

                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-deep-brown/50">
                  {artisan.region} · {artisan.yearsActive} years of craft
                </p>

                <p className="mt-3 max-w-sm text-sm leading-relaxed text-deep-brown/75">
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
