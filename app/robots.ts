import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Personal or transient routes: nothing here belongs in an index, and
        // crawling them wastes budget that should go to the catalog.
        disallow: [
          "/api/",
          "/cart",
          "/checkout",
          "/wishlist",
          "/account",
          "/search",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
    host: siteConfig.baseUrl,
  };
}
