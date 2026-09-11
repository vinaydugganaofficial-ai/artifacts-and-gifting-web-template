import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { siteConfig } from "@/config/site";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact & Concierge",
  description:
    "Write to the Viraasat gifting concierge and atelier about corporate orders, custom heirlooms, or artisanal curations.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="Gifting Concierge"
          title="Connect with Viraasat."
          description="For bespoke gifting suites, corporate curation, heirloom commissions, or questions about a particular craft piece — our concierge is at your service. We reply to all inquiries within one business day."
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-24">
          <ContactForm />

          <aside className="space-y-10 text-sm lg:pt-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-terracotta font-medium">
                The Atelier & Office
              </p>
              <address className="mt-3 not-italic leading-relaxed text-deep-brown/80">
                {siteConfig.contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-terracotta font-medium">
                Concierge Direct
              </p>
              <p className="mt-3 leading-relaxed text-deep-brown/80">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="link-underline block hover:text-terracotta"
                >
                  {siteConfig.contact.email}
                </a>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="link-underline mt-1 block hover:text-terracotta"
                >
                  {siteConfig.contact.phone}
                </a>
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-terracotta font-medium">
                Concierge Hours
              </p>
              <p className="mt-3 leading-relaxed text-deep-brown/80">
                {siteConfig.contact.hours}
              </p>
            </div>

            <div className="border-t border-deep-brown/15 pt-8">
              <p className="text-[10px] uppercase tracking-[0.22em] text-terracotta font-medium">
                Frequently Asked Questions
              </p>
              <p className="mt-3 leading-relaxed text-deep-brown/70">
                Questions about care, patina, custom gift wrapping, corporate tiers, and shipping are answered on our{" "}
                <a href="/faqs" className="link-underline font-medium text-forest hover:text-terracotta">
                  FAQs page
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
