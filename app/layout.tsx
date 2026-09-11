import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";

import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { Providers } from "@/components/shared/Providers";
import {
  footerColumns,
  legalLinks,
  navLinks,
  searchSuggestions,
  siteConfig,
  utilityLinks,
} from "@/config/site";
import { palette } from "@/config/theme";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.name} — Contemporary Indian Heritage & Gifting House`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.baseUrl,
    title: `${siteConfig.name} — Contemporary Indian Heritage & Gifting House`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Contemporary Indian Heritage & Gifting House`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: palette.sand,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="grain min-h-full bg-sand font-sans text-deep-brown selection:bg-terracotta selection:text-off-white">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-skip-link)] focus:bg-off-white focus:text-forest focus:px-4 focus:py-2 focus:shadow"
          >
            Skip to content
          </a>

          <AnnouncementBar />

          <Header
            wordmark={siteConfig.wordmark}
            navLinks={navLinks}
            utilityLinks={utilityLinks}
            searchSuggestions={searchSuggestions}
          />

          <main id="main" className="pt-20">
            {children}
          </main>

          <Footer
            tagline={siteConfig.tagline}
            siteName={siteConfig.name}
            columns={footerColumns}
            legalLinks={legalLinks}
            year={year}
          />
        </Providers>
      </body>
    </html>
  );
}
