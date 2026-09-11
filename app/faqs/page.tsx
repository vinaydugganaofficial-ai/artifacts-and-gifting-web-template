import type { Metadata } from "next";
import Link from "next/link";

import { listFaqGroups } from "@/lib/services/content.service";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/config/site";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Practical notes on caring for brass, lighting the lamps, what varies between pieces, and how orders are shipped.",
  alternates: { canonical: "/faqs" },
};

export default async function FaqsPage() {
  const groups = await listFaqGroups();

  /** FAQPage structured data, so answers can surface directly in search. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((group) =>
      group.items.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
        <div className={tokens.container}>
          <PageHeader
            eyebrow="Care & Gifting FAQs"
            title="Craft, provenance, and gifting questions."
            description="Brass darkens with natural patina. Devotional pieces may be worshipped or lived with. Gifting suites are packaged by hand in heritage paper. All answers gathered here."
          />

          <div className="mt-16 max-w-3xl space-y-14">
            {groups.map((group) => (
              <section key={group.category}>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-terracotta">
                  {group.category}
                </h2>

                <Accordion type="single" collapsible className="mt-6">
                  {group.items.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} tone="light">
                      <AccordionTrigger
                        tone="light"
                        className="text-sm normal-case tracking-normal"
                      >
                        <span className="font-display text-lg text-forest">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="max-w-[62ch] text-[15px] leading-relaxed text-deep-brown/80">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>

          <div className="mt-16 max-w-xl border-t border-deep-brown/15 pt-8">
            <p className="text-sm leading-relaxed text-deep-brown/70">
              Something not covered here?{" "}
              <Link href="/contact" className="link-underline font-medium text-forest hover:text-terracotta">
                Write to the Viraasat concierge
              </Link>{" "}
              — or email{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="link-underline font-medium text-forest hover:text-terracotta"
              >
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
