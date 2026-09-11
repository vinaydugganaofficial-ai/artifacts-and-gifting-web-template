import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Currency formatter.
 *
 * `Intl.NumberFormat` construction is comparatively expensive, so the formatter
 * is built once at module load and reused for every call — this runs on every
 * product card, on every render.
 */
const priceFormatter = new Intl.NumberFormat(siteConfig.commerce.priceLocale, {
  style: "currency",
  currency: siteConfig.commerce.currency,
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * Formats an ISO date string. Returns an empty string for unparseable input so
 * bad content can never render "Invalid Date" to a visitor.
 */
export function formatDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return dateFormatter.format(parsed);
}

/** `formatDate`'s companion for the `<time dateTime>` attribute. */
export function toDateTimeAttribute(iso: string): string | undefined {
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? undefined : iso;
}

/** Zero-padded index for editorial counters, e.g. `01 — 03`. */
export function padCount(value: number): string {
  return String(value).padStart(2, "0");
}
