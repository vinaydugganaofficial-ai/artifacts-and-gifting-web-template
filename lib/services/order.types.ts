import type { OrderLine, OrderTotals } from "@/types/order";
import type { AppliedCoupon } from "@/types/coupon";

/**
 * Shapes shared between the order service and the browser client.
 *
 * Deliberately in their own module, without `server-only`: the client needs the
 * TYPES to describe an API response, but must never pull in the service that
 * produces them.
 */

export type CartItemInput = {
  productId: string;
  quantity: number;
};

/** A cart resolved against the catalog and priced. */
export type PricedCart = {
  lines: OrderLine[];
  totals: OrderTotals;
  coupon: AppliedCoupon | null;
  /** Set when a supplied coupon could not be applied. */
  couponError?: string;
  /** Ids that no longer resolve to a catalog product. */
  droppedProductIds: string[];
  /** Lines whose product is currently out of stock. */
  unavailableProductIds: string[];
};
