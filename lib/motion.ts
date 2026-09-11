import type { Variants } from "framer-motion";

import { duration, easing, revealViewport as viewport } from "@/config/theme";

/**
 * Shared Framer Motion variants.
 * Follows the tactile, restrained motion philosophy:
 * feels like paper turning, fabric shifting, object uncovering.
 * No bouncy, elastic, or excessive movement.
 */

export const easeTactile = easing.tactile;
export const easeLuxury = easing.tactile; // compatibility alias

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easing.tactile },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.base, ease: easing.tactile },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

export const revealViewport = viewport;
