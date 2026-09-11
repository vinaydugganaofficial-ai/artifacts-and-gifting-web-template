import type { Collection, Product } from "@/types/product";
import type { Artisan, Faq, JournalEntry, Policy } from "@/types/content";
import type { Address, OtpChallenge, Session, UserRecord } from "@/types/account";
import type { Order } from "@/types/order";
import type { Coupon } from "@/types/coupon";

/**
 * Data-access contracts.
 *
 * Services depend on these interfaces, never on a concrete implementation
 * (Dependency Inversion). Every method is async so that swapping the in-memory
 * implementation for a CMS or SQL client requires no change above this layer.
 */

export interface ProductRepository {
  list(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  /** Resolves ids to products, silently dropping ids that no longer exist. */
  findManyByIds(ids: readonly string[]): Promise<Product[]>;
}

export interface CollectionRepository {
  list(): Promise<Collection[]>;
  findBySlug(slug: string): Promise<Collection | null>;
}

export interface ArtisanRepository {
  list(): Promise<Artisan[]>;
  findBySlug(slug: string): Promise<Artisan | null>;
}

export interface JournalRepository {
  /** Newest first. */
  list(): Promise<JournalEntry[]>;
  findBySlug(slug: string): Promise<JournalEntry | null>;
}

export interface FaqRepository {
  list(): Promise<Faq[]>;
}

export interface PolicyRepository {
  findBySlug(slug: string): Promise<Policy | null>;
}

/* -------------------------------------------------------------------------- */
/* Accounts                                                                    */
/* -------------------------------------------------------------------------- */

export interface UserRepository {
  findById(id: string): Promise<UserRecord | null>;
  /** Looks up by E.164 phone, which is the account identity. */
  findByPhone(phone: string): Promise<UserRecord | null>;
  create(user: UserRecord): Promise<UserRecord>;
  update(user: UserRecord): Promise<UserRecord>;
}

export interface OtpChallengeRepository {
  create(challenge: OtpChallenge): Promise<OtpChallenge>;
  /** Returns null for an unknown OR expired challenge. */
  find(id: string): Promise<OtpChallenge | null>;
  update(challenge: OtpChallenge): Promise<OtpChallenge>;
  delete(id: string): Promise<void>;
  /** The newest challenge for a number, used or not. Drives the resend cooldown. */
  findLatestForPhone(phone: string): Promise<OtpChallenge | null>;
  /** Codes issued to a number inside the window. Drives the request ceiling. */
  countRequestsSince(phone: string, sinceMs: number): Promise<number>;
  /** Invalidates live challenges for a number, keeping them for counting. */
  supersedeForPhone(phone: string): Promise<void>;
}

export interface SessionRepository {
  create(session: Session): Promise<Session>;
  /** Returns null for an unknown OR expired session. */
  find(id: string): Promise<Session | null>;
  delete(id: string): Promise<void>;
  deleteAllForUser(userId: string, exceptId?: string): Promise<void>;
}

export interface AddressRepository {
  listForUser(userId: string): Promise<Address[]>;
  find(id: string): Promise<Address | null>;
  create(address: Address): Promise<Address>;
  update(address: Address): Promise<Address>;
  delete(id: string): Promise<void>;
}

/* -------------------------------------------------------------------------- */
/* Orders and coupons                                                          */
/* -------------------------------------------------------------------------- */

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByNumber(orderNumber: string): Promise<Order | null>;
  /** Newest first. */
  listForUser(userId: string): Promise<Order[]>;
  update(order: Order): Promise<Order>;
  /** Links orders placed as a guest to an account with the same phone. */
  attachGuestOrders(phone: string, userId: string): Promise<number>;
}

export interface CouponRepository {
  /** Active coupons only. */
  list(): Promise<Coupon[]>;
  /** Case-insensitive; returns inactive and expired coupons so the caller can explain why. */
  findByCode(code: string): Promise<Coupon | null>;
}
