"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView, useReducedMotion } from "framer-motion";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ArtisanStat = {
  id: string;
  /** Counts up when scrolled into view. Omit for a purely textual stat. */
  value?: number;
  suffix?: string;
  /** Used instead of `value` for stats that are words, not numbers. */
  text?: string;
  label: string;
};

type ArtisanStoryProps = {
  eyebrow: string;
  title: string;
  lede: string;
  support: string;
  image: { src: string; alt: string };
  stats: readonly ArtisanStat[];
  action: { href: string; label: string };
};

export function ArtisanStory({
  eyebrow,
  title,
  lede,
  support,
  image,
  stats,
  action,
}: ArtisanStoryProps) {
  return (
    <section className="bg-ivory px-5 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[3/4] overflow-hidden bg-charcoal">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top"
          />
        </div>

        <div>
          <SectionHeading eyebrow={eyebrow} title={title} />

          <p className="mt-8 max-w-md text-[16px] leading-relaxed text-charcoal/75">
            {lede}
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-charcoal/55">
            {support}
          </p>

          <StatsRow stats={stats} />

          <Link
            href={action.href}
            className={cn(buttonVariants({ variant: "outline" }), "mt-10")}
          >
            {action.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatsRow({ stats }: { stats: readonly ArtisanStat[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <ul
      ref={ref}
      className="mt-10 grid grid-cols-3 gap-4 border-y border-charcoal/10 py-8"
    >
      {stats.map((stat) => (
        <li key={stat.id}>
          {typeof stat.value === "number" ? (
            <CountUp inView={inView} value={stat.value} suffix={stat.suffix ?? ""} />
          ) : (
            <p className="font-display text-3xl text-charcoal sm:text-4xl">{stat.text}</p>
          )}
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-charcoal/50">
            {stat.label}
          </p>
        </li>
      ))}
    </ul>
  );
}

function CountUp({
  inView,
  value,
  suffix,
}: {
  inView: boolean;
  value: number;
  suffix: string;
}) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;

    const start = performance.now();
    const duration = 1100;
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // Cubic ease-out: fast at first, settling on the final figure.
      setCurrent(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, value]);

  const shown = reduce ? value : current;

  return (
    <p className="font-display text-3xl tabular-nums text-charcoal sm:text-4xl">
      {shown}
      {suffix}
    </p>
  );
}
