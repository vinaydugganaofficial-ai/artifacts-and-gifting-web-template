import Link from "next/link";

import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeaturedArtifactsProps = {
  eyebrow: string;
  title: string;
  description: string;
  products: readonly Product[];
  action: { href: string; label: string };
};

export function FeaturedArtifacts({
  eyebrow,
  title,
  description,
  products,
  action,
}: FeaturedArtifactsProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-off-white px-5 py-24 md:px-8 md:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        </Reveal>

        {/* Four across, so this reads as a curated selection rather than a
            duplicate of the three-across shop grid. */}
        <ProductGrid products={products} columns="four" className="mt-14" />

        <Link
          href={action.href}
          className={cn(buttonVariants({ variant: "sand" }), "mt-12")}
        >
          {action.label}
        </Link>
      </div>
    </section>
  );
}
