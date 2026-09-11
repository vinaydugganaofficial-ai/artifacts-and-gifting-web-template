"use client";

import { useSyncExternalStore } from "react";
import type { StoreApi, UseBoundStore } from "zustand";

/**
 * SSR-safe selector for persisted Zustand stores.
 *
 * Returns `fallback` on the server and during hydration, then switches to the
 * real (localStorage-backed) value once React has committed — so server and
 * client markup always match on the first paint.
 *
 * IMPORTANT: `fallback` must be referentially stable across renders. React calls
 * `getServerSnapshot` more than once and compares the results by identity; a
 * fresh `[]` or `{}` literal per render trips the "result of getServerSnapshot
 * should be cached to avoid an infinite loop" error. Use the frozen constants
 * below, or a module-level constant of your own.
 */
export function useStoreBase<T, U>(
  store: UseBoundStore<StoreApi<T>>,
  selector: (state: T) => U,
  fallback: U,
): U {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => fallback,
  );
}

/** Shared stable empty values for use as `fallback`. */
export const EMPTY_STRING_ARRAY: readonly string[] = Object.freeze([]);
