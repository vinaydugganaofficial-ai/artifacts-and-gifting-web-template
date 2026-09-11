import "server-only";

import { products } from "@/lib/data/products";
import type { Product } from "@/types/product";
import type { ProductRepository } from "@/lib/repositories/types";

/**
 * In-memory catalog backed by the static seed data.
 *
 * Lookup indexes are built once at module load rather than scanning the array
 * per request — O(1) reads regardless of catalog size or concurrency.
 */
export class InMemoryProductRepository implements ProductRepository {
  readonly #all: readonly Product[];
  readonly #byId: ReadonlyMap<string, Product>;
  readonly #bySlug: ReadonlyMap<string, Product>;

  constructor(seed: readonly Product[] = products) {
    this.#all = seed;
    this.#byId = new Map(seed.map((product) => [product.id, product]));
    this.#bySlug = new Map(seed.map((product) => [product.slug, product]));
  }

  async list(): Promise<Product[]> {
    return [...this.#all];
  }

  async findById(id: string): Promise<Product | null> {
    return this.#byId.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.#bySlug.get(slug) ?? null;
  }

  async findManyByIds(ids: readonly string[]): Promise<Product[]> {
    const seen = new Set<string>();
    const found: Product[] = [];

    for (const id of ids) {
      if (seen.has(id)) continue;
      seen.add(id);
      const product = this.#byId.get(id);
      // Unknown ids are dropped rather than surfaced as holes — a stale id in a
      // visitor's localStorage must never crash a render.
      if (product) found.push(product);
    }

    return found;
  }
}
