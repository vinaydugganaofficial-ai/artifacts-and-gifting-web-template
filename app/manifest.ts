import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { palette } from "@/config/theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Contemporary Indian Heritage & Gifting House`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: palette.sand,
    theme_color: palette.sand,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
