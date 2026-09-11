import type { Metadata } from "next";

import { CartView } from "@/components/products/CartView";
import { PageHeader } from "@/components/shared/PageHeader";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cart",
  description: "The pieces you have set aside.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="Order Selection"
          title="Your Cart"
          description="Review your selected heirlooms and gifting suites. Complimentary bespoke packaging and calligraphy gift cards are included with every order."
        />
        <CartView />
      </div>
    </section>
  );
}
