"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

type GalleryItem = {
  src: string;
  alt: string;
  label: string;
  category: string;
  colSpan: string;
  aspect: string;
};

const galleryItems: GalleryItem[] = [
  {
    src: "/images/brass-texture.jpg",
    alt: "Close-up of engraved antique brass surface with rich patina",
    label: "Chased Aureole & Patina",
    category: "Detail",
    colSpan: "col-span-1 md:col-span-4",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/images/collections/gifting.jpg",
    alt: "Handcrafted Indian gift packaging with raw terracotta silk ribbon",
    label: "Unbleached Cotton & Madder Ribbon",
    category: "Packaging",
    colSpan: "col-span-1 md:col-span-8",
    aspect: "aspect-[16/10]",
  },
  {
    src: "/images/collections/heritage.jpg",
    alt: "Brass urli and lamps in an Indian courtyard setting",
    label: "Morning Sunlight in the Courtyard",
    category: "Living",
    colSpan: "col-span-1 md:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    src: "/images/artisan-portrait.jpg",
    alt: "Master artisan working at the bench in Moradabad",
    label: "Patience at the Moradabad Bench",
    category: "Workshop",
    colSpan: "col-span-1 md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/images/hero-gifting.jpg",
    alt: "Gifting arrangement with brass Ganesha and blossoms",
    label: "Arranged for Auspicious Moments",
    category: "Celebration",
    colSpan: "col-span-1 md:col-span-6",
    aspect: "aspect-[16/11]",
  },
  {
    src: "/images/making/finish.jpg",
    alt: "Hand-burnishing cast brass with natural beeswax",
    label: "Natural Beeswax Polish",
    category: "Process",
    colSpan: "col-span-1 md:col-span-6",
    aspect: "aspect-[16/11]",
  },
];

export function VisualGallery() {
  return (
    <section className="bg-sand py-20 md:py-28 border-b border-copper/15" aria-label="Visual Gallery">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto pb-12">
            <SectionHeading
              align="center"
              eyebrow="Visual Journal"
              title="A Little More India."
              description="Scenes from our foundries, courtyards, packaging tables, and everyday living spaces celebrating the rhythm of handmade Indian craft."
            />
          </div>
        </Reveal>

        {/* Masonry-Inspired Irregular Editorial Gallery */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12">
          {galleryItems.map((item, index) => (
            <Reveal key={item.src} className={item.colSpan} delay={index * 0.05}>
              <figure
                data-interactive
                className={cn(
                  "group relative w-full overflow-hidden border border-copper/20 bg-sand/40 shadow-sm",
                  item.aspect,
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                />

                {/* Gentle Scrim with Soft Metadata Reveal */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-5 sm:p-6">
                  <div className="text-off-white transform translate-y-1 transition-transform duration-300 group-hover:translate-y-0">
                    <span className="text-[9px] uppercase tracking-[0.24em] text-saffron font-medium">
                      {item.category}
                    </span>
                    <figcaption className="mt-1 font-display text-base sm:text-lg text-off-white">
                      {item.label}
                    </figcaption>
                  </div>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
