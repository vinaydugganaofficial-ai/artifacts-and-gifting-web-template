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
      <div className={cn(tokens.container, "grid gap-12 lg:grid-cols-2 lg:gap-20")}>
        <div className="relative hidden min-h-[560px] overflow-hidden bg-charcoal lg:block">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        </div>

        <div className="mx-auto w-full max-w-md self-center">
          <p className={cn(tokens.eyebrow, "text-gold-muted")}>{eyebrow}</p>

          <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
            {title}
          </h1>

          <span className={cn(tokens.hairline, "mt-6")} aria-hidden />

          <p className="mt-6 text-[15px] leading-relaxed text-charcoal/70">
            {description}
          </p>

          <div className="mt-10">{children}</div>

          <p className="mt-8 border-t border-charcoal/10 pt-6 text-sm text-charcoal/60">
            {footer.prompt}{" "}
            <Link href={footer.href} className="link-underline text-charcoal">
              {footer.label}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
