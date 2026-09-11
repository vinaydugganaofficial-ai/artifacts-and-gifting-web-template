import "server-only";

import { collectionRepository, productRepository } from "@/lib/repositories";
import { siteConfig } from "@/config/site";
import type {
  Collection,
  Paginated,
  Product,
  ProductQuery,
  ProductSort,
} from "@/types/product";

/**
 * Catalog business logic.
 *
 * Server Components call these functions directly; route handlers call the same
 * functions and wrap the result in the HTTP envelope. There is exactly one
 * implementation of every rule, shared by both entry points.
 */

export const DEFAULT_PER_PAGE = 12;
const MAX_PER_PAGE = 48;
const MAX_SEARCH_RESULTS = 8;

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                            */
/* -------------------------------------------------------------------------- */

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Relevance score for a free-text query. Higher is better; 0 means no match.
 * Weighted so a name hit always outranks an incidental description hit.
 */
function scoreProduct(product: Product, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const name = normalize(product.name);
  const category = normalize(product.category);
  const material = normalize(product.material);
  const description = normalize(product.description);
  const collections = product.collections.join(" ").replace(/-/g, " ");

  let score = 0;
  if (name === q) score += 100;
  else if (name.startsWith(q)) score += 60;
  else if (name.includes(q)) score += 40;

  if (category.includes(q)) score += 20;
  if (collections.includes(q)) score += 15;
  if (material.includes(q)) score += 10;
  if (description.includes(q)) score += 5;

  return score;
}

function compareBySort(sort: ProductSort) {
  return (a: Product, b: Product): number => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price || a.name.localeCompare(b.name);
      case "price-desc":
        return b.price - a.price || a.name.localeCompare(b.name);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "featured":
      default:
        // Featured first, in-stock ahead of sold-out, then alphabetical.
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
        return a.name.localeCompare(b.name);
    }
  };
}

function clampPerPage(perPage: number | undefined): number {
  if (!perPage || !Number.isFinite(perPage)) return DEFAULT_PER_PAGE;
  return Math.min(MAX_PER_PAGE, Math.max(1, Math.trunc(perPage)));
}

function paginate<T>(items: T[], page: number, perPage: number): Paginated<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  // Clamp rather than 404 so a stale ?page= in a shared link still renders.
  const safePage = Math.min(Math.max(1, Math.trunc(page)), pageCount);
  const start = (safePage - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    total,
    page: safePage,
    perPage,
    pageCount,
  };
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

/** Filtered, sorted and paginated product listing. Powers /shop and /api/products. */
export async function listProducts(
  query: ProductQuery = {},
): Promise<Paginated<Product>> {
  const all = await productRepository.list();
  const sort: ProductSort = query.sort ?? "featured";

  let items = all;

  if (query.collection) {
    const slug = query.collection;
    items = items.filter((product) => product.collections.includes(slug));
  }

  if (query.occasion) {
    const occ = normalize(query.occasion);
    items = items.filter((product) =>
      product.giftingOccasions?.some((o) => normalize(o).includes(occ)) ||
      normalize(product.description).includes(occ)
    );
  }

  if (query.budget) {
    const b = query.budget.toLowerCase();
    items = items.filter((product) => {
      if (b === "under-500") return product.price < 500;
      if (b === "500-1000") return product.price >= 500 && product.price <= 1000;
      if (b === "1000-2500") return product.price >= 1000 && product.price <= 2500;
      if (b === "2500-5000") return product.price >= 2500 && product.price <= 5000;
      if (b === "premium" || b === "5000+") return product.price >= 5000;
      return true;
    });
  }

  if (query.inStockOnly) {
    items = items.filter((product) => product.inStock);
  }

  const q = query.q ? normalize(query.q) : "";
  if (q) {
    const scored = items
      .map((product) => ({ product, score: scoreProduct(product, q) }))
      .filter((entry) => entry.score > 0);

    // A text query means relevance ordering, unless the caller asked for a
    // specific sort — then relevance only decides which items qualify.
    if (query.sort && query.sort !== "featured") {
      items = scored.map((entry) => entry.product).sort(compareBySort(sort));
    } else {
      items = scored
        .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
        .map((entry) => entry.product);
    }
  } else {
    items = [...items].sort(compareBySort(sort));
  }

  return paginate(items, query.page ?? 1, clampPerPage(query.perPage));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return productRepository.findBySlug(slug);
}

export async function getFeaturedProducts(
  limit: number = siteConfig.commerce.featuredLimit,
): Promise<Product[]> {
  const all = await productRepository.list();
  return all
    .filter((product) => product.featured)
    .sort(compareBySort("featured"))
    .slice(0, Math.max(0, limit));
}

/**
 * Pieces shown alongside a product: same collection first, then anything else,
 * excluding the product itself. Always returns up to `limit` items when the
 * catalog is large enough, so the section never renders half-empty.
 */
export async function getRelatedProducts(
  product: Product,
  limit: number = siteConfig.commerce.relatedLimit,
): Promise<Product[]> {
  const all = await productRepository.list();
  const others = all.filter((candidate) => candidate.id !== product.id);
  const collections = new Set(product.collections);

  const sameCollection = others.filter((candidate) =>
    candidate.collections.some((slug) => collections.has(slug)),
  );
  const rest = others.filter(
    (candidate) => !candidate.collections.some((slug) => collections.has(slug)),
  );

  return [...sameCollection, ...rest].slice(0, Math.max(0, limit));
}

/** Typeahead results for the search overlay. */
export async function searchProducts(
  query: string,
  limit = MAX_SEARCH_RESULTS,
): Promise<Product[]> {
  const q = normalize(query);
  if (!q) return [];

  const all = await productRepository.list();
  return all
    .map((product) => ({ product, score: scoreProduct(product, q) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .slice(0, Math.max(0, limit))
    .map((entry) => entry.product);
}

/** Resolves ids from a visitor's browser storage. Unknown ids are dropped. */
export async function getProductsByIds(ids: readonly string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  return productRepository.findManyByIds(ids);
}

/* -------------------------------------------------------------------------- */
/* Collections                                                                 */
/* -------------------------------------------------------------------------- */

export async function listCollections(): Promise<Collection[]> {
  return collectionRepository.list();
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  return collectionRepository.findBySlug(slug);
}

export type CollectionPage = {
  collection: Collection;
  products: Product[];
};

/**
 * A collection and exactly the products it contains.
 *
 * Returns an empty array for an empty collection — never a fallback list of
 * unrelated products, which would advertise pieces the collection does not hold.
 */
export async function getCollectionPage(
  slug: string,
  sort: ProductSort = "featured",
): Promise<CollectionPage | null> {
  const collection = await collectionRepository.findBySlug(slug);
  if (!collection) return null;

  const all = await productRepository.list();
  const products = all
    .filter((product) => product.collections.includes(slug))
    .sort(compareBySort(sort));

  return { collection, products };
}

/* -------------------------------------------------------------------------- */
/* Static params                                                               */
/* -------------------------------------------------------------------------- */

export async function getAllProductSlugs(): Promise<string[]> {
  const all = await productRepository.list();
  return all.map((product) => product.slug);
}

export async function getAllCollectionSlugs(): Promise<string[]> {
  const all = await collectionRepository.list();
  return all.map((collection) => collection.slug);
}
