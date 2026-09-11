import type { OrderStatus, OrderStatusEvent } from "@/types/order";
import {
  ORDER_PROGRESSION,
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUS_LABELS,
} from "@/types/order";
import { formatDate, toDateTimeAttribute, cn } from "@/lib/utils";

type OrderTimelineProps = {
  status: OrderStatus;
  history: readonly OrderStatusEvent[];
  className?: string;
};

/**
 * Progress tracker.
 *
 * Renders the full journey with completed stages marked, rather than only what
 * has happened — so a customer can see what is still to come.
 */
export function OrderTimeline({ status, history, className }: OrderTimelineProps) {
  const reachedAt = new Map(history.map((event) => [event.status, event.at]));

  if (status === "cancelled") {
    const cancelledAt = reachedAt.get("cancelled");

    return (
      <div className={cn("border border-danger/30 bg-danger/5 p-6", className)}>
        <p className="text-[11px] uppercase tracking-[0.24em] text-danger">Cancelled</p>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
          {ORDER_STATUS_DESCRIPTIONS.cancelled}
        </p>
        {cancelledAt ? (
          <p className="mt-2 text-xs text-charcoal/45">
            <time dateTime={toDateTimeAttribute(cancelledAt)}>
              {formatDate(cancelledAt)}
            </time>
          </p>
        ) : null}
      </div>
    );
  }

  const currentIndex = ORDER_PROGRESSION.indexOf(status);

  return (
    <ol className={cn("space-y-0", className)}>
      {ORDER_PROGRESSION.map((stage, index) => {
        const done = index <= currentIndex;
        const current = index === currentIndex;
        const at = reachedAt.get(stage);
        const last = index === ORDER_PROGRESSION.length - 1;

        return (
          <li key={stage} className="relative flex gap-5 pb-8 last:pb-0">
            {/* Connector, drawn behind the markers. */}
            {!last ? (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[7px] top-4 h-full w-px",
                  index < currentIndex ? "bg-gold" : "bg-charcoal/12",
                )}
              />
            ) : null}

            <span
              aria-hidden
              className={cn(
                "relative mt-1 size-[15px] shrink-0 rounded-full border-2",
                done ? "border-gold bg-gold" : "border-charcoal/20 bg-ivory",
                current && "ring-4 ring-gold/20",
              )}
            />

            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-[11px] uppercase tracking-[0.24em]",
                  done ? "text-charcoal" : "text-charcoal/35",
                )}
              >
                {ORDER_STATUS_LABELS[stage]}
              </p>

              <p
                className={cn(
                  "mt-2 max-w-md text-sm leading-relaxed",
                  done ? "text-charcoal/65" : "text-charcoal/35",
                )}
              >
                {ORDER_STATUS_DESCRIPTIONS[stage]}
              </p>

              {at ? (
                <p className="mt-2 text-xs text-charcoal/45">
                  <time dateTime={toDateTimeAttribute(at)}>{formatDate(at)}</time>
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
