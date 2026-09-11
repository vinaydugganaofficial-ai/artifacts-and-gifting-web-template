/**
 * Site-wide configuration for the contemporary Indian heritage artifacts & gifting house.
 */

export type NavLink = {
  href: string;
  label: string;
  hasMegaMenu?: boolean;
};

export type FooterLink = NavLink & {
  external?: boolean;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const siteConfig = {
  name: "Viraasat",
  wordmark: "VIRAASAT",
  tagline: "Made in India. Meant to be remembered.",
  description:
    "A contemporary Indian heritage gifting house. Handcrafted artifacts, brass sculptures, and heritage objects chosen for homes and meaningful moments.",
  locale: "en_IN",
  baseUrl,

  announcements: [
    "CRAFTED IN INDIA · CURATED FOR GIFTING",
    "FREE BESPOKE GIFT WRAPPING ON ALL ORDERS",
    "CURATED CORPORATE GIFTS · PAN-INDIA FULFILMENT",
  ],

  contact: {
    email: "concierge@viraasat.example",
    phone: "+91 11 4120 8800",
    addressLines: ["The Viraasat House", "Mehrauli Heritage Precinct", "New Delhi 110030, India"],
    hours: "Monday to Saturday, 10:00 – 19:00 IST",
  },

  commerce: {
    currency: "INR",
    priceLocale: "en-IN",
    maxQuantityPerItem: 10,
    featuredLimit: 8,
    relatedLimit: 4,
    shippingFlatRate: 350,
    freeShippingThreshold: 5000,
    recentOrderLimit: 3,
    maxAddresses: 6,
  },

  auth: {
    defaultCountryCode: "+91",
    countryCodes: [
      { code: "+91", label: "India (+91)" },
      { code: "+44", label: "United Kingdom (+44)" },
      { code: "+1", label: "United States / Canada (+1)" },
      { code: "+65", label: "Singapore (+65)" },
      { code: "+971", label: "United Arab Emirates (+971)" },
    ],
    otpLength: 6,
    otpTtlSeconds: 300,
    resendCooldownSeconds: 30,
    maxOtpAttempts: 5,
    maxOtpRequestsPerHour: 5,
  },
} as const;

export const navLinks: readonly NavLink[] = [
  { href: "/shop", label: "Shop" },
  { href: "/artifacts", label: "Artifacts" },
  { href: "/collections", label: "Collections" },
  { href: "/gifting", label: "Gifting", hasMegaMenu: true },
  { href: "/our-story", label: "Our Story" },
] as const;

export const giftingMegaMenuData = {
  byOccasion: [
    { label: "Corporate", href: "/gifting/corporate", desc: "Thoughtful objects for teams & clients" },
    { label: "Wedding", href: "/gifting/wedding", desc: "Enduring heirlooms for new beginnings" },
    { label: "Housewarming", href: "/gifting/housewarming", desc: "Auspicious craft to ground a home" },
    { label: "Festivals", href: "/gifting/festivals", desc: "Sacred forms to illuminate occasions" },
    { label: "Birthday", href: "/gifting/birthday", desc: "Distinctive handcrafted treasures" },
    { label: "Anniversary", href: "/gifting/anniversary", desc: "Time-tested craft for shared milestones" },
    { label: "Thank You", href: "/gifting/thank-you", desc: "Warm expressions of gratitude" },
  ],
  byBudget: [
    { label: "Under ₹500", href: "/shop?budget=under-500" },
    { label: "₹500 – ₹1,000", href: "/shop?budget=500-1000" },
    { label: "₹1,000 – ₹2,500", href: "/shop?budget=1000-2500" },
    { label: "₹2,500 – ₹5,000", href: "/shop?budget=2500-5000" },
    { label: "Premium Gifts (₹5,000+)", href: "/shop?budget=premium" },
  ],
  byType: [
    { label: "Brass Artifacts", href: "/shop?type=brass" },
    { label: "Figurines & Idols", href: "/shop?type=figurines" },
    { label: "Heritage Décor", href: "/shop?type=decor" },
    { label: "Curated Gift Sets", href: "/shop?type=gift-sets" },
    { label: "Collector's Pieces", href: "/shop?type=collectibles" },
  ],
  featured: {
    title: "The Festive Gifting Edit",
    subtitle: "Hand-finished brass urlis, chased deepams, and artisanal boxes.",
    href: "/collections/gifting-edit",
    image: "/images/collections/gifting.jpg",
  },
} as const;

export const accountNavLinks: readonly NavLink[] = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/coupons", label: "Coupons" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/account/settings", label: "Settings" },
] as const;

export const utilityLinks: readonly NavLink[] = [
  { href: "/account", label: "Account" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
] as const;

export const footerColumns: readonly FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Artifacts" },
      { href: "/shop?category=brass", label: "Brass" },
      { href: "/shop?category=decor", label: "Décor" },
      { href: "/shop?category=gift-sets", label: "Gift Sets" },
      { href: "/shop?sort=newest", label: "New Arrivals" },
    ],
  },
  {
    title: "Gifting",
    links: [
      { href: "/gifting/corporate", label: "Corporate" },
      { href: "/gifting/wedding", label: "Wedding" },
      { href: "/gifting/festivals", label: "Festivals" },
      { href: "/gifting/housewarming", label: "Housewarming" },
      { href: "/shop?filter=budget", label: "Gifts by Budget" },
    ],
  },
  {
    title: "Discover",
    links: [
      { href: "/collections", label: "Collections" },
      { href: "/our-story#craft", label: "Craft & Material" },
      { href: "/artisans", label: "Artisans" },
      { href: "/our-story", label: "Our Story" },
      { href: "/journal", label: "Journal" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/faqs", label: "FAQs" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

export const legalLinks: readonly NavLink[] = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
] as const;

export const searchSuggestions: readonly string[] = [
  "Brass Ganesha",
  "Corporate Gifts",
  "Wedding Gifts",
  "Home Décor",
  "Heritage Objects",
  "Gift Sets",
] as const;

export type SiteConfig = typeof siteConfig;
