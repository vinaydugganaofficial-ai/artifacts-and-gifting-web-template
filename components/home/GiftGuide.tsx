"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

type GuidePath = {
  id: string;
  title: string;
  descriptor: string;
  href: string;
  image: string;
  imageAlt: string;
  tag: string;
};

const guidePaths: GuidePath[] = [
  {
    id: "home",
    title: "For the Home",
    descriptor: "Objects that bring warmth, architectural quietude, and living character to a space.",
    href: "/shop?collection=living-india",
    image: "/images/collections/heritage.jpg",
    imageAlt: "Indian heritage brass décor and lighting in a contemporary interior",
    tag: "Atmosphere & Living",
  },
  {
    id: "occasion",
    title: "For the Occasion",
    descriptor: "Meaningful pieces curated to mark milestone ceremonies, festive gatherings, and new beginnings.",
    href: "/gifting",
    image: "/images/collections/gifting.jpg",
    imageAlt: "Presentation gift box with handwoven textile ribbon and brass artifact",
    tag: "Weddings & Ceremonies",
  },
  {
    id: "collector",
    title: "For the Collector",
    descriptor: "Distinctive artifacts chosen for the rarity of their casting, patina depth, and human craft.",
    href: "/shop?collection=collectors-shelf",
    image: "/images/collections/craft.jpg",
    imageAlt: "Detailed lost-wax bronze sculpture with intricate chisel chasing",
    tag: "Rare Masterworks",
  },
];

export function GiftGuide() {
  return (
    <section className="bg-sand py-20 md:py-28 border-b border-copper/15" aria-label="The Art of Gifting Guide">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto pb-12">
            <SectionHeading
              align="center"
              eyebrow="Curatorial Pathways"
              title="The Art of Gifting"
              description="A thoughtful object can say what words cannot. Explore our three foundational gifting paths crafted for enduring resonance."
            />
          </div>
        </Reveal>

        {/* Three Editorial Paths */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {guidePaths.map((path, index) => (
            <Reveal key={path.id} delay={index * 0.08}>
              <Link
                href={path.href}
                data-interactive
                className="group flex flex-col bg-off-white border border-copper/20 overflow-hidden transition-all duration-300 hover:border-copper/45 shadow-sm"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand/30">
                  <Image
                    src={path.image}
                    alt={path.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-forest/90 px-3 py-1 text-[9px] uppercase tracking-[0.24em] text-sand font-medium backdrop-blur-sm">
                      {path.tag}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl sm:text-[1.75rem] font-normal text-forest group-hover:text-terracotta transition-colors">
                      {path.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-deep-brown/80 font-sans">
                      {path.descriptor}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-copper/15 flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-forest group-hover:text-terracotta transition-colors">
                    <span>Explore Guide</span>
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
