import "server-only";

import type { OtpChallenge } from "@/types/account";
import type { OtpChallengeRepository } from "@/lib/repositories/types";

/**
 * In-memory store for one-time-code challenges.
 *
 * RETENTION: challenges are kept for a full hour after they are created, not
 * merely until they expire. The per-number request ceiling counts challenges in
 * that window, so deleting a challenge the moment it is superseded or used
 * would erase the evidence the ceiling depends on and make it unenforceable.
 *
 * `find` therefore refuses an expired challenge without removing it; eviction
 * is the sweep's job alone. Volume is bounded by the ceiling itself (a handful
 * of small records per number per hour).
 *
 * Challenges are short-lived by design, so process memory is a reasonable fit
 * even in production. A multi-instance deployment does need a shared store
 * (Redis), or a code issued by one instance would be verified against another.
 */

/** How long a challenge is kept for counting after it is created. */
const RETENTION_MS = 60 * 60 * 1000;

export class InMemoryOtpChallengeRepository implements OtpChallengeRepository {
  readonly #byId = new Map<string, OtpChallenge>();

  async create(challenge: OtpChallenge): Promise<OtpChallenge> {
    this.#sweep();
    this.#byId.set(challenge.id, challenge);
    return challenge;
  }

  /** Returns null for an unknown or expired challenge, but does not evict it. */
  async find(id: string): Promise<OtpChallenge | null> {
    const challenge = this.#byId.get(id);
    if (!challenge) return null;

    if (Date.parse(challenge.expiresAt) <= Date.now()) return null;

    return challenge;
  }

  async update(challenge: OtpChallenge): Promise<OtpChallenge> {
    this.#byId.set(challenge.id, challenge);
    return challenge;
  }

  async delete(id: string): Promise<void> {
    this.#byId.delete(id);
  }

  /**
   * The newest challenge for a number, used or not.
   *
   * The resend cooldown is measured from this, so asking again immediately
   * after a code was issued is refused even once that code has been consumed.
   */
  async findLatestForPhone(phone: string): Promise<OtpChallenge | null> {
    let latest: OtpChallenge | null = null;

    for (const challenge of this.#byId.values()) {
      if (challenge.phone !== phone) continue;
      if (!latest || Date.parse(challenge.createdAt) > Date.parse(latest.createdAt)) {
        latest = challenge;
      }
    }

    return latest;
  }

  /** How many codes have been issued to a number inside the window. */
  async countRequestsSince(phone: string, sinceMs: number): Promise<number> {
    const cutoff = Date.now() - sinceMs;
    let count = 0;

    for (const challenge of this.#byId.values()) {
      if (challenge.phone === phone && Date.parse(challenge.createdAt) >= cutoff) {
        count += 1;
      }
    }

    return count;
  }

  /**
   * Invalidates every live challenge for a number without discarding it.
   *
   * Marking them consumed makes an older code unusable the moment a newer one
   * is sent, while keeping the record so the ceiling can still count it.
   */
  async supersedeForPhone(phone: string): Promise<void> {
    const now = new Date().toISOString();

    for (const [id, challenge] of this.#byId) {
      if (challenge.phone === phone && !challenge.consumedAt) {
        this.#byId.set(id, { ...challenge, consumedAt: now });
      }
    }
  }

  #sweep(): void {
    const cutoff = Date.now() - RETENTION_MS;

    for (const [id, challenge] of this.#byId) {
      if (Date.parse(challenge.createdAt) < cutoff) this.#byId.delete(id);
    }
  }
}
