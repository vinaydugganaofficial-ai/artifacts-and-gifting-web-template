import "server-only";

import {
  artisanRepository,
  faqRepository,
  journalRepository,
  policyRepository,
  productRepository,
} from "@/lib/repositories";
import type { Artisan, Faq, JournalEntry, Policy } from "@/types/content";
import type { Product } from "@/types/product";

/** Editorial content reads, plus the joins between content and the catalog. */

/* -------------------------------------------------------------------------- */
/* Artisans                                                                    */
/* -------------------------------------------------------------------------- */

export async function listArtisans(): Promise<Artisan[]> {
  return artisanRepository.list();
}

export type ArtisanPage = {
  artisan: Artisan;
  /** Pieces attributed to this maker, resolved from the live catalog. */
  products: Product[];
};

export async function getArtisanPage(slug: string): Promise<ArtisanPage | null> {
  const artisan = await artisanRepository.findBySlug(slug);
  if (!artisan) return null;

  const all = await productRepository.list();
  const bySlug = new Map(all.map((product) => [product.slug, product]));

  const products = artisan.productSlugs
    .map((productSlug) => bySlug.get(productSlug))
    .filter((product): product is Product => product !== undefined);

  return { artisan, products };
}

export async function getAllArtisanSlugs(): Promise<string[]> {
  const all = await artisanRepository.list();
  return all.map((artisan) => artisan.slug);
}

/* -------------------------------------------------------------------------- */
/* Journal                                                                     */
/* -------------------------------------------------------------------------- */

export async function listJournalEntries(): Promise<JournalEntry[]> {
  return journalRepository.list();
}

export type JournalPage = {
  entry: JournalEntry;
  /** Up to two further reads, newest first, excluding the current entry. */
  more: JournalEntry[];
};

export async function getJournalPage(slug: string): Promise<JournalPage | null> {
  const entry = await journalRepository.findBySlug(slug);
  if (!entry) return null;

  const all = await journalRepository.list();
  const more = all.filter((candidate) => candidate.slug !== slug).slice(0, 2);

  return { entry, more };
}

export async function getAllJournalSlugs(): Promise<string[]> {
  const all = await journalRepository.list();
  return all.map((entry) => entry.slug);
}

/* -------------------------------------------------------------------------- */
/* FAQs                                                                        */
/* -------------------------------------------------------------------------- */

export type FaqGroup = {
  category: string;
  items: Faq[];
};

/** FAQs grouped by category, preserving the authored order within each group. */
export async function listFaqGroups(): Promise<FaqGroup[]> {
  const all = await faqRepository.list();
  const groups = new Map<string, Faq[]>();

  for (const faq of all) {
    const existing = groups.get(faq.category);
    if (existing) existing.push(faq);
    else groups.set(faq.category, [faq]);
  }

  return [...groups.entries()].map(([category, items]) => ({ category, items }));
}

/* -------------------------------------------------------------------------- */
/* Policies                                                                    */
/* -------------------------------------------------------------------------- */

export async function getPolicy(slug: string): Promise<Policy | null> {
  return policyRepository.findBySlug(slug);
}
