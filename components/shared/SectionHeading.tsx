import type { ElementType } from "react";

import { cn } from "@/lib/utils";
import { AccentLine } from "@/components/shared/Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Inverts the palette for use on dark forest green sections. */
  light?: boolean;
  as?: Extract<ElementType, "h1" | "h2" | "h3">;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-[11px] uppercase tracking-[0.28em] font-medium",
            light ? "text-saffron" : "text-copper",
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <Heading
        className={cn(
          "font-display text-3xl font-normal leading-[1.18] sm:text-4xl lg:text-[2.75rem]",
          light ? "text-off-white" : "text-forest",
        )}
      >
        {title}
      </Heading>

      <AccentLine className={cn("mt-4 w-12", align === "center" && "mx-auto")} />

      {description ? (
        <p
          className={cn(
            "mt-4 max-w-xl text-sm leading-relaxed",
            light ? "text-sand/80" : "text-deep-brown/75",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
