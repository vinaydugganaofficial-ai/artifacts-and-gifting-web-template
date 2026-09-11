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
  title: "Our Story — Viraasat Heritage Gifting House",
  description:
    "Viraasat connects master Indian handicraft workshops with homes across the world. Learn about our commitment to living craftsmanship, maker dignity, and generational gifting.",
  alternates: { canonical: "/our-story" },
};

const STORY = [
  "Viraasat began with a clear realization: India holds five millennia of extraordinary decorative and devotional craft traditions, yet contemporary gifting and home décor had become flooded with mass-stamped, plated replicas that lacked soul, weight, and history.",
  "The master casting guilds of Moradabad, the lost-wax bronze sculptors of Swamimalai, and the chime founders of Jaipur have preserved canons of proportion and surface metallurgy passed down from generation to generation. What was missing was a contemporary house that honored their names, paid fair workshop prices, and presented their creations as meaningful gifts worthy of life's highest milestones.",
  "At Viraasat, we work directly at the artisan benches. Nothing is plated, nothing is anonymous, and every artifact is presented with thoughtful archival packaging, certificates of origin, and lifetime care support so it can be passed down as an heirloom.",
];

export default async function OurStoryPage() {
  const artisans = await listArtisans();

  return (
    <>
      <section className={cn(tokens.gutter, tokens.pageTop)}>
        <div className={tokens.container}>
          <PageHeader
            eyebrow="The Heritage House"
            title="Living Indian Heritage. Meant to be Remembered."
            description="Handcrafted in India, inspired by centuries of tradition. We exist to keep master craft objects in living circulation — made with human patience, finished by hand, and treasured for generations."
          />

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:gap-20 items-center">
            <Prose paragraphs={STORY} lede />

            <figure className="relative aspect-[4/5] overflow-hidden border border-deep-brown/15 bg-sand">
              <Image
                src="/images/artisan-portrait.jpg"
                alt="Master artisan at the Moradabad workbench holding a hand-finished brass sculpture"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover object-top"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* What we commit to */}
      <section className={cn(tokens.gutter, "py-24 md:py-32")}>
        <div className={tokens.container}>
          <SectionHeading eyebrow="Our Principles" title="Four Foundational Commitments." />

          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((value, index) => (
              <li key={value.id} className="border border-deep-brown/12 bg-sand/40 p-8">
                <p aria-hidden className="font-display text-4xl text-terracotta/70 font-medium">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-2xl text-forest">{value.title}</h3>
                <span className="mt-4 block h-px w-10 bg-terracotta" aria-hidden />
                <p className="mt-4 text-sm leading-relaxed text-deep-brown/75">
                  {value.copy}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How a piece is made */}
      <section className={cn(tokens.gutter, "border-y border-deep-brown/12 bg-off-white/60 py-24 md:py-32")}>
        <div className={tokens.container}>
          <SectionHeading
            eyebrow="Craft Process"
            title="From Molten Wax to an Illuminated Room."
            description="Five stages of traditional metalcraft, none of which can be rushed. Each phase demands hours of focused human hands."
          />

          <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {makingSteps.map((step) => (
              <li key={step.number} className="relative">
                <p aria-hidden className="font-display text-4xl text-terracotta/80 font-medium">
                  {step.number}
                </p>
                <h3 className="mt-2 font-display text-xl text-forest">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-deep-brown/75">
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
            eyebrow="Direct Maker Dignity"
            title="Named Artisans, Never Anonymous."
            description={`We partner directly with ${artisans.length} generational workshops across Uttar Pradesh, Tamil Nadu, and Rajasthan. Every Viraasat curation honors the individual craftsperson.`}
          />

          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
            {artisans.map((artisan) => (
              <li key={artisan.slug}>
                <Link
                  href={`/artisans/${artisan.slug}`}
                  className="link-underline text-lg font-medium text-forest hover:text-terracotta"
                >
                  {artisan.name}
                  <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-deep-brown/50 font-normal">
                    {artisan.region.split(",")[0]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex flex-wrap gap-4">
            <Link href="/artisans" className={buttonVariants({ variant: "outline" })}>
              Meet the Artisans
            </Link>
            <Link href="/shop" className={buttonVariants({ variant: "primary" })}>
              View All Artifacts
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
