/**
 * Canonical design tokens for the Indian heritage artifacts and gifting storefront.
 *
 * This file is the SINGLE SOURCE OF TRUTH for the visual system. Tailwind v4
 * needs its tokens declared statically in CSS, so `app/globals.css` mirrors the
 * `palette`, `fonts` and `zIndex` values below inside its `@theme` block.
 *
 * `npm run check:theme` parses both files and fails the build if they drift.
 */

/* -------------------------------------------------------------------------- */
/* Palette                                                                     */
/* -------------------------------------------------------------------------- */

export const palette = {
  sand: "#e9ddc8",
  sandMuted: "#decdb4",
  forest: "#243a2d",
  forestDeep: "#1b2c22",
  forestLight: "#2f4a3b",
  terracotta: "#a94f35",
  terracottaDark: "#8e3f29",
  saffron: "#c58a3a",
  copper: "#8b6748",
  offWhite: "#f8f5ee",
  deepBrown: "#332a24",
  deepBrownMuted: "#4d4037",
  danger: "#a94f35",
  success: "#243a2d",
} as const;

export type PaletteToken = keyof typeof palette;

/* -------------------------------------------------------------------------- */
/* Typography                                                                  */
/* -------------------------------------------------------------------------- */

export const fonts = {
  /** Body / UI face. Bound to `--font-sans` by the root layout. */
  sans: {
    cssVariable: "--font-outfit",
    fallback: "system-ui, sans-serif",
  },
  /** Editorial display serif face. Bound to `--font-display`. */
  display: {
    cssVariable: "--font-cormorant",
    fallback: '"Times New Roman", Georgia, serif',
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Stacking order                                                              */
/* -------------------------------------------------------------------------- */

export const zIndex = {
  grain: 3,
  header: 50,
  overlay: 60,
  dialog: 61,
  toast: 70,
  cursor: 80,
  skipLink: 90,
} as const;

/* -------------------------------------------------------------------------- */
/* Motion                                                                      */
/* -------------------------------------------------------------------------- */

export const easing: Record<
  "tactile" | "entrance" | "exit",
  [number, number, number, number]
> = {
  tactile: [0.22, 1, 0.36, 1],
  entrance: [0.16, 1, 0.3, 1],
  exit: [0.4, 0, 1, 1],
};

export const easingCss = "cubic-bezier(0.22,1,0.36,1)";

export const duration = {
  instant: 0.15,
  fast: 0.3,
  base: 0.5,
  slow: 0.7,
  slowest: 0.9,
} as const;

/** Shared `whileInView` viewport config so reveals trigger quietly and once. */
export const revealViewport = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -6% 0px",
} as const;

/* -------------------------------------------------------------------------- */
/* Layout                                                                      */
/* -------------------------------------------------------------------------- */

export const layout = {
  maxWidth: 1440,
  header: {
    base: 80,
    condensed: 66,
  },
  scrollThreshold: 30,
  cursorMinWidth: 768,
} as const;

export const tokens = {
  container: "mx-auto w-full max-w-[1440px]",
  gutter: "px-5 md:px-8 lg:px-12",
  pageTop: "pt-28 md:pt-32",
  pageBottom: "pb-24 md:pb-28",
  sectionY: "py-20 md:py-28",
  productGrid: "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4",
  featuredGrid: "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4",
  eyebrow: "text-[11px] uppercase tracking-[0.28em] font-medium text-copper",
  label: "text-[10px] uppercase tracking-[0.2em]",
  hairline: "block h-px w-12 bg-terracotta/50",
} as const;

export const theme = {
  palette,
  fonts,
  zIndex,
  easing,
  easingCss,
  duration,
  revealViewport,
  layout,
  tokens,
} as const;

export type Theme = typeof theme;
