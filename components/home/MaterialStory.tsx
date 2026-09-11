"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";
import { easeTactile } from "@/lib/motion";

type MaterialChapter = {
  num: string;
  name: string;
  triad: string;
  description: string;
  provenance: string;
  image: string;
  imageAlt: string;
};

const chapters: MaterialChapter[] = [
  {
    num: "01",
    name: "Brass",
    triad: "Warm. Enduring. Familiar.",
    description:
      "Cast with molten alloy and finished on manual turnstiles in Moradabad. Brass carries a living memory of fire and responds to touch, gradually deepening into a protective antique patina that enriches over generations.",
    provenance: "Moradabad & Swamimalai Foundries",
    image: "/images/brass-texture.jpg",
    imageAlt: "Detailed surface of hand-hammered and chiselled brass",
  },
  {
    num: "02",
    name: "Wood",
    triad: "Grained. Natural. Human.",
    description:
      "Sustainably harvested Indian rosewood and sheesham carved with traditional chisels. Left unlacquered and polished with organic beeswax to preserve the breath, tactile warmth, and grain of old-growth timber.",
    provenance: "Saharanpur & Jaipur Carving Guilds",
    image: "/images/artisan-portrait.jpg",
    imageAlt: "Artisan hands working on traditional handcrafted Indian woodwork",
  },
  {
    num: "03",
    name: "Stone",
    triad: "Grounded. Quiet. Timeless.",
    description:
      "Dholpur sandstone and soft soapstone chiselled by temple stonemasons. Heavy, architectural, and tactile — grounding modern surfaces with the serene weight of centuries-old temple courtyards.",
    provenance: "Rajasthan & Odisha Masonry",
    image: "/images/making/finish.jpg",
    imageAlt: "Finishing raw natural stone and lost-wax cast metal",
  },
  {
    num: "04",
    name: "Textile",
    triad: "Woven. Tactile. Rooted.",
    description:
      "Handspun unbleached organic cotton and Eri silk woven on pit looms. Coloured with plant extracts like madder root, indigo, and pomegranate rind for gift ribbons and unhurried presentation wraps.",
    provenance: "Bagru & Maheshwar Weaving Clusters",
    image: "/images/collections/gifting.jpg",
    imageAlt: "Handwoven natural Indian textile and keepsake packaging",
  },
];

export function MaterialStory() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeChapter = chapters[activeIdx];

  return (
    <section className="bg-off-white py-20 md:py-28 border-b border-copper/15" aria-label="Craft and Material Story">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
            <SectionHeading
              eyebrow="Material Honesty"
              title="Made From Material. Shaped by Hand."
              description="India's craft vocabulary begins with physical matter. We work with materials that celebrate age, touch, and natural grain rather than plastic perfection."
            />

            {/* Chapter Navigation Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 self-start md:self-end border border-copper/20 p-1 bg-sand/30">
              {chapters.map((chapter, idx) => (
                <button
                  key={chapter.name}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium font-sans uppercase tracking-[0.18em] transition-all",
                    activeIdx === idx
                      ? "bg-forest text-off-white shadow-sm"
                      : "text-forest/70 hover:text-terracotta",
                  )}
                >
                  <span className="text-[10px] text-saffron mr-1.5">{chapter.num}</span>
                  <span>{chapter.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Interactive Material Stage */}
        <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 bg-sand/40 border border-copper/20 p-6 sm:p-10 lg:p-14">
          {/* Left Column: Material Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl font-medium text-terracotta">
                {activeChapter.num}
              </span>
              <div className="h-px w-8 bg-copper/30" />
              <span className="text-[10px] uppercase tracking-[0.28em] text-copper font-medium">
                {activeChapter.provenance}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: easeTactile }}
              >
                <h3 className="mt-4 font-display text-3xl sm:text-4xl text-forest font-medium">
                  {activeChapter.name}
                </h3>

                <p className="mt-3 font-display text-xl sm:text-2xl text-terracotta italic font-normal">
                  “{activeChapter.triad}”
                </p>

                <p className="mt-6 text-sm sm:text-[15px] leading-relaxed text-deep-brown/85 font-sans">
                  {activeChapter.description}
                </p>

                <div className="mt-8 pt-6 border-t border-copper/20 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-copper block">Tactile Finish</span>
                    <span className="font-medium text-forest">Natural Beeswax & Air-Tumbled</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-copper block">Longevity</span>
                    <span className="font-medium text-forest">Heirloom Grade (Decades)</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: High-Impact Tactile Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-copper/25 shadow-md bg-sand/30">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeChapter.name}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: easeTactile }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={activeChapter.image}
                    alt={activeChapter.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-off-white/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-forest font-medium backdrop-blur-sm border border-copper/20">
                    {activeChapter.name} Material Archive
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
