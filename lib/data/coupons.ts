import type { Coupon } from "@/types/coupon";

/**
 * Coupon seed data.
 *
 * Dates are far enough out that the template demonstrates live offers rather
 * than a page of expired ones. `EXPIRED10` is deliberately in the past so the
 * expiry path is visible and testable.
 */
export const coupons: Coupon[] = [
  {
    code: "WELCOME10",
    title: "10% on your first order",
    description:
      "Ten percent off any order over ₹5,000. Our thanks for looking at the collection.",
    kind: "percentage",
    value: 10,
    minSubtotal: 5000,
    maxDiscount: 5000,
    expiresAt: "2027-03-31T23:59:59.000Z",
    membersOnly: false,
    active: true,
  },
  {
    code: "ATELIER15",
    title: "15% for members",
    description:
      "Fifteen percent off orders over ₹20,000, for signed-in customers. Capped at ₹6,000.",
    kind: "percentage",
    value: 15,
    minSubtotal: 20000,
    maxDiscount: 6000,
    expiresAt: "2027-06-30T23:59:59.000Z",
    membersOnly: true,
    active: true,
  },
  {
    code: "DIYA500",
    title: "₹500 off lamps and smaller pieces",
    description: "A flat ₹500 off any order over ₹4,000.",
    kind: "fixed",
    value: 500,
    minSubtotal: 4000,
    maxDiscount: 0,
    expiresAt: "2027-01-31T23:59:59.000Z",
    membersOnly: false,
    active: true,
  },
  {
    code: "FREIGHTFREE",
    title: "Delivery on us",
    description: "Waives the delivery charge on orders over ₹10,000, anywhere we ship.",
    kind: "free_shipping",
    value: 0,
    minSubtotal: 10000,
    maxDiscount: 0,
    expiresAt: "2027-12-31T23:59:59.000Z",
    membersOnly: false,
    active: true,
  },
  {
    code: "EXPIRED10",
    title: "Diwali 2025",
    description: "Last season's offer, kept here so the expiry path stays visible.",
    kind: "percentage",
    value: 10,
    minSubtotal: 0,
    maxDiscount: 0,
    expiresAt: "2025-11-30T23:59:59.000Z",
    membersOnly: false,
    active: true,
  },
];
