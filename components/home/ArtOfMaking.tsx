import Image from "next/image";

import type { MakingStep } from "@/types/content";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

type ArtOfMakingProps = {
  eyebrow: string;
  title: string;
  steps: readonly MakingStep[];
};

export function ArtOfMaking({ eyebrow, title, steps }: ArtOfMakingProps) {
  return (
    <section className="bg-sand/20 px-5 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} />
        </Reveal>

        <ol className="mt-16 space-y-20 lg:space-y-28">
          {steps.map((step, index) => (
            <li key={step.number}>
              <Reveal>
                <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                  <div
                    className={cn(
                      "relative aspect-[4/3] overflow-hidden bg-sand border border-deep-brown/10 lg:col-span-7",
                      // Alternating sides give the sequence a rhythm rather
                      // than a column of identical rows.
                      index % 2 === 1 && "lg:order-2",
                    )}
                  >
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                    />
                  </div>

                  <div className={cn("lg:col-span-5", index % 2 === 1 && "lg:order-1")}>
                    <p
                      aria-hidden
                      className="font-display text-6xl text-terracotta/60 sm:text-7xl"
                    >
                      {step.number}
                    </p>
                    <h3 className="mt-2 font-display text-4xl text-forest">{step.title}</h3>
                    <span className="mt-5 block h-px w-12 bg-terracotta" aria-hidden />
                    <p className="mt-6 max-w-md text-[15px] leading-relaxed text-deep-brown/80">
                      {step.copy}
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
