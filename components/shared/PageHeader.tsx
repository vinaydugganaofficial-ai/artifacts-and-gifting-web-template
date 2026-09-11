import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { tokens } from "@/config/theme";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional actions or metadata rendered beneath the description. */
  children?: ReactNode;
  className?: string;
};

/**
 * Standard interior-page masthead: eyebrow, `h1`, hairline, lede.
 *
 * Every route below the homepage uses this, so page rhythm is defined once.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("max-w-3xl", className)}>
      {eyebrow ? (
        <p className={cn(tokens.eyebrow, "text-terracotta font-medium")}>{eyebrow}</p>
      ) : null}

      <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-forest sm:text-5xl lg:text-[3.75rem]">
        {title}
      </h1>

      <span className={cn(tokens.hairline, "mt-6")} aria-hidden />

      {description ? (
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-deep-brown/80">
          {description}
        </p>
      ) : null}

      {children}
    </header>
  );
}
