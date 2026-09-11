import type { OrderStatus } from "@/types/order";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { cn } from "@/lib/utils";

/** Each status gets its own treatment so the state is readable at a glance. */
const toneFor: Record<OrderStatus, string> = {
  placed: "bg-sand text-deep-brown",
  confirmed: "bg-terracotta/15 text-terracotta",
  in_production: "bg-terracotta/20 text-terracotta",
  shipped: "bg-forest text-off-white",
  delivered: "bg-forest/15 text-forest",
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
