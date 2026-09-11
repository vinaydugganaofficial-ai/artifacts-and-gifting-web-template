"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Award } from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

type ArtisanProfile = {
  name: string;
  location: string;
  craft: string;
  experience: string;
  story: string;
  image: string;
  imageAlt: string;
};

const makers: ArtisanProfile[] = [
  {
    name: "Imran Ali & Family",
    location: "Moradabad, Uttar Pradesh",
    craft: "Solid Brass Casting & Patina Work",
    experience: "28 Years Experience · 4th Generation",
    story:
      "Generations of metalworking knowledge poured into every cast figure. Imran's foundry uses lost-wax moulds and natural beeswax buffing, treating brass as a material that breathes and deepens with time.",
    image: "/images/artisan-portrait.jpg",
    imageAlt: "Master brass caster Imran Ali at the workbench in Moradabad",
  },
  {
    name: "Suresh Achari",
    location: "Swamimalai, Tamil Nadu",
    craft: "Lost-Wax Bronze & Brass Iconography",
    experience: "34 Years Experience · Master Sculptor",
    story:
      "Upholding the sacred proportions of the ancient Shilpa Shastras. Suresh hand-chisels facial expressions, crown filigree, and aureoles with patience, ensuring no two pieces share identical character.",
    image: "/images/making/refine.jpg",
    imageAlt: "Artisan carving fine ornamental details into a sacred brass sculpture",
  },
  {
    name: "Vikram Singh",
    location: "Jaipur, Rajasthan",
    craft: "Bell Metal & Sandstone Chasing",
    experience: "22 Years Experience · Guild Elder",
    story:
      "Specialising in hand-turned resonant bells and ceremonial urlis. Each bell's pure chime is tuned by varying the metal thickness along the rim, continuing Rajasthan's proud foundry legacy.",
    image: "/images/making/finish.jpg",
    imageAlt: "Craftsman hand-burnishing and finishing a traditional temple bell",
  },
];

export function CraftStories() {
  return (
    <section className="bg-sand py-20 md:py-28 border-b border-copper/15" aria-label="Meet the Makers">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
            <SectionHeading
              eyebrow="Generational Lineage"
              title="Meet the Hands Behind the Object."
              description="Every scratch, chasing mark, and balanced curve on our artifacts was placed there by a human hand. We partner directly with master craftspeople across historic metalworking clusters."
            />
            <Link
              href="/artisans"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-forest hover:text-terracotta transition-colors self-start md:self-end"
            >
              <span>Discover the Makers</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </Reveal>

        {/* Maker Profile Cards */}
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
          {makers.map((maker, index) => (
            <Reveal key={maker.name} delay={index * 0.08}>
              <div className="flex flex-col bg-off-white border border-copper/20 overflow-hidden shadow-sm">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/30">
                  <Image
                    src={maker.image}
                    alt={maker.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute bottom-3 left-3 bg-forest/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-sand font-medium backdrop-blur-sm">
                    {maker.craft}
                  </div>
                </div>

                <div className="p-6 flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-copper font-medium">
                      <MapPin className="size-3 shrink-0" />
                      <span>{maker.location}</span>
                    </div>

                    <h3 className="mt-2 font-display text-2xl font-normal text-forest">
                      {maker.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-terracotta font-medium">
                      <Award className="size-3 shrink-0" />
                      <span>{maker.experience}</span>
                    </div>

                    <p className="mt-4 text-xs sm:text-[13px] leading-relaxed text-deep-brown/80 font-sans">
                      {maker.story}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-copper/15">
                    <Link
                      href="/artisans"
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-medium text-forest hover:text-terracotta transition-colors"
                    >
                      <span>Read Full Artisan Story</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export const ArtisanStory = CraftStories;
