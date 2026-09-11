import "server-only";

import { collections, type CollectionSeed } from "@/lib/data/collections";
import type { Collection } from "@/types/product";
import type { CollectionRepository, ProductRepository } from "@/lib/repositories/types";

/**
 * Collections with `count` derived from the live catalog.
 *
 * The count is computed from the products that a collection page would actually
 * render, so the number on a card can never disagree with the page behind it.
 */
export class InMemoryCollectionRepository implements CollectionRepository {
  readonly #seed: readonly CollectionSeed[];
  readonly #products: ProductRepository;

  constructor(
    products: ProductRepository,
    seed: readonly CollectionSeed[] = collections,
  ) {
    this.#products = products;
    this.#seed = seed;
  }

  async list(): Promise<Collection[]> {
    const all = await this.#products.list();

    const counts = new Map<string, number>();
    for (const product of all) {
      for (const slug of product.collections) {
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
      }
    }

    return this.#seed.map((seed) => ({
      ...seed,
      count: counts.get(seed.slug) ?? 0,
    }));
  }

  async findBySlug(slug: string): Promise<Collection | null> {
    const all = await this.list();
    return all.find((collection) => collection.slug === slug) ?? null;
  }
}
