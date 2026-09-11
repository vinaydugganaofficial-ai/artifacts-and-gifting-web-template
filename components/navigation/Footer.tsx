"use client";

import Link from "next/link";

import type { FooterColumn, FooterLink as FooterLinkType, NavLink } from "@/config/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FooterProps = {
  tagline: string;
  siteName: string;
  columns: readonly FooterColumn[];
  legalLinks: readonly NavLink[];
  year: number;
};

export function Footer({ tagline, siteName, columns, legalLinks, year }: FooterProps) {
  return (
    <footer className="bg-forest text-sand">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-sand/15">
          <div>
            <span className="text-[10px] uppercase tracking-[0.32em] text-saffron font-medium">
              Viraasat Gifting House
            </span>
            <h2 className="mt-2 max-w-xl font-display text-3xl sm:text-4xl md:text-5xl leading-[1.18] text-off-white">
              {tagline}
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-sand/70 leading-relaxed">
            Curating India&apos;s finest brass artifacts, sacred forms, and heirloom objects for homes, celebrations, and thoughtful gifting.
          </p>
        </div>

        {/* Columns on desktop */}
        <div className="mt-14 hidden grid-cols-2 gap-10 md:grid md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] uppercase tracking-[0.28em] text-saffron font-medium">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}-${link.label}`}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Accordion on mobile */}
        <Accordion type="single" collapsible className="mt-8 md:hidden">
          {columns.map((column) => (
            <AccordionItem key={column.title} value={column.title} tone="dark">
              <AccordionTrigger tone="dark" className="text-off-white text-sm">
                {column.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}-${link.label}`}>
                      <FooterLink {...link} />
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 flex flex-col gap-4 border-t border-sand/10 pt-8 text-[11px] uppercase tracking-[0.2em] text-sand/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteName}. All rights reserved. Handcrafted in India.
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-terracotta">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label, external }: FooterLinkType) {
  const className =
    "text-sm tracking-wide text-sand/80 transition-colors hover:text-off-white hover:translate-x-0.5 inline-block";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
