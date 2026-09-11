import Image from "next/image";

import { Reveal, GoldLine } from "@/components/shared/Reveal";

type HeritageIntroProps = {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
  support: string;
  image: { src: string; alt: string };
};

export function HeritageIntro({
  id,
  eyebrow,
  title,
  lede,
  support,
  image,
}: HeritageIntroProps) {
  return (
    <section
      id={id}
      // `scroll-mt` offsets the fixed header so the anchor target is not hidden
      // beneath it when the scroll cue is used.
      className="relative scroll-mt-24 overflow-hidden bg-ivory px-5 py-24 md:px-8 md:py-32 lg:px-12"
    >
      <div className="mx-auto grid max-w-[1440px] items-end gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <p className="text-[11px] uppercase tracking-[0.38em] text-gold-muted">
            {eyebrow}
          </p>
          <h2 className="mt-5 max-w-[14ch] font-display text-5xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-[5.4rem]">
            {title}
          </h2>
        </Reveal>

        <Reveal className="lg:col-span-5 lg:pb-4" delay={0.12}>
          <GoldLine className="mb-8 w-16" />
          <p className="max-w-md text-[17px] leading-relaxed text-charcoal/75">{lede}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-charcoal/55">
            {support}
          </p>
          <div className="relative mt-10 aspect-[5/3] w-full max-w-sm overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 90vw, 380px"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
