"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { easeTactile } from "@/lib/motion";

export function Hero() {
  const reduce = useReducedMotion();
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    // Material depth: Restrained 4-8px shift
    setPointerOffset({
      x: Math.round(relativeX * 8),
      y: Math.round(relativeY * 8),
    });
  }

  function handlePointerLeave() {
    setPointerOffset({ x: 0, y: 0 });
  }

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative overflow-hidden bg-sand pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 border-b border-copper/15"
      aria-label="Editorial hero"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeTactile }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-6 bg-terracotta/60" />
              <p className="text-[11px] uppercase tracking-[0.32em] text-copper font-medium">
                OBJECTS WITH A STORY
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: easeTactile }}
              className="mt-5 font-display text-4xl leading-[1.12] sm:text-5xl lg:text-[3.6rem] text-forest font-normal tracking-tight"
            >
              Gifts That Carry India Forward.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: easeTactile }}
              className="mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-deep-brown/85 font-sans"
            >
              Thoughtfully crafted artifacts and heritage objects chosen for homes, celebrations, and meaningful moments. Each piece holds the weight of human hands and living traditions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: easeTactile }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2.5 bg-forest px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-off-white hover:bg-forest-light transition-all shadow-sm w-full sm:w-auto text-center"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/gifting"
                className="inline-flex items-center justify-center gap-2 border border-forest/30 bg-sand/60 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-forest hover:bg-off-white hover:border-forest transition-colors w-full sm:w-auto text-center"
              >
                <Compass className="size-3.5 text-terracotta" />
                <span>Explore Gifting</span>
              </Link>
            </motion.div>

            {/* Cultural Origin Marker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-12 pt-8 border-t border-copper/15 flex items-center gap-6 text-xs text-deep-brown/70"
            >
              <div>
                <span className="block font-display text-lg text-forest font-medium">Moradabad · Swamimalai · Jaipur</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-copper">Master Craft Ateliers</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Editorial Still-Life Image with Subtle Material Depth */}
          <div className="lg:col-span-6 xl:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: easeTactile }}
              className="relative mx-auto max-w-2xl lg:max-w-none"
            >
              {/* Background Sandstone Architectural Matting */}
              <div className="absolute -inset-3 sm:-inset-4 bg-off-white/60 border border-copper/20 -rotate-1 rounded-sm pointer-events-none" />

              {/* Main Image Frame with Material Shift */}
              <motion.div
                style={{
                  x: pointerOffset.x,
                  y: pointerOffset.y,
                }}
                transition={{ type: "spring", stiffness: 180, damping: 24 }}
                className="relative aspect-[4/3] w-full overflow-hidden shadow-lg border border-copper/25 bg-sand/30"
              >
                <Image
                  src="/images/hero-gifting.jpg"
                  alt="Editorial still life of Indian heritage gifting arrangement with antique brass Ganesha, handcrafted unbleached gift box with terracotta ribbon, and folded silk textile"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 680px"
                  className="object-cover"
                />

                {/* Subtle directional vignette simulating natural morning light */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/15 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              {/* Composition Break Overlay: Subtle Caption Tag */}
              <motion.div
                style={{
                  x: -pointerOffset.x * 0.7,
                  y: -pointerOffset.y * 0.7,
                }}
                transition={{ type: "spring", stiffness: 180, damping: 24 }}
                className="absolute -bottom-5 sm:-bottom-6 right-4 sm:right-8 bg-off-white p-4 sm:p-5 border border-copper/25 shadow-md max-w-[240px] hidden sm:block"
              >
                <p className="text-[9px] uppercase tracking-[0.24em] text-terracotta font-medium">
                  The Gifting Edit
                </p>
                <p className="mt-1 text-xs text-deep-brown/80 font-sans leading-snug">
                  Cast brass idols nestled with hand-block printed wraps and sacred deepams.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
