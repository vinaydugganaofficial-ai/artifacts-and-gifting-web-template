import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { listJournalEntries } from "@/lib/services/content.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatDate, toDateTimeAttribute, cn } from "@/lib/utils";
import { tokens } from "@/config/theme";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes from the workshop — on material, method, and the houses these objects enter.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const entries = await listJournalEntries();

  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="Writing"
          title="Notes from the workshop."
          description="Essays on making, material, and the houses these objects enter. The journal gathers slowly."
        />

        <ul className="mt-16 space-y-16">
          {entries.map((entry, index) => (
            <li key={entry.slug}>
              <article className="grid gap-8 md:grid-cols-12 md:gap-10">
                <Link
                  href={`/journal/${entry.slug}`}
                  className="group relative block aspect-[16/10] overflow-hidden bg-charcoal md:col-span-5"
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

                  <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight sm:text-4xl">
                    <Link href={`/journal/${entry.slug}`} className="link-underline">
                      {entry.title}
                    </Link>
                  </h2>

                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-charcoal/65">
                    {entry.excerpt}
                  </p>

                  <Link
                    href={`/journal/${entry.slug}`}
                    className="mt-6 inline-block text-[11px] uppercase tracking-[0.22em] text-charcoal/60 transition-colors hover:text-gold"
                  >
                    Read the note
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
