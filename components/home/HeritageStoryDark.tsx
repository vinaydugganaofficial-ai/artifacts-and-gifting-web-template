"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { easeTactile, revealViewport } from "@/lib/motion";

export function HeritageStoryDark() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-forest py-20 md:py-28 text-sand overflow-hidden" aria-label="Heritage Story">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Soft Masked Image Reveal */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={revealViewport}
              transition={{ duration: 0.7, ease: easeTactile }}
              className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden border border-sand/20 shadow-2xl bg-forest-deep"
            >
              <Image
                src="/images/collections/heritage.jpg"
                alt="Tactile Indian heritage brass objects and vessels resting in natural light"
                fill
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* Right Column: Editorial Narrative in Warm Sand / Off-White */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <Reveal>
              <SectionHeading
                light
                eyebrow="Cultural Continuum"
                title="India, In Objects."
                description="From carved wood to cast brass, India's craft traditions have always lived in the objects we keep close. Not merely as decorative fragments, but as physical companions that carry prayer, memory, and community across generations."
              />
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 space-y-4 text-xs sm:text-sm leading-relaxed text-sand/80 font-sans">
                <p>
                  Centuries before industrial mass production, Indian homes were furnished with objects shaped by hand, earth, and flame. A brass lamp was never just metal; it was an invitation to pause at dusk. An urli was not just a basin; it held the day&apos;s fresh blossoms at the threshold.
                </p>
                <p>
                  At Viraasat, we work directly with artisan families in historic craft clusters to ensure these traditions remain vital, valued, and celebrated in modern living spaces.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-6 pt-6 border-t border-sand/15">
                <Link
                  href="/our-story"
                  className="group inline-flex items-center gap-2 bg-sand px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-forest hover:bg-off-white transition-colors"
                >
                  <span>Our Craft Philosophy</span>
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <div className="text-left">
                  <span className="block font-display text-lg text-off-white font-medium">500+ Years</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-saffron">Living Metal Heritage</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
