import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import { getAllArtisanSlugs, getArtisanPage } from "@/lib/services/content.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Prose } from "@/components/shared/Prose";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllArtisanSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getArtisanPage(slug);

  if (!page) return { title: "Artisan not found" };

  return {
    title: page.artisan.name,
    description: page.artisan.summary,
    alternates: { canonical: `/artisans/${page.artisan.slug}` },
    openGraph: {
      title: `${page.artisan.name} — ${page.artisan.craft}`,
      description: page.artisan.summary,
      images: [{ url: page.artisan.portrait, alt: page.artisan.portraitAlt }],
    },
  };
}

export default async function ArtisanDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = await getArtisanPage(slug);

  if (!page) notFound();

  const { artisan, products } = page;

  return (
    <article className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/artisans", label: "Artisans" },
            { label: artisan.name },
          ]}
        />

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden border border-deep-brown/15 bg-sand lg:sticky lg:top-28 lg:self-start">
            <Image
              src={artisan.portrait}
              alt={artisan.portraitAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
            />
          </div>

          <div>
            <PageHeader eyebrow={artisan.craft} title={artisan.name} />

            <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5 border-y border-deep-brown/15 py-6 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-deep-brown/50 font-medium">
                  Region
                </dt>
                <dd className="mt-1 text-deep-brown font-medium">{artisan.region}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-deep-brown/50 font-medium">
                  At the bench
                </dt>
                <dd className="mt-1 text-deep-brown font-medium">{artisan.yearsActive} years</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-deep-brown/50 font-medium">
                  Craft
                </dt>
                <dd className="mt-1 text-deep-brown font-medium">{artisan.craft}</dd>
              </div>
            </dl>

            <Prose paragraphs={artisan.story} className="mt-10" lede />
          </div>
        </div>

        {products.length > 0 ? (
          <section className="mt-24 border-t border-deep-brown/15 pt-16 md:mt-32">
            <SectionHeading
              eyebrow="Master Craft"
              title={`Pieces by ${artisan.name}`}
            />
            <ProductGrid products={products} className="mt-12" />
          </section>
        ) : null}
      </div>
    </article>
  );
}
