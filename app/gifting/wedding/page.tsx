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
  title: "Wedding & Return Favors Gifting — Viraasat",
  description:
    "Enduring heirloom gifts for new beginnings, auspicious wedding favors, and bridal trousseau centerpieces handcrafted in lost-wax brass and bronze.",
  alternates: { canonical: "/gifting/wedding" },
};

export default async function WeddingGiftingPage() {
  const products = await listProducts({
    occasion: "wedding",
    perPage: 6,
  });

  return (
    <div className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/gifting", label: "Gifting" },
            { label: "Wedding" },
          ]}
        />

        <PageHeader
          className="mt-8"
          eyebrow="Sacred Milestones"
          title="Wedding & Return Favor Curations"
          description="Celebrate lifetime vows with objects crafted to endure for generations. From sacred Deepalakshmis to artisanal brass urlis, each piece conveys timeless blessings."
        />

        {/* Highlight Banner */}
        <section className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center border border-deep-brown/15 bg-sand p-8 sm:p-12">
          <div>
            <span className="inline-block px-3 py-1 bg-terracotta text-off-white text-[9px] uppercase tracking-[0.22em] font-medium mb-4">
              Celebration Services
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-forest leading-tight">
              Auspicious Heirlooms For Lifelong Beginnings
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-deep-brown/80">
              Make your celebration unforgettable with wedding favor curation that guests preserve on their mantels for decades. We assist families with thoughtful pairings, individualized monogram tags, and ceremonial unbleached cotton presentation.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-deep-brown/85">
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Custom wedding date & initials engraved brass tags</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Artisan story inserts describing the ritual symbolism</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Direct delivery to wedding venues across India</span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact?type=wedding"
                className={buttonVariants({ variant: "primary", size: "default" })}
              >
                Inquire Wedding Edit
              </Link>
              <Link
                href="/shop?occasion=wedding"
                className={buttonVariants({ variant: "outline", size: "default" })}
              >
                Browse All Pieces
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden border border-deep-brown/15 bg-off-white">
            <Image
              src="/images/collections/gifting.jpg"
              alt="Handcrafted wedding gift box with ribbon and brass token"
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
                Recommended For Weddings & Favors
              </h2>
            </div>
            <Link
              href="/shop?occasion=wedding"
              className="text-xs uppercase tracking-[0.2em] font-medium text-forest hover:text-terracotta"
            >
              View Full Wedding Edit &rarr;
            </Link>
          </div>

          <ProductGrid products={products.items} className="mt-10" />
        </section>
      </div>
    </div>
  );
}
