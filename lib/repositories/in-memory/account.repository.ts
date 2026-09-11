import "server-only";

import type { Address, Session, UserRecord } from "@/types/account";
import type {
  AddressRepository,
  SessionRepository,
  UserRepository,
} from "@/lib/repositories/types";

/**
 * In-memory account storage.
 *
 * PERSISTENCE NOTE: these Maps live in the server process, so accounts, sessions
 * and addresses are lost on restart and are NOT shared between instances. That
 * is fine for a template and for local development; before deploying, point the
 * composition root at a real database implementation of these same interfaces.
 */

export class InMemoryUserRepository implements UserRepository {
  readonly #byId = new Map<string, UserRecord>();
  /** Keyed by E.164 phone — the account identity. */
  readonly #byPhone = new Map<string, UserRecord>();

  async findById(id: string): Promise<UserRecord | null> {
    return this.#byId.get(id) ?? null;
  }

  async findByPhone(phone: string): Promise<UserRecord | null> {
    return this.#byPhone.get(phone.trim()) ?? null;
  }

  async create(user: UserRecord): Promise<UserRecord> {
    this.#byId.set(user.id, user);
    this.#byPhone.set(user.phone, user);
    return user;
  }

  async update(user: UserRecord): Promise<UserRecord> {
    const existing = this.#byId.get(user.id);

    // The phone key must move with the record, or the old number would keep
    // resolving to this user.
    if (existing && existing.phone !== user.phone) {
      this.#byPhone.delete(existing.phone);
    }

    this.#byId.set(user.id, user);
    this.#byPhone.set(user.phone, user);
    return user;
  }
}

export class InMemorySessionRepository implements SessionRepository {
  readonly #sessions = new Map<string, Session>();

  async create(session: Session): Promise<Session> {
    this.#sessions.set(session.id, session);
    return session;
  }

  async find(id: string): Promise<Session | null> {
    const session = this.#sessions.get(id);
    if (!session) return null;

    // Expired sessions are removed on read rather than by a timer, which keeps
    // the store self-cleaning without a background job.
    if (Date.parse(session.expiresAt) <= Date.now()) {
      this.#sessions.delete(id);
      return null;
    }

    return session;
  }

  async delete(id: string): Promise<void> {
    this.#sessions.delete(id);
  }

  /** Used when a password changes, to sign out every other device. */
  async deleteAllForUser(userId: string, exceptId?: string): Promise<void> {
    for (const [id, session] of this.#sessions) {
      if (session.userId === userId && id !== exceptId) this.#sessions.delete(id);
    }
  }
}

export class InMemoryAddressRepository implements AddressRepository {
  readonly #byId = new Map<string, Address>();

  async listForUser(userId: string): Promise<Address[]> {
    return [...this.#byId.values()]
      .filter((address) => address.userId === userId)
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
  }

  async find(id: string): Promise<Address | null> {
    return this.#byId.get(id) ?? null;
  }

  async create(address: Address): Promise<Address> {
    if (address.isDefault) await this.#clearDefault(address.userId);
    this.#byId.set(address.id, address);
    return address;
  }

  async update(address: Address): Promise<Address> {
    if (address.isDefault) await this.#clearDefault(address.userId, address.id);
    this.#byId.set(address.id, address);
    return address;
  }

  async delete(id: string): Promise<void> {
    this.#byId.delete(id);
  }

  /** Exactly one address per user may carry the default flag. */
  async #clearDefault(userId: string, exceptId?: string): Promise<void> {
    for (const [id, address] of this.#byId) {
      if (address.userId === userId && id !== exceptId && address.isDefault) {
        this.#byId.set(id, { ...address, isDefault: false });
      }
    }
  }
}
