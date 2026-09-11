import "server-only";

import { coupons } from "@/lib/data/coupons";
import type { Coupon } from "@/types/coupon";
import type { CouponRepository } from "@/lib/repositories/types";

export class InMemoryCouponRepository implements CouponRepository {
  readonly #all: readonly Coupon[];
  readonly #byCode: ReadonlyMap<string, Coupon>;

  constructor(seed: readonly Coupon[] = coupons) {
    this.#all = seed;
    // Codes are matched case-insensitively — customers type them by hand.
    this.#byCode = new Map(seed.map((coupon) => [coupon.code.toUpperCase(), coupon]));
  }

  async list(): Promise<Coupon[]> {
    return this.#all.filter((coupon) => coupon.active);
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return this.#byCode.get(code.trim().toUpperCase()) ?? null;
  }
}
