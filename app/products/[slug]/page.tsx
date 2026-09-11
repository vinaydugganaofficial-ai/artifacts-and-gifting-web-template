import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import {
  getAllProductSlugs,
  getCollectionBySlug,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/services/catalog.service";
import { primaryCollection } from "@/types/product";
import { siteConfig } from "@/config/site";
import { formatPrice, cn } from "@/lib/utils";
import { tokens } from "@/config/theme";
import { ProductActions } from "@/components/products/ProductActions";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/SectionHeading";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Artifact not found" };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      images: product.images.map((image) => ({ url: image.src, alt: image.alt })),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [related, collection] = await Promise.all([
    getRelatedProducts(product),
    getCollectionBySlug(primaryCollection(product)),
  ]);

  /**
   * Product structured data. Lets search engines show price and availability
   * directly in results. Built from the same values the page renders, so the
   * markup can never disagree with what a visitor sees.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => `${siteConfig.baseUrl}${image.src}`),
    material: product.material,
    category: product.category,
    ...(product.artisan ? { brand: { "@type": "Brand", name: siteConfig.name } } : {}),
    offers: {
      "@type": "Offer",
      url: `${siteConfig.baseUrl}/products/${product.slug}`,
      priceCurrency: siteConfig.commerce.currency,
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Serialised from a plain object we construct — no user input reaches it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className={cn(tokens.gutter, "pb-24 pt-28 md:pb-28 md:pt-32")}>
        <div className={tokens.container}>
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/shop", label: "Shop" },
              ...(collection
                ? [{ href: `/collections/${collection.slug}`, label: collection.title }]
                : []),
              { label: product.name },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery images={product.images} productName={product.name} />

            <div className="flex flex-col justify-center py-2">
              <div className="flex items-center gap-3">
                <p className="text-[11px] uppercase tracking-[0.32em] text-gold">
                  {product.category}
                </p>
                {!product.inStock ? <Badge tone="soldOut">Sold out</Badge> : null}
              </div>

              <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                {product.name}
              </h1>

              <p className="mt-4 text-xl">{formatPrice(product.price)}</p>

              <span className={cn(tokens.hairline, "mt-6")} aria-hidden />

              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal/70">
                {product.description}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 text-sm text-charcoal/70">
                <Detail term="Material" value={product.material} />
                {product.dimensions ? (
                  <Detail term="Dimensions" value={product.dimensions} />
                ) : null}
                {product.weight ? <Detail term="Weight" value={product.weight} /> : null}
                {product.artisan ? (
                  <Detail term="Artisan" value={product.artisan} />
                ) : null}
                {product.care ? (
                  <Detail term="Care" value={product.care} className="col-span-2" />
                ) : null}
              </dl>

              <ProductActions product={product} />

              <p className="mt-8 border-t border-charcoal/10 pt-6 text-xs leading-relaxed text-charcoal/50">
                Cast and finished by hand, so no two pieces are identical. Read more about{" "}
                <Link
                  href="/journal/the-lost-wax-method"
                  className="link-underline text-charcoal/70"
                >
                  the lost-wax method
                </Link>{" "}
                or our{" "}
                <Link href="/shipping" className="link-underline text-charcoal/70">
                  shipping and returns
                </Link>
                .
              </p>
            </div>
          </div>

          {related.length > 0 ? (
            <section className="mt-24 border-t border-charcoal/10 pt-16 md:mt-32">
              <SectionHeading eyebrow="Also from the atelier" title="You may also like" />
              <ProductGrid products={related} className="mt-12" />
            </section>
          ) : null}
        </div>
      </article>
    </>
  );
}

function Detail({
  term,
  value,
  className,
}: {
  term: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[10px] uppercase tracking-[0.22em] text-charcoal/40">{term}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
