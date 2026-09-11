import "server-only";

import { addressRepository, orderRepository, userRepository } from "@/lib/repositories";
import { products } from "@/lib/data/products";
import { logger } from "@/lib/observability/logger";
import type { Address, UserRecord } from "@/types/account";
import type { Order, OrderLine, OrderStatus } from "@/types/order";

/**
 * Demo data for the in-memory stores.
 *
 * Runs once per server process from `instrumentation.ts`, so the account
 * section has a signed-in-able user with real orders to show rather than a set
 * of empty states.
 *
 * DISABLED IN PRODUCTION unless `SEED_DEMO_DATA=true` is set explicitly — a
 * known account with a known password must never appear on a live deployment
 * by accident.
 */

/**
 * The demo account's number.
 *
 * Signing in as this number issues a real one-time code; outside production the
 * code is returned in the response and written to the server log, so no SMS
 * provider is needed to try the flow.
 */
export const DEMO_PHONE = "+919820011223";
export const DEMO_EMAIL = "demo@aaranya.example";

function shouldSeed(): boolean {
  if (process.env.SEED_DEMO_DATA === "true") return true;
  if (process.env.SEED_DEMO_DATA === "false") return false;

  return process.env.NODE_ENV !== "production";
}

function lineFor(slug: string, quantity: number): OrderLine | null {
  const product = products.find((candidate) => candidate.slug === slug);
  if (!product) return null;

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0].src,
    imageAlt: product.images[0].alt,
    unitPrice: product.price,
    quantity,
    lineTotal: product.price * quantity,
  };
}

/** Days before now, as an ISO string. */
function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function daysAhead(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

/** Builds a plausible history ending at `status`. */
function historyFor(status: OrderStatus, placedAt: string) {
  const stages: OrderStatus[] = [
    "placed",
    "confirmed",
    "in_production",
    "shipped",
    "delivered",
  ];
  const endIndex = stages.indexOf(status);
  const placed = new Date(placedAt).getTime();

  if (endIndex === -1) {
    return [
      { status: "placed" as OrderStatus, at: placedAt, note: "Order received." },
      { status, at: new Date(placed + 86_400_000).toISOString() },
    ];
  }

  return stages.slice(0, endIndex + 1).map((stage, index) => ({
    status: stage,
    at: new Date(placed + index * 86_400_000 * 1.5).toISOString(),
  }));
}

let seeded = false;

export async function seedDemoData(): Promise<void> {
  if (seeded || !shouldSeed()) return;
  seeded = true;

  const existing = await userRepository.findByPhone(DEMO_PHONE);
  if (existing) return;

  const userId = "usr_demo_aaranya";

  const user: UserRecord = {
    id: userId,
    phone: DEMO_PHONE,
    name: "Ananya Mehra",
    email: DEMO_EMAIL,
    createdAt: daysAgo(240),
    marketingOptIn: true,
  };

  await userRepository.create(user);

  const addresses: Address[] = [
    {
      id: "adr_demo_home",
      userId,
      label: "Home",
      recipient: "Ananya Mehra",
      phone: "+91 98200 11223",
      line1: "14 Altamount Road",
      line2: "Apartment 9B",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400026",
      country: "India",
      isDefault: true,
    },
    {
      id: "adr_demo_studio",
      userId,
      label: "Studio",
      recipient: "Ananya Mehra",
      phone: "+91 98200 11223",
      line1: "Unit 4, Kamala Mills",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400013",
      country: "India",
      isDefault: false,
    },
  ];

  for (const address of addresses) await addressRepository.create(address);

  const shippingAddress = {
    recipient: addresses[0].recipient,
    phone: addresses[0].phone,
    line1: addresses[0].line1,
    line2: addresses[0].line2,
    city: addresses[0].city,
    state: addresses[0].state,
    postalCode: addresses[0].postalCode,
    country: addresses[0].country,
  };

  const drafts: Array<{
    orderNumber: string;
    status: OrderStatus;
    placedAt: string;
    items: Array<{ slug: string; quantity: number }>;
    couponCode?: string;
    discount: number;
    shipping: number;
    trackingNumber?: string;
    estimatedDelivery?: string;
  }> = [
    {
      orderNumber: "AAR-2026-K4T9M",
      status: "shipped",
      placedAt: daysAgo(6),
      items: [{ slug: "brass-deepalakshmi", quantity: 1 }],
      discount: 0,
      shipping: 450,
      trackingNumber: "BLR-4471-982",
      estimatedDelivery: daysAhead(3),
    },
    {
      orderNumber: "AAR-2026-H8P2Q",
      status: "in_production",
      placedAt: daysAgo(14),
      items: [
        { slug: "brass-nataraja", quantity: 1 },
        { slug: "handcrafted-brass-diya-set", quantity: 2 },
      ],
      couponCode: "ATELIER15",
      discount: 5160,
      shipping: 0,
      estimatedDelivery: daysAhead(21),
    },
    {
      orderNumber: "AAR-2025-R3W7B",
      status: "delivered",
      placedAt: daysAgo(96),
      items: [{ slug: "antique-brass-ganesha", quantity: 1 }],
      discount: 0,
      shipping: 0,
    },
  ];

  for (const draft of drafts) {
    const lines = draft.items
      .map((item) => lineFor(item.slug, item.quantity))
      .filter((line): line is OrderLine => line !== null);

    if (lines.length === 0) continue;

    const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);

    const order: Order = {
      id: `ord_demo_${draft.orderNumber}`,
      orderNumber: draft.orderNumber,
      userId,
      phone: DEMO_PHONE,
      email: DEMO_EMAIL,
      lines,
      totals: {
        subtotal,
        discount: draft.discount,
        shipping: draft.shipping,
        total: subtotal - draft.discount + draft.shipping,
      },
      couponCode: draft.couponCode,
      shippingAddress,
      status: draft.status,
      history: historyFor(draft.status, draft.placedAt),
      placedAt: draft.placedAt,
      trackingNumber: draft.trackingNumber,
      estimatedDelivery: draft.estimatedDelivery,
    };

    await orderRepository.create(order);
  }

  logger.info("Demo data seeded", {
    demoAccount: DEMO_PHONE,
    orders: drafts.length,
    addresses: addresses.length,
  });
}
