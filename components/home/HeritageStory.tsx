import { Reveal } from "@/components/shared/Reveal";

type HeritageStoryProps = {
  eyebrow: string;
  title: string;
  lede: string;
  support: string;
};

export function HeritageStory({ eyebrow, title, lede, support }: HeritageStoryProps) {
  return (
    <section className="relative overflow-hidden bg-forest px-5 py-28 text-off-white md:px-8 md:py-36 lg:px-12">
      <LotusField />

      <div className="relative mx-auto max-w-[1440px]">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-terracotta">{eyebrow}</p>

          <h2 className="mt-6 max-w-[16ch] font-display text-4xl leading-[1.12] sm:text-6xl lg:text-[4.4rem]">
            {title}
          </h2>

          <span className="mt-8 block h-px w-16 bg-terracotta" aria-hidden />

          <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-off-white/85">
            {lede}
          </p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-off-white/65">{support}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Decorative mandala. Geometry is deterministic, so SSR and client agree. */
function LotusField() {
  const petals = Array.from({ length: 8 }, (_, index) => {
    const angle = (Math.PI / 4) * index;
    return {
      index,
      x: 400 + Math.cos(angle) * 150,
      y: 200 + Math.sin(angle) * 150,
    };
  });

  return (
    <svg
      aria-hidden
      viewBox="0 0 800 400"
      className="pointer-events-none absolute -right-16 top-1/2 w-[720px] -translate-y-1/2 text-sand opacity-[0.10]"
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        <circle cx="400" cy="200" r="40" />
        <circle cx="400" cy="200" r="90" />
        <circle cx="400" cy="200" r="150" />
        <circle cx="400" cy="200" r="210" />
        {petals.map((petal) => (
          <ellipse
            key={petal.index}
            cx={petal.x}
            cy={petal.y}
            rx="42"
            ry="18"
            transform={`rotate(${petal.index * 45} ${petal.x} ${petal.y})`}
          />
        ))}
        <path d="M400 20 V380 M220 200 H580" />
      </g>
    </svg>
  );
}
