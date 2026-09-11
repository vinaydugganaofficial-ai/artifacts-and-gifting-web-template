import { z } from "zod";

import { PRODUCT_SORTS } from "@/types/product";
import { siteConfig } from "@/config/site";

/**
 * Validation schemas shared by the browser client and the route handlers.
 *
 * Deliberately NOT server-only: the same schema validates a form before submit
 * and the request body after it, so the two can never disagree about what is
 * acceptable. The server always re-validates — client validation is a courtesy,
 * never a control.
 */

/* -------------------------------------------------------------------------- */
/* Query schemas                                                               */
/* -------------------------------------------------------------------------- */

const slug = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a lowercase hyphenated slug");

export const productListQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  collection: slug.optional(),
  sort: z.enum(PRODUCT_SORTS as unknown as [string, ...string[]]).optional(),
  inStockOnly: z
    .union([z.literal("true"), z.literal("false")])
    .transform((value) => value === "true")
    .optional(),
  page: z.coerce.number().int().min(1).max(1000).optional(),
  perPage: z.coerce.number().int().min(1).max(48).optional(),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().max(120).default(""),
  limit: z.coerce.number().int().min(1).max(20).optional(),
});

/** `?ids=a,b,c` — capped so one request cannot ask for an unbounded set. */
export const productIdsQuerySchema = z.object({
  ids: z
    .string()
    .trim()
    .min(1)
    .max(2000)
    .transform((value) =>
      value
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0 && id.length <= 80),
    )
    .pipe(z.array(z.string()).min(1).max(50)),
});

/* -------------------------------------------------------------------------- */
/* Body schemas                                                                */
/* -------------------------------------------------------------------------- */

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address.").max(200),
  /**
   * Honeypot. Real people never see this field; bots fill every input they find.
   *
   * Deliberately NOT rejected by the schema: a validation error naming this
   * field would tell a bot exactly which trap it hit. It is accepted here and
   * handled in the route, which answers as though the submission succeeded.
   */
  company: z.string().max(200).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please tell us your name.")
    .max(120, "That name is too long."),
  email: z.email("Enter a valid email address.").max(200),
  subject: z.enum(["commission", "provenance", "order", "other"], {
    error: "Choose what your message is about.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Please give us a little more detail (at least 20 characters).")
    .max(4000, "Please keep your message under 4000 characters."),
  /** Honeypot — see the note on newsletterSchema. */
  company: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Subject options rendered by the contact form. */
export const CONTACT_SUBJECTS = [
  { value: "commission", label: "A commission" },
  { value: "provenance", label: "Provenance or authenticity" },
  { value: "order", label: "An existing order" },
  { value: "other", label: "Something else" },
] as const;

/* -------------------------------------------------------------------------- */
/* Authentication — phone + one-time code                                      */
/* -------------------------------------------------------------------------- */

/**
 * A phone number as typed.
 *
 * Deliberately permissive here: the shape is only sanity-checked, and the route
 * normalises to E.164 with `normalizePhone`, which is the single authority on
 * what a valid number is.
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(6, "Enter your mobile number.")
  .max(20, "That number is too long.")
  .regex(/^[+0-9\s()\-.]+$/, "A number can only contain digits.");

export const otpPurposeSchema = z.enum(["sign-in", "sign-up"]);

export const otpRequestSchema = z
  .object({
    phone: phoneSchema,
    purpose: otpPurposeSchema,
    /** Required for sign-up, ignored for sign-in. */
    name: z.string().trim().max(120).optional(),
    /** Set when resending against a challenge already in flight. */
    previousChallengeId: z.string().trim().max(80).optional(),
    /** Honeypot — see the note on newsletterSchema. */
    company: z.string().max(200).optional(),
  })
  .refine((data) => data.purpose !== "sign-up" || (data.name?.trim().length ?? 0) >= 2, {
    error: "Please tell us your name.",
    path: ["name"],
  });

export type OtpRequestInput = z.infer<typeof otpRequestSchema>;

export const otpVerifySchema = z.object({
  challengeId: z.string().trim().min(1, "Ask for a code first.").max(80),
  code: z
    .string()
    .trim()
    // Spaces are stripped so a pasted "123 456" still validates.
    .transform((value) => value.replace(/\s/g, ""))
    .pipe(z.string().regex(/^\d{4,8}$/, "Enter the code from your message.")),
});

export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;

/** The sign-in form's first step. */
export const signInStartSchema = z.object({
  phone: phoneSchema,
});

export type SignInStartInput = z.infer<typeof signInStartSchema>;

/** The sign-up form's first step. */
export const signUpStartSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  phone: phoneSchema,
  marketingOptIn: z.boolean(),
});

export type SignUpStartInput = z.infer<typeof signUpStartSchema>;

/* -------------------------------------------------------------------------- */
/* Account                                                                     */
/* -------------------------------------------------------------------------- */

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  /** Optional contact address. The phone number is the identity, not this. */
  email: z.email("Enter a valid email address.").max(200).optional().or(z.literal("")),
  marketingOptIn: z.boolean(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const addressSchema = z.object({
  label: z.string().trim().min(1, "Give this address a name, e.g. Home.").max(40),
  recipient: z.string().trim().min(2, "Who should receive this?").max(120),
  phone: z.string().trim().min(6, "A contact number helps the courier.").max(40),
  line1: z.string().trim().min(4, "Enter the street address.").max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2, "Enter the city.").max(100),
  state: z.string().trim().min(2, "Enter the state or region.").max(100),
  postalCode: z.string().trim().min(3, "Enter the postal code.").max(20),
  country: z.string().trim().min(2, "Enter the country.").max(100),
  /** Required rather than defaulted: a `.default()` splits the schema's
   *  input and output types, which react-hook-form's resolver cannot reconcile. */
  isDefault: z.boolean(),
});

export type AddressFormInput = z.infer<typeof addressSchema>;

/* -------------------------------------------------------------------------- */
/* Checkout                                                                    */
/* -------------------------------------------------------------------------- */

export const couponCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Enter a code.")
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/, "Codes contain letters and numbers only."),
});

/** Cart contents as submitted for a price quote. */
export const cartItemsSchema = z
  .array(
    z.object({
      productId: z.string().trim().min(1).max(80),
      quantity: z.number().int().min(1).max(siteConfig.commerce.maxQuantityPerItem),
    }),
  )
  .max(50);

export const quoteSchema = z.object({
  items: cartItemsSchema,
  couponCode: z.string().trim().max(40).optional().or(z.literal("")),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

/**
 * Placing an order.
 *
 * Carries no money. Every figure is recomputed server-side from the catalog,
 * so a forged total is simply ignored.
 */
export const placeOrderSchema = z.object({
  /** Guests supply this; for a signed-in customer the session's number wins. */
  phone: phoneSchema,
  /** Optional written confirmation. */
  email: z.email("Enter a valid email address.").max(200).optional().or(z.literal("")),
  items: cartItemsSchema.min(1, "Your bag is empty."),
  couponCode: z.string().trim().max(40).optional().or(z.literal("")),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
  /** Either a saved address id, or the full address inline for guests. */
  addressId: z.string().trim().max(80).optional().or(z.literal("")),
  shippingAddress: addressSchema.omit({ label: true, isDefault: true }).optional(),
  /** Present only so the confirmation can name the method; never charged here. */
  paymentMethod: z.enum(["card", "upi", "bank_transfer", "cod"]),
  saveAddress: z.boolean(),
  /** Honeypot — see the note on newsletterSchema. */
  company: z.string().max(200).optional(),
});

export type PlaceOrderFormInput = z.infer<typeof placeOrderSchema>;

export const trackOrderSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .min(4, "Enter your order number.")
    .max(40)
    .regex(/^[A-Za-z0-9-]+$/, "Order numbers contain letters, numbers and dashes."),
  /** The number the order was placed with — proof of ownership. */
  phone: phoneSchema,
});

export type TrackOrderInput = z.infer<typeof trackOrderSchema>;

/** Payment methods offered at checkout. */
export const PAYMENT_METHODS = [
  {
    value: "card",
    label: "Card",
    detail: "Visa, Mastercard, Amex. A payment link is sent on confirmation.",
  },
  {
    value: "upi",
    label: "UPI",
    detail: "For delivery within India. A collect request is sent on confirmation.",
  },
  {
    value: "bank_transfer",
    label: "Bank transfer",
    detail: "Account details are sent with your invoice.",
  },
  {
    value: "cod",
    label: "Pay on delivery",
    detail: "Available within India on orders under ₹25,000.",
  },
] as const;
