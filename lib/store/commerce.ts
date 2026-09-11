"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { siteConfig } from "@/config/site";

/**
 * Cart and wishlist, persisted to the visitor's own browser.
 *
 * Only ids and quantities are stored — never prices. Every total shown to a
 * visitor and every total used for an order is recomputed server-side from the
 * catalog, so a hand-edited localStorage entry cannot change what anything costs.
 */

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CommerceState = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "aaranya-commerce";

/** Bump when the persisted shape changes, and add a `migrate` branch below. */
const STORAGE_VERSION = 2;

const MAX_QUANTITY = siteConfig.commerce.maxQuantityPerItem;
/** Guards against an oversized or hostile localStorage payload. */
const MAX_DISTINCT_ITEMS = 50;

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(quantity)));
}

/**
 * Validates whatever comes back out of localStorage.
 *
 * Persisted state is untrusted input: it may have been written by an older
 * build, hand-edited, or corrupted. Anything that does not match the current
 * shape is discarded rather than allowed to reach a component.
 */
function sanitize(state: unknown): Pick<CommerceState, "cart" | "wishlist"> {
  const empty = { cart: [] as CartItem[], wishlist: [] as string[] };
  if (typeof state !== "object" || state === null) return empty;

  const candidate = state as Partial<Record<keyof CommerceState, unknown>>;

  const cart: CartItem[] = [];
  const seenProducts = new Set<string>();

  if (Array.isArray(candidate.cart)) {
    for (const entry of candidate.cart) {
      if (cart.length >= MAX_DISTINCT_ITEMS) break;
      if (typeof entry !== "object" || entry === null) continue;

      const item = entry as Partial<CartItem>;
      if (typeof item.productId !== "string" || item.productId.length === 0) continue;
      if (item.productId.length > 80) continue;
      if (seenProducts.has(item.productId)) continue;
      if (typeof item.quantity !== "number") continue;

      seenProducts.add(item.productId);
      cart.push({ productId: item.productId, quantity: clampQuantity(item.quantity) });
    }
  }

  const wishlist: string[] = [];
  const seenWishes = new Set<string>();

  if (Array.isArray(candidate.wishlist)) {
    for (const entry of candidate.wishlist) {
      if (wishlist.length >= MAX_DISTINCT_ITEMS) break;
      if (typeof entry !== "string" || entry.length === 0 || entry.length > 80) continue;
      if (seenWishes.has(entry)) continue;
      seenWishes.add(entry);
      wishlist.push(entry);
    }
  }

  return { cart, wishlist };
}

export const useCommerceStore = create<CommerceState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: (productId, quantity = 1) => {
        const requested = clampQuantity(quantity);
        const cart = get().cart;
        const existing = cart.find((item) => item.productId === productId);

        if (existing) {
          set({
            cart: cart.map((item) =>
              item.productId === productId
                ? { ...item, quantity: clampQuantity(item.quantity + requested) }
                : item,
            ),
          });
          return;
        }

        if (cart.length >= MAX_DISTINCT_ITEMS) return;
        set({ cart: [...cart, { productId, quantity: requested }] });
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.productId !== productId) });
      },

      setQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.productId === productId
              ? { ...item, quantity: clampQuantity(quantity) }
              : item,
          ),
        });
      },

      toggleWishlist: (productId) => {
        const wishlist = get().wishlist;
        const has = wishlist.includes(productId);

        if (has) {
          set({ wishlist: wishlist.filter((id) => id !== productId) });
          return;
        }

        if (wishlist.length >= MAX_DISTINCT_ITEMS) return;
        set({ wishlist: [...wishlist, productId] });
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      // `createJSONStorage` guards its own access, so this is safe during SSR.
      storage: createJSONStorage(() => localStorage),
      /** Persist data only — never the action functions. */
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }),
      /**
       * v1 had the same field names but no quantity clamping or de-duplication.
       * `sanitize` fully normalises any prior shape, so one branch covers it.
       */
      migrate: (persisted) => sanitize(persisted),
      merge: (persisted, current) => ({ ...current, ...sanitize(persisted) }),
    },
  ),
);

/* -------------------------------------------------------------------------- */
/* Selectors                                                                   */
/* -------------------------------------------------------------------------- */

export const selectCart = (state: CommerceState) => state.cart;
export const selectWishlist = (state: CommerceState) => state.wishlist;

export const selectCartCount = (state: CommerceState) =>
  state.cart.reduce((total, item) => total + item.quantity, 0);

export const selectWishlistCount = (state: CommerceState) => state.wishlist.length;
