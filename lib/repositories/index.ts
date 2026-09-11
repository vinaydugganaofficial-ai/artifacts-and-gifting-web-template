import "server-only";

import { InMemoryProductRepository } from "@/lib/repositories/in-memory/product.repository";
import { InMemoryCollectionRepository } from "@/lib/repositories/in-memory/collection.repository";
import {
  InMemoryArtisanRepository,
  InMemoryFaqRepository,
  InMemoryJournalRepository,
  InMemoryPolicyRepository,
} from "@/lib/repositories/in-memory/content.repository";
import {
  InMemoryAddressRepository,
  InMemorySessionRepository,
  InMemoryUserRepository,
} from "@/lib/repositories/in-memory/account.repository";
import { InMemoryOrderRepository } from "@/lib/repositories/in-memory/order.repository";
import { InMemoryCouponRepository } from "@/lib/repositories/in-memory/coupon.repository";
import { InMemoryOtpChallengeRepository } from "@/lib/repositories/in-memory/otp.repository";
import type {
  AddressRepository,
  ArtisanRepository,
  CollectionRepository,
  CouponRepository,
  FaqRepository,
  JournalRepository,
  OrderRepository,
  OtpChallengeRepository,
  PolicyRepository,
  ProductRepository,
  SessionRepository,
  UserRepository,
} from "@/lib/repositories/types";

/**
 * Composition root.
 *
 * The ONLY place concrete repository implementations are named. Point these at
 * a database- or CMS-backed class and the services, route handlers and pages
 * above them keep working unchanged.
 *
 * PERSISTENCE: the account, order and session repositories hold state in
 * process memory. Accounts and orders therefore do not survive a restart and
 * are not shared between instances. Replace them before deploying — every
 * consumer talks to the interfaces in `./types`, so nothing else changes.
 */

type Repositories = {
  product: ProductRepository;
  collection: CollectionRepository;
  artisan: ArtisanRepository;
  journal: JournalRepository;
  faq: FaqRepository;
  policy: PolicyRepository;
  user: UserRepository;
  session: SessionRepository;
  otpChallenge: OtpChallengeRepository;
  address: AddressRepository;
  order: OrderRepository;
  coupon: CouponRepository;
};

function createRepositories(): Repositories {
  const product = new InMemoryProductRepository();

  return {
    product,
    collection: new InMemoryCollectionRepository(product),
    artisan: new InMemoryArtisanRepository(),
    journal: new InMemoryJournalRepository(),
    faq: new InMemoryFaqRepository(),
    policy: new InMemoryPolicyRepository(),
    user: new InMemoryUserRepository(),
    session: new InMemorySessionRepository(),
    otpChallenge: new InMemoryOtpChallengeRepository(),
    address: new InMemoryAddressRepository(),
    order: new InMemoryOrderRepository(),
    coupon: new InMemoryCouponRepository(),
  };
}

/**
 * Held on `globalThis` rather than in a module-level `const`.
 *
 * Next.js compiles `instrumentation.ts`, route handlers and pages into separate
 * bundles, and each bundle gets its OWN instance of an imported module. With a
 * plain module-level singleton the seeder would write to one copy of the
 * in-memory Maps while requests read from another — accounts created at startup
 * would simply not exist. A global registry gives every bundle the same object.
 *
 * It also survives the module re-evaluation that hot reloading causes in
 * development, so a signed-in session is not lost on every file save.
 *
 * A database-backed implementation would not need this, since the state would
 * live in the database rather than in the process.
 */
const REGISTRY = Symbol.for("viraasat.repositories");

type Registry = typeof globalThis & {
  [REGISTRY]?: Repositories;
};

function getRepositories(): Repositories {
  const registry = globalThis as Registry;

  if (!registry[REGISTRY]) {
    registry[REGISTRY] = createRepositories();
  }

  return registry[REGISTRY];
}

const repositories = getRepositories();

export const productRepository = repositories.product;
export const collectionRepository = repositories.collection;
export const artisanRepository = repositories.artisan;
export const journalRepository = repositories.journal;
export const faqRepository = repositories.faq;
export const policyRepository = repositories.policy;
export const userRepository = repositories.user;
export const sessionRepository = repositories.session;
export const otpChallengeRepository = repositories.otpChallenge;
export const addressRepository = repositories.address;
export const orderRepository = repositories.order;
export const couponRepository = repositories.coupon;
