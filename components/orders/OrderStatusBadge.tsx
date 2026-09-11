import type { OrderStatus } from "@/types/order";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { cn } from "@/lib/utils";

/** Each status gets its own treatment so the state is readable at a glance. */
const toneFor: Record<OrderStatus, string> = {
  placed: "bg-charcoal/8 text-charcoal/70",
  confirmed: "bg-gold/15 text-gold-muted",
  in_production: "bg-gold/20 text-gold-muted",
  shipped: "bg-charcoal text-ivory",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-danger/12 text-danger",
};

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.24em]",
        toneFor[status],
        className,
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
