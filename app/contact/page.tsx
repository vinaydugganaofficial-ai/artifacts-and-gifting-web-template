import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { siteConfig } from "@/config/site";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to the Aaranya atelier about a commission, a piece's provenance, or an existing order.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="The House"
          title="Write to us."
          description="For commissions, provenance, or a question about a particular piece — correspondence is welcome. We reply to everything, usually within two working days."
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-24">
          <ContactForm />

          <aside className="space-y-10 text-sm lg:pt-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/40">
                The atelier
              </p>
              <address className="mt-3 not-italic leading-relaxed text-charcoal/70">
                {siteConfig.contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/40">
                Direct
              </p>
              <p className="mt-3 leading-relaxed text-charcoal/70">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="link-underline block"
                >
                  {siteConfig.contact.email}
                </a>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="link-underline mt-1 block"
                >
                  {siteConfig.contact.phone}
                </a>
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/40">
                Hours
              </p>
              <p className="mt-3 leading-relaxed text-charcoal/70">
                {siteConfig.contact.hours}
              </p>
            </div>

            <div className="border-t border-charcoal/10 pt-8">
              <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/40">
                Before you write
              </p>
              <p className="mt-3 leading-relaxed text-charcoal/60">
                Questions about care, patina, shipping and returns are answered on the{" "}
                <a href="/faqs" className="link-underline text-charcoal/80">
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
