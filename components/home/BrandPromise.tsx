type BrandPromiseProps = {
  promises: readonly string[];
};

/**
 * Infinite marquee.
 *
 * The list is rendered twice and the track translated by -50%, so the second
 * copy occupies the first's position exactly as the animation loops — which is
 * what makes the scroll appear seamless.
 */
export function BrandPromise({ promises }: BrandPromiseProps) {
  if (promises.length === 0) return null;

  const sequence = [...promises, ...promises];

  return (
    <section
      aria-label="Brand promise"
      className="overflow-hidden border-y border-gold/25 bg-ivory py-7"
    >
      <div className="marquee-track flex w-max">
        {sequence.map((item, index) => (
          <p
            key={`${item}-${index}`}
            // The duplicated half is decorative; hiding it stops screen readers
            // reading the whole list twice.
            aria-hidden={index >= promises.length}
            className="flex items-center px-8 font-display text-2xl tracking-[0.04em] text-charcoal sm:text-3xl"
          >
            {item}
            <span aria-hidden className="ml-8 inline-block h-px w-10 bg-gold" />
          </p>
        ))}
      </div>
    </section>
  );
}
