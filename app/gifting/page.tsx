import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Building2, Heart, Home } from "lucide-react";

import { listProducts } from "@/lib/services/catalog.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductGrid } from "@/components/products/ProductGrid";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Heritage Gifting Studio — Viraasat",
  description:
    "Explore bespoke Indian heritage gifting for weddings, corporate milestones, festive occasions, and new beginnings. Handcrafted artifacts with ceremonial presentation.",
  alternates: { canonical: "/gifting" },
};

const OCCASION_CARDS = [
  {
    title: "Corporate & Institutional",
    slug: "corporate",
    icon: Building2,
    tagline: "For teams, founders, clients & dignitaries",
    description: "Distinctive brass tokens, chased desk artifacts, and custom-embossed wooden presentation suites.",
    image: "/images/corporate-gifting.jpg",
    link: "/gifting/corporate",
  },
  {
    title: "Wedding & Return Favors",
    slug: "wedding",
    icon: Heart,
    tagline: "Heirlooms for lifelong beginnings",
    description: "Sacred deepams, auspicious urlis, and trousseau centerpieces wrapped in unbleached silk and wax seals.",
    image: "/images/collections/gifting.jpg",
    link: "/gifting/wedding",
  },
  {
    title: "Housewarming (Griha Pravesh)",
    slug: "housewarming",
    icon: Home,
    tagline: "Grounding blessings for new dwellings",
    description: "Antique Ganeshas, consecrated threshold lamps, and bell sets that awaken warmth in every corner.",
    image: "/images/products/ganesha.jpg",
    link: "/gifting/housewarming",
  },
  {
    title: "Festive & Ceremonial",
    slug: "festivals",
    icon: Sparkles,
    tagline: "Diwali, celebrations & family milestones",
    description: "Illuminating brass deepaks, hand-engraved thalis, and festive gifting sets crafted by generational casters.",
    image: "/images/hero-gifting.jpg",
    link: "/gifting/festivals",
  },
];

export default async function GiftingPage() {
  const giftProducts = await listProducts({
    collection: "gifting-edit",
    perPage: 4,
  });

  return (
    <div className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="The Gifting House"
          title="The Art of Heritage Gifting"
          description="A truly thoughtful gift does not merely mark a calendar date — it carries memory, human craft, and lasting emotional weight. Discover handcrafted artifacts curated for life's most meaningful moments."
        />

        {/* Occasion Pathways */}
        <section className="mt-16">
          <div className="grid gap-6 md:grid-cols-2">
            {OCCASION_CARDS.map((occ) => {
              const Icon = occ.icon;
              return (
                <Link
                  key={occ.slug}
                  href={occ.link}
                  className="group relative flex flex-col justify-between overflow-hidden border border-deep-brown/15 bg-sand p-8 sm:p-10 transition-shadow duration-500 hover:shadow-lg"
                >
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="flex size-12 items-center justify-center bg-forest text-sand">
                      <Icon className="size-5" />
                    </div>
                    <span className="flex size-10 items-center justify-center border border-deep-brown/15 bg-off-white text-deep-brown transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-forest group-hover:text-off-white">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>

                  <div className="relative z-10 mt-20">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-terracotta font-medium">
                      {occ.tagline}
                    </p>
                    <h2 className="mt-2 font-display text-2xl sm:text-3xl text-forest">
                      {occ.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-deep-brown/80 max-w-md">
                      {occ.description}
                    </p>
                  </div>

                  <div className="absolute right-0 top-0 h-full w-1/3 opacity-15 transition-opacity duration-500 group-hover:opacity-25 overflow-hidden pointer-events-none">
                    <Image
                      src={occ.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bespoke Packaging Story */}
        <section className="mt-24 border border-deep-brown/15 bg-off-white/70 p-8 sm:p-14 md:p-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-terracotta font-medium">
                The Presentation Standard
              </p>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl text-forest leading-tight">
                Complimentary Bespoke Packaging On Every Gift
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-deep-brown/80">
                Every Viraasat artifact arrives in our rigid handmade archival gift box, wrapped in unbleached cotton, tied with natural dyed ribbon, and sealed with a signature brass medallion.
              </p>
              <ul className="mt-8 space-y-4 text-sm text-deep-brown/80">
                <li className="flex items-center gap-3">
                  <span className="size-2 rounded-full bg-terracotta" />
                  <span>Personalized handwritten calligraphy gift card included</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="size-2 rounded-full bg-terracotta" />
                  <span>Artisan certificate of origin & brass care guide</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="size-2 rounded-full bg-terracotta" />
                  <span>Pan-India insured courier delivery with discreet outer boxing</span>
                </li>
              </ul>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden border border-deep-brown/15 bg-sand">
              <Image
                src="/images/corporate-gifting.jpg"
                alt="Bespoke gift box with copper wax seal and handmade ribbon"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Selected Gifting Artifacts */}
        {giftProducts.items.length > 0 ? (
          <section className="mt-24 border-t border-deep-brown/15 pt-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-terracotta font-medium">
                  Curated Catalog
                </p>
                <h2 className="mt-2 font-display text-3xl text-forest">
                  Featured Gifting Artifacts
                </h2>
              </div>
              <Link
                href="/shop?collection=gifting-edit"
                className="text-xs uppercase tracking-[0.2em] font-medium text-forest hover:text-terracotta"
              >
                View Complete Gifting Edit &rarr;
              </Link>
            </div>
            <ProductGrid products={giftProducts.items} className="mt-10" />
          </section>
        ) : null}
      </div>
    </div>
  );
}
