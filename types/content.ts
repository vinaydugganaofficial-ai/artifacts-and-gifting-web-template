/** Editorial + marketing content model. */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  location: string;
};

export type MakingStep = {
  number: string;
  title: string;
  copy: string;
  image: string;
  imageAlt: string;
};

export type GalleryFrame = {
  src: string;
  alt: string;
  /** Tailwind grid placement for the masonry layout. */
  className: string;
};

export type Artisan = {
  slug: string;
  name: string;
  craft: string;
  region: string;
  yearsActive: number;
  portrait: string;
  portraitAlt: string;
  summary: string;
  /** Long-form paragraphs rendered in order. */
  story: string[];
  /** Product slugs attributed to this maker. */
  productSlugs: string[];
};

export type JournalEntry = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO-8601 date string. */
  publishedAt: string;
  readingMinutes: number;
  category: string;
  image: string;
  imageAlt: string;
  body: string[];
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export type PolicySection = {
  heading: string;
  body: string[];
};

export type Policy = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  /** ISO-8601 date string. */
  updatedAt: string;
  sections: PolicySection[];
};

export type ValueProp = {
  id: string;
  title: string;
  copy: string;
};
