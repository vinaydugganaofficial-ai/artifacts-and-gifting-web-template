import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { listArtisans } from "@/lib/services/content.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { Prose } from "@/components/shared/Prose";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { valueProps } from "@/lib/data/gallery";
import { makingSteps } from "@/lib/data/making";
import { buttonVariants } from "@/components/ui/button";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Aaranya is a gallery for Indian craft — brass objects made slowly, finished by hand, and bought directly from the workshops that make them.",
  alternates: { canonical: "/our-story" },
};

const STORY = [
  "Aaranya began with a problem that anyone who has looked for Indian brass will recognise: almost everything on offer was either mass-produced and plated to look like something it was not, or genuinely fine and completely unavailable outside a handful of galleries.",
  "The workshops themselves had never gone anywhere. Moradabad still casts, Swamimalai still models in wax, Jaipur still founds bells tuned by ear. What had gone was the path between those benches and the houses that would want what comes off them. Layers of intermediaries had made the objects more expensive and the artisans less visible at the same time.",
  "So we do the simplest thing available: buy directly, at the workshop, and put the maker's name on the page. Nothing here is anonymous, nothing is plated, and nothing is finished to a machine standard the method was never meant to reach.",
];

export default async function OurStoryPage() {
  const artisans = await listArtisans();

  return (
    <>
      <section className={cn(tokens.gutter, tokens.pageTop)}>
        <div className={tokens.container}>
          <PageHeader
            eyebrow="The House"
            title="A gallery for Indian craft."
            description="Handcrafted in India, inspired by centuries of tradition. We exist to keep brass objects in circulation — made slowly, finished by hand, and kept for generations."
          />

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-20">
            <Prose paragraphs={STORY} lede />

            <figure className="relative aspect-[4/5] overflow-hidden bg-charcoal">
              <Image
                src="/images/artisan-portrait.jpg"
                alt="An artisan at the workbench holding a finished brass figure"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 460px"
                className="object-cover object-top"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* What we commit to */}
      <section className={cn(tokens.gutter, "py-24 md:py-32")}>
        <div className={tokens.container}>
          <SectionHeading eyebrow="What we hold to" title="Four commitments." />

          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((value, index) => (
              <li key={value.id}>
                <p aria-hidden className="font-display text-5xl text-gold/40">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-2xl">{value.title}</h3>
                <span className="mt-4 block h-px w-10 bg-gold" aria-hidden />
                <p className="mt-4 text-sm leading-relaxed text-charcoal/65">
                  {value.copy}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How a piece is made */}
      <section className={cn(tokens.gutter, "bg-ivory-deep/40 py-24 md:py-32")}>
        <div className={tokens.container}>
          <SectionHeading
            eyebrow="Process"
            title="From wax to a lit room."
            description="Five stages, none of which can be hurried. The full sequence, with photographs from the workshops, is on the homepage."
          />

          <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {makingSteps.map((step) => (
              <li key={step.number}>
                <p aria-hidden className="font-display text-4xl text-gold/45">
                  {step.number}
                </p>
                <h3 className="mt-2 font-display text-xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
                  {step.copy}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The people */}
      <section className={cn(tokens.gutter, tokens.pageBottom, "pt-24 md:pt-32")}>
        <div className={tokens.container}>
          <SectionHeading
            eyebrow="The Makers"
            title="Named, not anonymous."
            description={`We work with ${artisans.length} workshops across three states. Every product page names the person who made the piece.`}
          />

          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
            {artisans.map((artisan) => (
              <li key={artisan.slug}>
                <Link
                  href={`/artisans/${artisan.slug}`}
                  className="link-underline text-lg text-charcoal/80"
                >
                  {artisan.name}
                  <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-charcoal/40">
                    {artisan.region.split(",")[0]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex flex-wrap gap-4">
            <Link href="/artisans" className={buttonVariants({ variant: "outline" })}>
              Meet the artisans
            </Link>
            <Link href="/shop" className={buttonVariants({ variant: "primary" })}>
              View the collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
