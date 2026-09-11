/** Catalog domain model. Framework-agnostic — no React or Next imports. */

export type ProductImage = {
  src: string;
  /** Always meaningful; decorative duplicates are filtered before render. */
  alt: string;
};

export type MaterialBackground = "stone" | "paper" | "sand" | "wood" | "textile";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  /**
   * Collections this piece appears in, most specific first. `collections[0]` is
   * the primary/owning collection.
   */
  collections: [string, ...string[]];
  collection?: string;
  description: string;
  /** Minor-unit-free integer amount in `siteConfig.commerce.currency`. */
  price: number;
  images: ProductImage[];
  featured: boolean;
  signature?: boolean;
  artisan?: string;
  origin?: string;
  material: string;
  dimensions?: string;
  weight?: string;
  inStock: boolean;
  giftingOccasions?: string[];
  giftable?: boolean;
  materialBg?: MaterialBackground;
  /** Free-text care guidance shown on the product page. */
  care?: string;
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  count: number;
};

export type ProductSort = "featured" | "price-asc" | "price-desc" | "name-asc";

export const PRODUCT_SORTS: readonly ProductSort[] = [
  "featured",
  "price-asc",
  "price-desc",
  "name-asc",
] as const;

export const PRODUCT_SORT_LABELS: Record<ProductSort, string> = {
  featured: "Curated",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
  "name-asc": "A – Z",
};

/** The owning collection slug for a product. */
export function primaryCollection(product: Product): string {
  return product.collection ?? product.collections[0];
}

export type ProductQuery = {
  /** Free-text search across name, category, collection and description. */
  q?: string;
  /** Collection slug filter. */
  collection?: string;
  occasion?: string;
  budget?: string;
  sort?: ProductSort;
  /** Hide out-of-stock pieces. */
  inStockOnly?: boolean;
  page?: number;
  perPage?: number;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
};
