import type { Metadata } from "next";

import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { getCurrentUser } from "@/lib/services/auth.service";
import { listAddresses } from "@/lib/services/account.service";
import { siteConfig } from "@/config/site";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order with the Viraasat gifting house and atelier.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  // Checkout is open to guests; signing in only pre-fills what we already know.
  const user = await getCurrentUser();
  const savedAddresses = user ? await listAddresses(user.id) : [];

  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/cart", label: "Cart" },
            { label: "Checkout" },
          ]}
        />

        <PageHeader
          className="mt-8"
          eyebrow="Checkout"
          title="Complete your order."
          description="Four short steps. Nothing is charged here — our concierge confirms availability and bespoke packaging, then sends a secure payment link or invoice."
        />

        <CheckoutClient
          user={user}
          savedAddresses={savedAddresses}
          defaultCountry="India"
          freeShippingThreshold={siteConfig.commerce.freeShippingThreshold}
        />
      </div>
    </section>
  );
}
