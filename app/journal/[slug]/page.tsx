import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { getAllJournalSlugs, getJournalPage } from "@/lib/services/content.service";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Prose } from "@/components/shared/Prose";
import { siteConfig } from "@/config/site";
import { formatDate, toDateTimeAttribute, cn } from "@/lib/utils";
import { tokens } from "@/config/theme";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllJournalSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getJournalPage(slug);

  if (!page) return { title: "Note not found" };

  return {
    title: page.entry.title,
    description: page.entry.excerpt,
    alternates: { canonical: `/journal/${page.entry.slug}` },
    openGraph: {
      type: "article",
      title: page.entry.title,
      description: page.entry.excerpt,
      publishedTime: page.entry.publishedAt,
      images: [{ url: page.entry.image, alt: page.entry.imageAlt }],
    },
  };
}

export default async function JournalEntryPage({ params }: Props) {
  const { slug } = await params;
  const page = await getJournalPage(slug);

  if (!page) notFound();

  const { entry, more } = page;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.excerpt,
    datePublished: entry.publishedAt,
    image: [`${siteConfig.baseUrl}${entry.image}`],
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.baseUrl}/journal/${entry.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
        <div className={tokens.container}>
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/journal", label: "Journal" },
              { label: entry.category },
            ]}
          />

          <header className="mx-auto mt-10 max-w-3xl">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.24em] text-gold-muted">
              <span>{entry.category}</span>
              <span aria-hidden className="text-charcoal/25">
                /
              </span>
              <time dateTime={toDateTimeAttribute(entry.publishedAt)}>
                {formatDate(entry.publishedAt)}
              </time>
              <span aria-hidden className="text-charcoal/25">
                /
              </span>
              <span>{entry.readingMinutes} min read</span>
            </p>

            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]">
              {entry.title}
            </h1>

            <span className={cn(tokens.hairline, "mt-8")} aria-hidden />
          </header>

          <figure className="relative mt-12 aspect-[16/9] overflow-hidden bg-charcoal">
            <Image
              src={entry.image}
              alt={entry.imageAlt}
              fill
              priority
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover"
            />
          </figure>

          <Prose paragraphs={entry.body} className="mx-auto mt-14" lede />

          {more.length > 0 ? (
            <aside className="mx-auto mt-24 max-w-3xl border-t border-charcoal/10 pt-10">
              <h2 className="text-[11px] uppercase tracking-[0.28em] text-gold-muted">
                Read next
              </h2>

              <ul className="mt-6 space-y-5">
                {more.map((other) => (
                  <li key={other.slug}>
                    <Link href={`/journal/${other.slug}`} className="group block">
                      <p className="font-display text-2xl leading-snug">
                        <span className="link-underline">{other.title}</span>
                      </p>
                      <p className="mt-1 text-sm text-charcoal/55">{other.excerpt}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </article>
    </>
  );
}
