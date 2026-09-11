import type { Policy } from "@/types/content";
import { PageHeader } from "@/components/shared/PageHeader";
import { Prose } from "@/components/shared/Prose";
import { formatDate, toDateTimeAttribute, cn } from "@/lib/utils";
import { tokens } from "@/config/theme";

/**
 * Shared renderer for shipping, returns, privacy and terms.
 *
 * The four pages differ only in content, so they share one layout instead of
 * four near-identical files.
 */
export function PolicyPage({ policy }: { policy: Policy }) {
  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow={policy.eyebrow}
          title={policy.title}
          description={policy.intro}
        >
          <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-charcoal/40">
            Last updated{" "}
            <time dateTime={toDateTimeAttribute(policy.updatedAt)}>
              {formatDate(policy.updatedAt)}
            </time>
          </p>
        </PageHeader>

        <div className="mt-16 max-w-3xl space-y-14">
          {policy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl">{section.heading}</h2>
              <span className="mt-4 block h-px w-10 bg-gold" aria-hidden />
              <Prose paragraphs={section.body} className="mt-6" />
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
