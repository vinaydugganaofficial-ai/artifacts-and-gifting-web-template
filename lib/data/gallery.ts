import type { GalleryFrame, ValueProp } from "@/types/content";

export const galleryFrames: GalleryFrame[] = [
  {
    src: "/images/brass-texture.jpg",
    alt: "Engraved antique brass surface in close detail",
    className: "md:col-span-4 md:row-span-2 min-h-[420px]",
  },
  {
    src: "/images/collections/craft.jpg",
    alt: "Artisan hands working brass with a hammer",
    className: "md:col-span-4 min-h-[200px]",
  },
  {
    src: "/images/making/cast.jpg",
    alt: "Molten brass poured in a foundry workshop",
    className: "md:col-span-4 min-h-[200px]",
  },
  {
    src: "/images/making/refine.jpg",
    alt: "Close-up of a brass sculpture being chased by hand",
    className: "md:col-span-5 min-h-[260px]",
  },
  {
    src: "/images/gallery/interior.jpg",
    alt: "Brass sculpture in a contemporary Indian interior",
    className: "md:col-span-7 min-h-[260px]",
  },
  {
    src: "/images/gallery/packaging.jpg",
    alt: "A brass piece wrapped in natural cloth and open wooden box",
    className: "md:col-span-12 min-h-[240px]",
  },
];

/** Scrolling marquee on the homepage. */
export const brandPromises: readonly string[] = [
  "Handcrafted",
  "Authentic",
  "Made in India",
  "Timeless",
  "Artisan-Made",
] as const;

/** The four commitments listed on the Our Story page. */
export const valueProps: ValueProp[] = [
  {
    id: "hand",
    title: "Finished by hand",
    copy: "Every piece is cast, chased and burnished by a named artisan. Machines assist; they do not decide.",
  },
  {
    id: "material",
    title: "Honest material",
    copy: "Solid brass, never plated over base metal. What darkens with age is the object itself.",
  },
  {
    id: "fair",
    title: "Paid at the workshop",
    copy: "We buy directly from family workshops in Moradabad, Swamimalai and Jaipur. No intermediaries set the price.",
  },
  {
    id: "kept",
    title: "Made to be kept",
    copy: "These objects are built for decades of use. Repair and re-finishing are offered for the life of the piece.",
  },
];
