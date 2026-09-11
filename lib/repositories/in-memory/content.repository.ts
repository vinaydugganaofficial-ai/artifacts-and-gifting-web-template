import "server-only";

import { artisans } from "@/lib/data/artisans";
import { journalEntries } from "@/lib/data/journal";
import { faqs } from "@/lib/data/faqs";
import { policies } from "@/lib/data/policies";
import type { Artisan, Faq, JournalEntry, Policy } from "@/types/content";
import type {
  ArtisanRepository,
  FaqRepository,
  JournalRepository,
  PolicyRepository,
} from "@/lib/repositories/types";

export class InMemoryArtisanRepository implements ArtisanRepository {
  readonly #all: readonly Artisan[];
  readonly #bySlug: ReadonlyMap<string, Artisan>;

  constructor(seed: readonly Artisan[] = artisans) {
    this.#all = seed;
    this.#bySlug = new Map(seed.map((artisan) => [artisan.slug, artisan]));
  }

  async list(): Promise<Artisan[]> {
    return [...this.#all];
  }

  async findBySlug(slug: string): Promise<Artisan | null> {
    return this.#bySlug.get(slug) ?? null;
  }
}

export class InMemoryJournalRepository implements JournalRepository {
  readonly #sorted: readonly JournalEntry[];
  readonly #bySlug: ReadonlyMap<string, JournalEntry>;

  constructor(seed: readonly JournalEntry[] = journalEntries) {
    // Sorted once at construction so every read is already newest-first.
    this.#sorted = [...seed].sort(
      (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    );
    this.#bySlug = new Map(seed.map((entry) => [entry.slug, entry]));
  }

  async list(): Promise<JournalEntry[]> {
    return [...this.#sorted];
  }

  async findBySlug(slug: string): Promise<JournalEntry | null> {
    return this.#bySlug.get(slug) ?? null;
  }
}

export class InMemoryFaqRepository implements FaqRepository {
  readonly #all: readonly Faq[];

  constructor(seed: readonly Faq[] = faqs) {
    this.#all = seed;
  }

  async list(): Promise<Faq[]> {
    return [...this.#all];
  }
}

export class InMemoryPolicyRepository implements PolicyRepository {
  readonly #bySlug: ReadonlyMap<string, Policy>;

  constructor(seed: readonly Policy[] = policies) {
    this.#bySlug = new Map(seed.map((policy) => [policy.slug, policy]));
  }

  async findBySlug(slug: string): Promise<Policy | null> {
    return this.#bySlug.get(slug) ?? null;
  }
}
