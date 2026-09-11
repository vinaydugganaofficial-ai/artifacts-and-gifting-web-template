import { cn } from "@/lib/utils";

type ProseProps = {
  /** Paragraphs, rendered in order. */
  paragraphs: readonly string[];
  className?: string;
  /** Enlarges the opening paragraph, as a printed article would. */
  lede?: boolean;
};

/**
 * Long-form body copy with consistent measure and rhythm.
 *
 * Takes an array of plain strings rather than HTML — content never carries
 * markup, so there is no path for `dangerouslySetInnerHTML` and no injection
 * surface if the source later becomes a CMS.
 */
export function Prose({ paragraphs, className, lede = false }: ProseProps) {
  return (
    <div className={cn("max-w-[62ch] space-y-6", className)}>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={cn(
            "leading-relaxed text-charcoal/75",
            lede && index === 0
              ? "text-[19px] leading-[1.6] text-charcoal/85"
              : "text-[16px]",
          )}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
