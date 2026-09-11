"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { giftingMegaMenuData } from "@/config/site";

type GiftingMegaMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function GiftingMegaMenu({ isOpen, onClose }: GiftingMegaMenuProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onMouseLeave={onClose}
      className="absolute inset-x-0 top-full z-[60] border-b border-copper/20 bg-off-white shadow-xl shadow-forest/5"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Column 1: By Occasion */}
          <div className="col-span-4">
            <h4 className="font-display text-sm tracking-[0.18em] uppercase text-forest font-semibold">
              By Occasion
            </h4>
            <div className="mt-1 h-px w-8 bg-terracotta/40" />
            <ul className="mt-5 space-y-3">
              {giftingMegaMenuData.byOccasion.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex flex-col transition-colors"
                  >
                    <span className="font-sans text-xs font-medium text-deep-brown group-hover:text-terracotta transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-deep-brown/60">
                      {item.desc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: By Budget */}
          <div className="col-span-3">
            <h4 className="font-display text-sm tracking-[0.18em] uppercase text-forest font-semibold">
              By Budget
            </h4>
            <div className="mt-1 h-px w-8 bg-terracotta/40" />
            <ul className="mt-5 space-y-3">
              {giftingMegaMenuData.byBudget.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block font-sans text-xs text-deep-brown/80 hover:text-terracotta hover:translate-x-1 transition-all"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-copper/15">
              <Link
                href="/gifting/corporate"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-forest hover:text-terracotta transition-colors"
              >
                <span>Bespoke Corporate Inquiries</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Column 3: By Type */}
          <div className="col-span-2">
            <h4 className="font-display text-sm tracking-[0.18em] uppercase text-forest font-semibold">
              By Type
            </h4>
            <div className="mt-1 h-px w-8 bg-terracotta/40" />
            <ul className="mt-5 space-y-3">
              {giftingMegaMenuData.byType.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block font-sans text-xs text-deep-brown/80 hover:text-terracotta transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Curated Editorial Feature */}
          <div className="col-span-3 border-l border-copper/15 pl-6">
            <Link
              href={giftingMegaMenuData.featured.href}
              onClick={onClose}
              className="group block overflow-hidden"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/40">
                <Image
                  src={giftingMegaMenuData.featured.image}
                  alt={giftingMegaMenuData.featured.title}
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-3">
                <p className="text-[9px] uppercase tracking-[0.24em] text-terracotta font-medium">
                  Curated Edit
                </p>
                <h5 className="font-display text-base font-medium text-forest group-hover:text-terracotta transition-colors">
                  {giftingMegaMenuData.featured.title}
                </h5>
                <p className="mt-1 text-[11px] leading-relaxed text-deep-brown/70">
                  {giftingMegaMenuData.featured.subtitle}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
