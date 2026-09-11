import { Hero } from "@/components/home/Hero";
import { OccasionGifting } from "@/components/home/OccasionGifting";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { CuratedArtifacts } from "@/components/home/CuratedArtifacts";
import { GiftGuide } from "@/components/home/GiftGuide";
import { MaterialStory } from "@/components/home/MaterialStory";
import { SignatureArtifacts } from "@/components/home/SignatureArtifacts";
import { CorporateGifting } from "@/components/home/CorporateGifting";
import { HeritageStoryDark } from "@/components/home/HeritageStoryDark";
import { CraftStories } from "@/components/home/CraftStories";
import { VisualGallery } from "@/components/home/VisualGallery";
import { Newsletter } from "@/components/home/Newsletter";

import { getFeaturedProducts, listCollections } from "@/lib/services/catalog.service";

/**
 * Contemporary Indian Heritage Artifacts & Gifting House Homepage.
 *
 * Implements the 14-section gifting-commerce hierarchy:
 * 1. Announcement Bar (layout)
 * 2. Header & Gifting Mega-Menu (layout)
 * 3. Editorial Still-Life Hero
 * 4. Shop by Gifting Occasion
 * 5. Featured Heritage Collections (Brass Heritage, Living India, Gifting Edit, Collector's Shelf)
 * 6. Curated Artifacts (Object Catalogue with material backgrounds)
 * 7. Gift Guide (Home, Occasion, Collector)
 * 8. Craft & Material Story (Brass, Wood, Stone, Textile)
 * 9. Signature Artifacts (Pieces With Presence)
 * 10. Corporate & Institutional Gifting
 * 11. Heritage Story ("India, In Objects.")
 * 12. Indian Craft Stories ("Meet the Hands Behind the Object")
 * 13. Visual Journal & Social Gallery ("A Little More India")
 * 14. Newsletter ("Discover Something Worth Keeping")
 */
export default async function HomePage() {
  const [featured, collections] = await Promise.all([
    getFeaturedProducts(8),
    listCollections(),
  ]);

  return (
    <>
      {/* 3. Editorial Hero with Material Depth */}
      <Hero />

      {/* 4. Shop by Gifting Occasion */}
      <OccasionGifting />

      {/* 5. Featured Heritage Collections */}
      <FeaturedCollections collections={collections} />

      {/* 6. Curated Artifacts in Object Catalogue Style */}
      <CuratedArtifacts products={featured} />

      {/* 7. Gift Guide Paths */}
      <GiftGuide />

      {/* 8. Craft & Material Chapters */}
      <MaterialStory />

      {/* 9. Signature Collectibles */}
      <SignatureArtifacts products={featured} />

      {/* 10. Corporate & Institutional Gifting */}
      <CorporateGifting />

      {/* 11. Dark Forest Green Heritage Story */}
      <HeritageStoryDark />

      {/* 12. Indian Maker Stories */}
      <CraftStories />

      {/* 13. Visual Journal & Editorial Gallery */}
      <VisualGallery />

      {/* 14. Correspondence & Newsletter */}
      <Newsletter />
    </>
  );
}
