import type { ShippingAddress } from "@/types/account";

/** Order domain model. */

export const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "in_production",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  in_production: "In the workshop",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  placed: "We have your order and are checking the piece is ready to leave.",
  confirmed: "Confirmed by the atelier and allocated to you.",
  in_production: "Being cast, chased or finished for your order.",
  shipped: "On its way, wrapped in cloth and board.",
  delivered: "Delivered. We hope it holds the room.",
  cancelled: "Cancelled. Nothing has been charged.",
};

/**
 * The sequence an order moves through. `cancelled` is deliberately absent —
 * it is an exit, not a stage, and the tracker renders it separately.
 */
export const ORDER_PROGRESSION: readonly OrderStatus[] = [
  "placed",
  "confirmed",
  "in_production",
  "shipped",
  "delivered",
] as const;

export type OrderStatusEvent = {
  status: OrderStatus;
  at: string;
  note?: string;
};

/**
 * A line as sold.
 *
 * Name and price are copied at purchase time rather than joined from the live
 * catalog, so a later price change or a withdrawn product cannot rewrite what
 * a customer actually paid.
 */
export type OrderLine = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

export type Order = {
  id: string;
  /** Human-facing reference, e.g. `AAR-2026-4F7K2`. */
  orderNumber: string;
  /** Absent for a guest order. */
  userId?: string;
  /** E.164. The identity an order is tracked by, for guests and members alike. */
  phone: string;
  /** Optional: used for a written confirmation when the customer gives one. */
  email?: string;
  lines: OrderLine[];
  totals: OrderTotals;
  couponCode?: string;
  shippingAddress: ShippingAddress;
  note?: string;
  status: OrderStatus;
  history: OrderStatusEvent[];
  placedAt: string;
  /** Set once shipped. */
  trackingNumber?: string;
  estimatedDelivery?: string;
};

/** The trimmed shape used in listings. */
export type OrderSummaryView = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  total: number;
  itemCount: number;
  /** First line's image, for the listing thumbnail. */
  previewImage: string;
  previewAlt: string;
};
