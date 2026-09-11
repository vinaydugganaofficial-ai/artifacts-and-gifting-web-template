import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { tokens } from "@/config/theme";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  children: ReactNode;
  footer: { prompt: string; href: string; label: string };
};

/**
 * Two-column frame shared by sign-in and sign-up.
 *
 * Keeps the two pages visually identical, so moving between them feels like one
 * flow rather than two screens.
 */
export function AuthShell({
  eyebrow,
  title,
  description,
  image,
  children,
  footer,
}: AuthShellProps) {
  return (
    <section className={cn(tokens.gutter, "pb-24 pt-28 md:pb-28 md:pt-32")}>
      <div className={cn(tokens.container, "grid gap-8 lg:grid-cols-2 lg:gap-12 items-center")}>
        <div className="relative hidden min-h-[620px] overflow-hidden border border-deep-brown/15 bg-sand lg:block">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 text-off-white">
            <span className="inline-block px-3 py-1 bg-terracotta/90 text-off-white text-[9px] uppercase tracking-[0.24em] font-medium mb-3">
              Heritage Concierge
            </span>
            <p className="font-display text-2xl sm:text-3xl leading-snug">
              Gifts That Carry India Forward
            </p>
            <p className="mt-2 text-xs text-sand/85 max-w-sm leading-relaxed">
              Every artifact preserves generational human craft, direct maker dignity, and memorable ceremonial presentation.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-lg bg-off-white/80 p-8 sm:p-12 border border-deep-brown/12 shadow-[0_12px_40px_rgba(51,42,36,0.06)] self-center">
          <p className={cn(tokens.eyebrow, "text-terracotta font-medium")}>{eyebrow}</p>

          <h1 className="mt-4 font-display text-3xl sm:text-4xl leading-tight text-forest">
            {title}
          </h1>

          <span className={cn(tokens.hairline, "mt-5")} aria-hidden />

          <p className="mt-5 text-[15px] leading-relaxed text-deep-brown/75">
            {description}
          </p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 border-t border-deep-brown/12 pt-6 text-sm text-deep-brown/70">
            {footer.prompt}{" "}
            <Link href={footer.href} className="link-underline font-medium text-forest hover:text-terracotta">
              {footer.label}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
