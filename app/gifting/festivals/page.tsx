import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

import { listProducts } from "@/lib/services/catalog.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Festive Gifting Edit — Viraasat",
  description:
    "Sacred brass deepaks, hand-hammered urlis, and festive gift hampers for Diwali, Dussehra, and ceremonial celebrations.",
  alternates: { canonical: "/gifting/festivals" },
};

export default async function FestivalsGiftingPage() {
  const products = await listProducts({
    occasion: "festivals",
    perPage: 6,
  });

  return (
    <div className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/gifting", label: "Gifting" },
            { label: "Festivals" },
          ]}
        />

        <PageHeader
          className="mt-8"
          eyebrow="Illuminated Moments"
          title="The Festive Gifting Edit"
          description="Bring auspicious light and sacred warmth to festival seasons. Hand-cast brass oil lamps, engraved urlis for fresh marigolds, and heirloom tokens to honor loved ones."
        />

        {/* Highlight Banner */}
        <section className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center border border-deep-brown/15 bg-sand p-8 sm:p-12">
          <div>
            <span className="inline-block px-3 py-1 bg-saffron text-off-white text-[9px] uppercase tracking-[0.22em] font-medium mb-4">
              Diwali & Festivities
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-forest leading-tight">
              Sacred Light & Enduring Festive Warmth
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-deep-brown/80">
              Unlike consumable sweets and temporary hampers, a solid cast brass diya or handcrafted idol remains in the home year after year, awakening with light on every festive dusk.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-deep-brown/85">
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Complete gift sets with organic cold-pressed oil and cotton wicks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Handwritten calligraphy festival greeting cards</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Express pan-India delivery before festival dates</span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/shop?occasion=festivals"
                className={buttonVariants({ variant: "primary", size: "default" })}
              >
                Shop Festive Edit
              </Link>
              <Link
                href="/contact?type=festive-bulk"
                className={buttonVariants({ variant: "outline", size: "default" })}
              >
                Bulk Family Orders
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden border border-deep-brown/15 bg-off-white">
            <Image
              src="/images/hero-gifting.jpg"
              alt="Festive brass artifacts and marigold still life"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* Curated Artifacts */}
        <section className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-deep-brown/15 pb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-terracotta font-medium">
                Curation
              </p>
              <h2 className="mt-2 font-display text-3xl text-forest">
                Festive Highlights
              </h2>
            </div>
            <Link
              href="/shop?occasion=festivals"
              className="text-xs uppercase tracking-[0.2em] font-medium text-forest hover:text-terracotta"
            >
              View Full Festive Edit &rarr;
            </Link>
          </div>

          <ProductGrid products={products.items} className="mt-10" />
        </section>
      </div>
    </div>
  );
}
