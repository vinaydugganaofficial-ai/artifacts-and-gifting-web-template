import type { Metadata } from "next";

import { WishlistView } from "@/components/products/WishlistView";
import { PageHeader } from "@/components/shared/PageHeader";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Pieces you have set aside.",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="Saved"
          title="Wishlist"
          description="Pieces you have set aside — kept in this browser until you are ready."
        />
        <WishlistView />
      </div>
    </section>
  );
}
