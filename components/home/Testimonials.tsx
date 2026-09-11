"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Testimonial } from "@/types/content";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { easeLuxury } from "@/lib/motion";
import { padCount } from "@/lib/utils";

type TestimonialsProps = {
  eyebrow: string;
  title: string;
  testimonials: readonly Testimonial[];
};

export function Testimonials({ eyebrow, title, testimonials }: TestimonialsProps) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  if (testimonials.length === 0) return null;

  const current = testimonials[index];

  function go(direction: 1 | -1) {
    setIndex((value) => (value + direction + testimonials.length) % testimonials.length);
  }

  return (
    <section className="bg-ivory px-5 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[920px] text-center">
        <SectionHeading align="center" eyebrow={eyebrow} title={title} />

        <div className="relative mt-16 min-h-[260px] sm:min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: easeLuxury }}
            >
              <p className="font-display text-2xl leading-snug text-charcoal sm:text-4xl">
                &ldquo;{current.quote}&rdquo;
              </p>
              <footer className="mt-10">
                <cite className="not-italic">
                  <span className="block text-[12px] uppercase tracking-[0.28em] text-charcoal">
                    {current.name}
                  </span>
                  <span className="mt-2 block text-[11px] uppercase tracking-[0.22em] text-gold">
                    {current.location}
                  </span>
                </cite>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {testimonials.length > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
              className="grid size-11 place-items-center border border-charcoal/15 text-charcoal transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>

            <p
              aria-live="polite"
              className="text-[11px] uppercase tracking-[0.28em] text-charcoal/40"
            >
              {padCount(index + 1)} — {padCount(testimonials.length)}
            </p>

            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => go(1)}
              className="grid size-11 place-items-center border border-charcoal/15 text-charcoal transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
