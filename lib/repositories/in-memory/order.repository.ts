import "server-only";

import type { Order } from "@/types/order";
import type { OrderRepository } from "@/lib/repositories/types";

/**
 * In-memory order storage.
 *
 * See the persistence note on the account repository — orders are lost on
 * restart. Swap the implementation at the composition root for a real store.
 */
export class InMemoryOrderRepository implements OrderRepository {
  readonly #byId = new Map<string, Order>();
  readonly #byNumber = new Map<string, Order>();

  async create(order: Order): Promise<Order> {
    this.#byId.set(order.id, order);
    this.#byNumber.set(order.orderNumber.toUpperCase(), order);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    return this.#byId.get(id) ?? null;
  }

  async findByNumber(orderNumber: string): Promise<Order | null> {
    return this.#byNumber.get(orderNumber.trim().toUpperCase()) ?? null;
  }

  /** Newest first — the order a customer expects to see them in. */
  async listForUser(userId: string): Promise<Order[]> {
    return [...this.#byId.values()]
      .filter((order) => order.userId === userId)
      .sort((a, b) => Date.parse(b.placedAt) - Date.parse(a.placedAt));
  }

  async update(order: Order): Promise<Order> {
    this.#byId.set(order.id, order);
    this.#byNumber.set(order.orderNumber.toUpperCase(), order);
    return order;
  }

  /** Reassigns guest orders to an account when that number later registers. */
  async attachGuestOrders(phone: string, userId: string): Promise<number> {
    const target = phone.trim();
    let attached = 0;

    for (const [id, order] of this.#byId) {
      if (!order.userId && order.phone === target) {
        const updated = { ...order, userId };
        this.#byId.set(id, updated);
        this.#byNumber.set(order.orderNumber.toUpperCase(), updated);
        attached += 1;
      }
    }

    return attached;
  }
}
