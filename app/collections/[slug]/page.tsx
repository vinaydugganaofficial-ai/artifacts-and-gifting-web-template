import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllCollectionSlugs,
  getCollectionBySlug,
  getCollectionPage,
} from "@/lib/services/catalog.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductGrid } from "@/components/products/ProductGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) return { title: "Collection not found" };

  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: collection.title,
      description: collection.description,
      images: [{ url: collection.image, alt: collection.imageAlt }],
    },
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = await getCollectionPage(slug);

  if (!page) notFound();

  const { collection, products } = page;

  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/collections", label: "Collections" },
            { label: collection.title },
          ]}
        />

        <PageHeader
          className="mt-8"
          eyebrow="Collection"
          title={collection.title}
          description={collection.description}
        />

        {/* An empty collection says so plainly. It never falls back to showing
            unrelated products, which would advertise pieces it does not hold. */}
        {products.length > 0 ? (
          <ProductGrid products={products} className="mt-14" priorityCount={3} />
        ) : (
          <EmptyState
            className="mt-14"
            title="This room is being hung."
            description="No pieces are in this collection at the moment. New castings arrive from the atelier regularly."
            action={{ href: "/shop", label: "View all artifacts" }}
          />
        )}
      </div>
    </section>
  );
}
