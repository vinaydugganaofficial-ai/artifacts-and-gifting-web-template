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
  title: "Housewarming Gifts (Griha Pravesh) — Viraasat",
  description:
    "Auspicious beginnings for new dwellings. Antique brass Ganeshas, threshold deepams, and tuned temple bells to bless new homes.",
  alternates: { canonical: "/gifting/housewarming" },
};

export default async function HousewarmingGiftingPage() {
  const products = await listProducts({
    occasion: "housewarming",
    perPage: 6,
  });

  return (
    <div className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/gifting", label: "Gifting" },
            { label: "Housewarming" },
          ]}
        />

        <PageHeader
          className="mt-8"
          eyebrow="Auspicious Beginnings"
          title="Housewarming (Griha Pravesh) Gifting"
          description="A new threshold deserves objects that anchor positive energy and sacred calm. Curated devotional sculptures, threshold deepams, and chime bells that turn a house into a sanctuary."
        />

        {/* Highlight Banner */}
        <section className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center border border-deep-brown/15 bg-sand p-8 sm:p-12">
          <div>
            <span className="inline-block px-3 py-1 bg-forest text-sand text-[9px] uppercase tracking-[0.22em] font-medium mb-4">
              Home Blessings
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-forest leading-tight">
              Gifts That Ground A New Home With Grace
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-deep-brown/80">
              In Indian tradition, presenting an idol of Lord Ganesha or a brass threshold diya is an invocation of auspicious beginnings and enduring peace. Each Viraasat artifact arrives ready for puja and gifting.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-deep-brown/85">
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Cast in high-density brass with natural aged patina</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Includes a dedicated Griha Pravesh benediction card</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-terracotta shrink-0" />
                <span>Packaged in reusable wooden and rigid textile boxes</span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/shop?occasion=housewarming"
                className={buttonVariants({ variant: "primary", size: "default" })}
              >
                Explore Griha Pravesh Edit
              </Link>
              <Link
                href="/products/antique-brass-ganesha"
                className={buttonVariants({ variant: "outline", size: "default" })}
              >
                View Antique Ganesha
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden border border-deep-brown/15 bg-off-white">
            <Image
              src="/images/products/ganesha.jpg"
              alt="Antique Brass Ganesha for Griha Pravesh"
              fill
              className="object-contain p-6"
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
                Auspicious Housewarming Pieces
              </h2>
            </div>
            <Link
              href="/shop?occasion=housewarming"
              className="text-xs uppercase tracking-[0.2em] font-medium text-forest hover:text-terracotta"
            >
              View Full Housewarming Edit &rarr;
            </Link>
          </div>

          <ProductGrid products={products.items} className="mt-10" />
        </section>
      </div>
    </div>
  );
}
