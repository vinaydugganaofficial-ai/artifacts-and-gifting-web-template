/**
 * Collection definitions for the Indian heritage artifacts & gifting house.
 */
export type CollectionSeed = {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  tagline?: string;
};

export const collections: CollectionSeed[] = [
  {
    slug: "brass-heritage",
    title: "Brass Heritage",
    description: "Traditional brass figurines and sacred objects cast with generational precision.",
    tagline: "Enduring forms, hand-finished by master casters.",
    image: "/images/collections/sacred.jpg",
    imageAlt: "A gathering of hand-finished brass heritage idols",
  },
  {
    slug: "living-india",
    title: "Living India",
    description: "Objects inspired by the warmth, courtyards, and everyday aesthetics of Indian homes.",
    tagline: "Urlis, deepams, and vessels that celebrate the rhythm of home.",
    image: "/images/collections/heritage.jpg",
    imageAlt: "Indian home décor objects on a warm stone surface",
  },
  {
    slug: "gifting-edit",
    title: "Gifting Edit",
    description: "Thoughtfully selected gifts for weddings, festivities, corporate milestones, and beginnings.",
    tagline: "Objects of weight and intention, chosen to be remembered.",
    image: "/images/collections/gifting.jpg",
    imageAlt: "Artisanal gift box with handwoven ribbon and brass token",
  },
  {
    slug: "collectors-shelf",
    title: "Collector's Shelf",
    description: "Distinctive, limited artifacts for connoisseurs who cherish rare human craftsmanship.",
    tagline: "Singular pieces with presence, sculpted in lost-wax bronze and brass.",
    image: "/images/collections/craft.jpg",
    imageAlt: "Rare hand-chased brass sculpture showing intricate chisel work",
  },
];
