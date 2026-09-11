"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

type OccasionTile = {
  id: string;
  title: string;
  descriptor: string;
  href: string;
  image: string;
  imageAlt: string;
};

const occasions: OccasionTile[] = [
  {
    id: "corporate",
    title: "Corporate",
    descriptor: "Thoughtful objects for clients, teams, and milestones.",
    href: "/gifting/corporate",
    image: "/images/corporate-gifting.jpg",
    imageAlt: "Luxury corporate gift packaging with brass tokens on executive desk",
  },
  {
    id: "wedding",
    title: "Wedding",
    descriptor: "Enduring heirlooms chosen to bless sacred beginnings.",
    href: "/gifting/wedding",
    image: "/images/collections/gifting.jpg",
    imageAlt: "Heirloom brass gift piece with natural fabric wrapping",
  },
  {
    id: "housewarming",
    title: "Housewarming",
    descriptor: "Auspicious brass urlis and deepams to ground a new home.",
    href: "/gifting/housewarming",
    image: "/images/collections/heritage.jpg",
    imageAlt: "Traditional brass urli and lamp arranged in Indian home setting",
  },
  {
    id: "festivals",
    title: "Festivals",
    descriptor: "Sacred handcrafted forms to illuminate Diwali and celebrations.",
    href: "/gifting/festivals",
    image: "/images/products/diya-set.jpg",
    imageAlt: "Hand-hammered brass oil lamps for festival illumination",
  },
  {
    id: "birthday",
    title: "Birthday",
    descriptor: "Distinctive handcrafted treasures chosen with individual care.",
    href: "/gifting/birthday",
    image: "/images/collections/craft.jpg",
    imageAlt: "Artisan-crafted brass figurine",
  },
  {
    id: "anniversary",
    title: "Anniversary",
    descriptor: "Time-tested craftsmanship to commemorate shared journeys.",
    href: "/gifting/anniversary",
    image: "/images/products/nataraja.jpg",
    imageAlt: "Sculpted Nataraja artifact symbolising timeless dance of life",
  },
];

export function OccasionGifting() {
  return (
    <section className="bg-sand py-20 md:py-28 border-b border-copper/15" aria-label="Shop by Occasion">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
            <SectionHeading
              eyebrow="Gifting Moments"
              title="Find a Gift for the Moment."
              description="From milestone celebrations to personal gestures, discover handcrafted Indian artifacts curated for the moments that matter."
            />
            <Link
              href="/gifting"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-forest hover:text-terracotta transition-colors self-start md:self-end"
            >
              <span>Explore All Occasions</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </Reveal>

        {/* Occasion Tiles Grid — 3 columns desktop, 2 tablet, 1 mobile */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06}>
              <Link
                href={item.href}
                data-interactive
                className="group relative flex flex-col bg-off-white/90 border border-copper/20 overflow-hidden transition-all duration-300 hover:border-copper/40"
              >
                {/* Image Container with Subtle Crop & Brightness Transition */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/30">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:brightness-[1.02]"
                  />
                  {/* Subtle Terracotta Accent Line on Hover */}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-terracotta scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </div>

                {/* Content Area */}
                <div className="p-5 sm:p-6 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-normal text-forest transition-transform duration-300 group-hover:translate-x-1 group-hover:text-terracotta">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-deep-brown/75 font-sans">
                      {item.descriptor}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-forest group-hover:text-terracotta transition-colors">
                    <span>Shop Gifts</span>
                    <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
