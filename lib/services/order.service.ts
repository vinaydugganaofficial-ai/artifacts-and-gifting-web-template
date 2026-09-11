import "server-only";

import { orderRepository, productRepository } from "@/lib/repositories";
import { applyCouponCode } from "@/lib/services/coupon.service";
import { siteConfig } from "@/config/site";
import { logger } from "@/lib/observability/logger";
import type { ShippingAddress } from "@/types/account";
import type { Order, OrderLine, OrderStatus, OrderSummaryView } from "@/types/order";
import type { AppliedCoupon } from "@/types/coupon";
import type { CartItemInput, PricedCart } from "@/lib/services/order.types";

export type { CartItemInput, PricedCart };

/**
 * Order pricing and placement.
 *
 * PRICING IS ALWAYS SERVER-SIDE. The client submits product ids, quantities and
 * (optionally) a coupon code — never money. Every figure below is recomputed
 * from the catalog, so a tampered cart or a forged total changes nothing.
 */

const ORDER_NUMBER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Ambiguous characters (0/O, 1/I) are excluded so a number can be read aloud. */
function generateOrderNumber(now = new Date()): string {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(5));
  const suffix = Array.from(
    bytes,
    (byte) => ORDER_NUMBER_ALPHABET[byte % ORDER_NUMBER_ALPHABET.length],
  ).join("");

  return `AAR-${now.getFullYear()}-${suffix}`;
}

/**
 * Resolves, validates and prices a cart.
 *
 * Shared by the checkout preview and by order placement, so the quote a
 * customer sees is produced by exactly the code that charges them.
 */
export async function priceCart(
  items: readonly CartItemInput[],
  options: { couponCode?: string; signedIn: boolean },
): Promise<PricedCart> {
  const wanted = items.filter((item) => item.quantity > 0);
  const products = await productRepository.findManyByIds(
    wanted.map((item) => item.productId),
  );
  const byId = new Map(products.map((product) => [product.id, product]));

  const lines: OrderLine[] = [];
  const droppedProductIds: string[] = [];
  const unavailableProductIds: string[] = [];

  for (const item of wanted) {
    const product = byId.get(item.productId);

    if (!product) {
      droppedProductIds.push(item.productId);
      continue;
    }

    if (!product.inStock) unavailableProductIds.push(product.id);

    const quantity = Math.min(
      siteConfig.commerce.maxQuantityPerItem,
      Math.max(1, Math.trunc(item.quantity)),
    );

    lines.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0].src,
      imageAlt: product.images[0].alt,
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    });
  }

  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);

  let coupon: AppliedCoupon | null = null;
  let couponError: string | undefined;

  if (options.couponCode) {
    const evaluation = await applyCouponCode(options.couponCode, {
      subtotal,
      signedIn: options.signedIn,
    });

    if (evaluation.ok) coupon = evaluation.applied;
    else couponError = evaluation.reason;
  }

  const discount = coupon?.discount ?? 0;
  const shipping = calculateShipping(subtotal, coupon);

  return {
    lines,
    totals: {
      subtotal,
      discount,
      shipping,
      total: Math.max(0, subtotal - discount + shipping),
    },
    coupon,
    couponError,
    droppedProductIds,
    unavailableProductIds,
  };
}

/** Flat rate, waived above a threshold or by a free-shipping coupon. */
export function calculateShipping(
  subtotal: number,
  coupon: AppliedCoupon | null,
): number {
  if (subtotal === 0) return 0;
  if (coupon?.freeShipping) return 0;
  if (subtotal >= siteConfig.commerce.freeShippingThreshold) return 0;

  return siteConfig.commerce.shippingFlatRate;
}

export type PlaceOrderInput = {
  items: readonly CartItemInput[];
  /** E.164. The identity the order is tracked by. */
  phone: string;
  /** Optional written confirmation. */
  email?: string;
  shippingAddress: ShippingAddress;
  note?: string;
  couponCode?: string;
  userId?: string;
};

export type PlaceOrderResult = { ok: true; order: Order } | { ok: false; reason: string };

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const priced = await priceCart(input.items, {
    couponCode: input.couponCode,
    signedIn: Boolean(input.userId),
  });

  if (priced.lines.length === 0) {
    return {
      ok: false,
      reason:
        "None of the pieces in your bag are still available. Please refresh and try again.",
    };
  }

  if (priced.unavailableProductIds.length > 0) {
    return {
      ok: false,
      reason:
        "A piece in your bag has just sold. Remove it from your bag and place the order again.",
    };
  }

  // A coupon that fails at placement must stop the order rather than silently
  // charge the undiscounted total.
  if (input.couponCode && priced.couponError) {
    return { ok: false, reason: priced.couponError };
  }

  const now = new Date();
  const placedAt = now.toISOString();

  const order: Order = {
    id: `ord_${globalThis.crypto.randomUUID()}`,
    orderNumber: generateOrderNumber(now),
    userId: input.userId,
    phone: input.phone,
    email: input.email?.trim().toLowerCase() || undefined,
    lines: priced.lines,
    totals: priced.totals,
    couponCode: priced.coupon?.code,
    shippingAddress: input.shippingAddress,
    note: input.note?.trim() || undefined,
    status: "placed",
    history: [
      {
        status: "placed",
        at: placedAt,
        note: "Order received. The atelier has been notified.",
      },
    ],
    placedAt,
    estimatedDelivery: estimateDelivery(now, input.shippingAddress.country),
  };

  await orderRepository.create(order);

  logger.info("Order placed", {
    orderId: order.id,
    orderNumber: order.orderNumber,
    userId: input.userId ?? "guest",
    lineCount: order.lines.length,
    total: order.totals.total,
    coupon: order.couponCode,
  });

  return { ok: true, order };
}

/** Working-day estimate, matching the windows quoted on the shipping page. */
function estimateDelivery(from: Date, country: string): string {
  const domestic = country.trim().toLowerCase() === "india";
  const days = domestic ? 6 : 18;
  const estimate = new Date(from);
  estimate.setDate(estimate.getDate() + days);

  return estimate.toISOString();
}

/* -------------------------------------------------------------------------- */
/* Reads                                                                       */
/* -------------------------------------------------------------------------- */

export function toSummaryView(order: Order): OrderSummaryView {
  const first = order.lines[0];

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    placedAt: order.placedAt,
    total: order.totals.total,
    itemCount: order.lines.reduce((count, line) => count + line.quantity, 0),
    previewImage: first?.image ?? "/images/brass-texture.jpg",
    previewAlt: first?.imageAlt ?? "",
  };
}

export async function listOrdersForUser(userId: string): Promise<OrderSummaryView[]> {
  const orders = await orderRepository.listForUser(userId);
  return orders.map(toSummaryView);
}

export async function getRecentOrdersForUser(
  userId: string,
  limit = 3,
): Promise<OrderSummaryView[]> {
  const orders = await listOrdersForUser(userId);
  return orders.slice(0, Math.max(0, limit));
}

/**
 * A single order, gated on ownership.
 *
 * Returns null rather than the order when it belongs to someone else, so an
 * enumerated id leaks nothing — not even whether that order exists.
 */
export async function getOrderForUser(
  orderNumber: string,
  userId: string,
): Promise<Order | null> {
  const order = await orderRepository.findByNumber(orderNumber);
  if (!order || order.userId !== userId) return null;

  return order;
}

/**
 * Public order tracking.
 *
 * Requires the order number AND the phone number it was placed with, so
 * knowing an order number alone is not enough to read someone else's delivery
 * details.
 */
export async function trackOrder(
  orderNumber: string,
  phone: string,
): Promise<Order | null> {
  const order = await orderRepository.findByNumber(orderNumber);
  if (!order) return null;

  if (order.phone !== phone.trim()) return null;

  return order;
}

/** Advances an order's status and appends to its history. */
export async function advanceOrderStatus(
  orderNumber: string,
  status: OrderStatus,
  note?: string,
): Promise<Order | null> {
  const order = await orderRepository.findByNumber(orderNumber);
  if (!order) return null;

  const updated: Order = {
    ...order,
    status,
    history: [...order.history, { status, at: new Date().toISOString(), note }],
  };

  await orderRepository.update(updated);
  return updated;
}
