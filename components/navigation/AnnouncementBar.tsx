"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const announcements = siteConfig.announcements;

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="relative z-[55] h-8 w-full border-b border-forest/15 bg-forest text-sand">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-8 text-[10px] tracking-[0.24em] uppercase">
        <span className="hidden sm:inline text-sand/70 font-sans">
          EST. NEW DELHI
        </span>

        <div className="relative flex h-full flex-1 items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center font-sans tracking-[0.22em] text-off-white"
            >
              {announcements[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <span className="hidden sm:inline text-sand/70 font-sans">
          PAN-INDIA SHIPPING
        </span>
      </div>
    </div>
  );
}
