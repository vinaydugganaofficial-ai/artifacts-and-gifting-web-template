import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import {
  getAllCollectionSlugs,
  getAllProductSlugs,
} from "@/lib/services/catalog.service";
import { getAllArtisanSlugs, listJournalEntries } from "@/lib/services/content.service";

/** Generated from the live catalog, so it cannot drift from what exists. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.baseUrl;
  const now = new Date();

  const [productSlugs, collectionSlugs, artisanSlugs, journalEntries] = await Promise.all(
    [
      getAllProductSlugs(),
      getAllCollectionSlugs(),
      getAllArtisanSlugs(),
      listJournalEntries(),
    ],
  );

  // Typed before the `.map`, otherwise `changeFrequency` widens to `string`
  // and no longer satisfies the union `MetadataRoute.Sitemap` expects.
  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: base, changeFrequency: "weekly", priority: 1 },
      { url: `${base}/shop`, changeFrequency: "weekly", priority: 0.9 },
      { url: `${base}/collections`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${base}/artisans`, changeFrequency: "monthly", priority: 0.7 },
      { url: `${base}/our-story`, changeFrequency: "yearly", priority: 0.6 },
      { url: `${base}/journal`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${base}/faqs`, changeFrequency: "monthly", priority: 0.5 },
      { url: `${base}/track-order`, changeFrequency: "yearly", priority: 0.5 },
      { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.5 },
      { url: `${base}/shipping`, changeFrequency: "yearly", priority: 0.4 },
      { url: `${base}/returns`, changeFrequency: "yearly", priority: 0.4 },
      { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
    ] satisfies MetadataRoute.Sitemap
  ).map((entry) => ({ ...entry, lastModified: now }));

  return [
    ...staticRoutes,
    ...productSlugs.map((slug) => ({
      url: `${base}/products/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...collectionSlugs.map((slug) => ({
      url: `${base}/collections/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...artisanSlugs.map((slug) => ({
      url: `${base}/artisans/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...journalEntries.map((entry) => ({
      url: `${base}/journal/${entry.slug}`,
      lastModified: new Date(entry.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
