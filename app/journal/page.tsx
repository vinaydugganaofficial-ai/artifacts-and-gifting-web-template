import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { listJournalEntries } from "@/lib/services/content.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatDate, toDateTimeAttribute, cn } from "@/lib/utils";
import { tokens } from "@/config/theme";

export const metadata: Metadata = {
  title: "The Journal — Viraasat Heritage Essays",
  description:
    "Essays on Indian metallurgy, lost-wax bronze casting, living patina, and intentional gifting in contemporary homes.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const entries = await listJournalEntries();

  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="Craft & Culture"
          title="The Viraasat Journal"
          description="Essays on ancient metalcraft, sacred iconography, living patina, and the contemporary homes these objects enter."
        />

        <ul className="mt-16 space-y-16">
          {entries.map((entry, index) => (
            <li key={entry.slug} className="border-b border-deep-brown/12 pb-14 last:border-b-0">
              <article className="grid gap-8 md:grid-cols-12 md:gap-10">
                <Link
                  href={`/journal/${entry.slug}`}
                  className="group relative block aspect-[16/10] overflow-hidden border border-deep-brown/15 bg-sand md:col-span-5"
                  tabIndex={-1}
                  aria-hidden
                >
                  <Image
                    src={entry.image}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </Link>

                <div className="md:col-span-7 md:self-center">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.24em] text-terracotta font-medium">
                    <span>{entry.category}</span>
                    <span aria-hidden className="text-deep-brown/30">
                      /
                    </span>
                    <time dateTime={toDateTimeAttribute(entry.publishedAt)}>
                      {formatDate(entry.publishedAt)}
                    </time>
                    <span aria-hidden className="text-deep-brown/30">
                      /
                    </span>
                    <span>{entry.readingMinutes} min read</span>
                  </p>

                  <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight text-forest sm:text-4xl">
                    <Link href={`/journal/${entry.slug}`} className="link-underline hover:text-terracotta transition-colors">
                      {entry.title}
                    </Link>
                  </h2>

                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-deep-brown/75">
                    {entry.excerpt}
                  </p>

                  <Link
                    href={`/journal/${entry.slug}`}
                    className="mt-6 inline-block text-[11px] uppercase tracking-[0.22em] font-medium text-forest transition-colors hover:text-terracotta"
                  >
                    Read Journal Note &rarr;
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
