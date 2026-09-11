import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

/**
 * Route-level loading fallback.
 *
 * Mirrors the interior page masthead so a navigation shows structure settling
 * into place rather than a blank screen.
 */
export default function Loading() {
  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={cn(tokens.container, "animate-pulse")}>
        <span className="sr-only" role="status">
          Loading
        </span>

        <div className="h-3 w-28 bg-charcoal/10" />
        <div className="mt-6 h-12 w-2/3 max-w-xl bg-charcoal/10" />
        <div className="mt-6 h-px w-16 bg-gold/40" />
        <div className="mt-6 space-y-2">
          <div className="h-3 w-full max-w-xl bg-charcoal/10" />
          <div className="h-3 w-3/4 max-w-lg bg-charcoal/10" />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-px bg-charcoal/10 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-[3/4] bg-charcoal/5" />
          ))}
        </div>
      </div>
    </section>
  );
}
