"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { easeTactile, fadeUp, revealViewport } from "@/lib/motion";
import { duration } from "@/config/theme";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Scroll-triggered soft fade-and-rise. Renders immediately under reduced motion. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      transition={{ duration: duration.slow, ease: easeTactile, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Subtle terracotta accent line that resolves quietly when in view. */
export function AccentLine({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      aria-hidden
      className={cn("block h-px origin-left bg-terracotta/40", className)}
      initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={revealViewport}
      transition={{ duration: reduce ? 0 : duration.base, ease: easeTactile }}
    />
  );
}

/** Backward compatibility alias for GoldLine */
export const GoldLine = AccentLine;
