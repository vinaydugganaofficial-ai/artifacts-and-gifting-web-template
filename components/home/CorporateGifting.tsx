"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

const corporateFeatures = [
  {
    title: "Custom Quantities",
    desc: "From bespoke orders of 25 executive boxes to nationwide festive dispatches of 2,000+ units.",
  },
  {
    title: "Artisanal Gift Packaging",
    desc: "Unbleached handmade cotton boxes with wax seals, letterpress note cards, and botanical dyed ribbons.",
  },
  {
    title: "Personalization & Note Cards",
    desc: "Custom brass engraving, commemorative seal stamps, and bespoke founder correspondence.",
  },
  {
    title: "Corporate Identity Integration",
    desc: "Subtle, dignified co-branding that honours Indian craftsmanship without looking commercial.",
  },
  {
    title: "Pan-India & Global Fulfilment",
    desc: "Climate-controlled white-glove delivery to multiple recipient addresses across Tier-1 & Tier-2 cities.",
  },
];

export function CorporateGifting() {
  return (
    <section className="bg-sand py-20 md:py-28 border-b border-copper/15" aria-label="Corporate Gifting">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: B2B Narrative and Features */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <Reveal>
              <SectionHeading
                eyebrow="Bespoke Institutional Gifting"
                title="Gifting, With Meaning."
                description="Thoughtfully curated Indian artifacts for clients, teams, milestones, and occasions worth remembering. Replace generic corporate merchandise with authentic pieces of cultural heritage."
              />
            </Reveal>

            <div className="mt-8 space-y-4">
              {corporateFeatures.map((feat, idx) => (
                <Reveal key={feat.title} delay={idx * 0.05}>
                  <div className="flex items-start gap-3.5 bg-off-white/70 p-4 border border-copper/15">
                    <CheckCircle2 className="size-4 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-forest">
                        {feat.title}
                      </h4>
                      <p className="mt-1 text-xs text-deep-brown/75 font-sans leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.25}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/gifting/corporate"
                  className="group inline-flex items-center gap-2 bg-forest px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-off-white hover:bg-forest-light transition-all shadow-sm"
                >
                  <span>Explore Corporate Gifting</span>
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/contact?topic=corporate"
                  className="inline-flex items-center gap-2 border border-forest/30 bg-sand/60 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-forest hover:bg-off-white hover:border-forest transition-colors"
                >
                  <Mail className="size-3.5 text-terracotta" />
                  <span>Talk to Our Gifting Team</span>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Editorial Visual */}
          <div className="lg:col-span-6 relative">
            <Reveal delay={0.15}>
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-copper/25 shadow-xl bg-sand/40">
                <Image
                  src="/images/corporate-gifting.jpg"
                  alt="Editorial presentation of luxury Indian corporate gifting boxes with wax seals and letterpress note"
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover"
                />
              </div>

              {/* Stat callout card */}
              <div className="mt-6 grid grid-cols-3 gap-4 border border-copper/20 bg-off-white p-6 shadow-sm">
                <div>
                  <span className="font-display text-2xl sm:text-3xl text-forest font-medium block">100%</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-copper block mt-1">Artisan Made</span>
                </div>
                <div>
                  <span className="font-display text-2xl sm:text-3xl text-forest font-medium block">Pan-India</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-copper block mt-1">Direct Delivery</span>
                </div>
                <div>
                  <span className="font-display text-2xl sm:text-3xl text-forest font-medium block">Bespoke</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-copper block mt-1">Custom Packaging</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
