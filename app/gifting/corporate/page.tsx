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
  title: "Corporate & Institutional Gifting — Viraasat",
  description:
    "Elevate executive and institutional relationships with handcrafted Indian brass artifacts, custom teak wood packaging, and pan-India doorstep fulfillment.",
  alternates: { canonical: "/gifting/corporate" },
};

export default async function CorporateGiftingPage() {
  const products = await listProducts({
    occasion: "corporate",
    perPage: 6,
  });

  return (
    <div className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/gifting", label: "Gifting" },
            { label: "Corporate" },
          ]}
        />

        <PageHeader
          className="mt-8"
          eyebrow="Institutional Services"
          title="Corporate & Executive Gifting"
          description="Move beyond generic corporate tokens. Viraasat crafts bespoke heritage presentations for executive summits, client appreciations, annual milestones, and diplomatic delegations."
        />

        {/* Highlight Banner */}
        <section className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center border border-deep-brown/15 bg-sand p-8 sm:p-12">
          <div>
            <span className="inline-block px-3 py-1 bg-forest text-sand text-[9px] uppercase tracking-[0.22em] font-medium mb-4">
              Concierge Partnership
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-forest leading-tight">
              Bespoke Identity & Flawless Pan-India Delivery
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-deep-brown/80">
              We collaborate with leadership teams and event organizers to create custom brass plaques, engraved teak wood stands, and bespoke seal-waxed gift boxes matching institutional brand guidelines.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-deep-brown/85">
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Tiered volume pricing starting from 10 units</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Custom logo embossing on handcrafted rigid wooden gift cases</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Direct multi-address dispatch across India and overseas</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Dedicated account manager for timeline and logistics assurance</span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact?type=corporate"
                className={buttonVariants({ variant: "primary", size: "default" })}
              >
                Inquire Corporate Catalogue
              </Link>
              <a
                href="mailto:concierge@viraasat.example?subject=Corporate%20Gifting%20Inquiry"
                className={buttonVariants({ variant: "outline", size: "default" })}
              >
                Email Concierge
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden border border-deep-brown/15 bg-off-white">
            <Image
              src="/images/corporate-gifting.jpg"
              alt="Corporate heritage gift suites with brass wax seals"
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
                Selection
              </p>
              <h2 className="mt-2 font-display text-3xl text-forest">
                Recommended For Corporate Honors
              </h2>
            </div>
            <Link
              href="/shop?occasion=corporate"
              className="text-xs uppercase tracking-[0.2em] font-medium text-forest hover:text-terracotta"
            >
              View All Corporate Curations &rarr;
            </Link>
          </div>

          <ProductGrid products={products.items} className="mt-10" />
        </section>
      </div>
    </div>
  );
}
