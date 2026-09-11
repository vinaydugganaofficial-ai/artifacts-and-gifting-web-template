"use client";

import { create } from "zustand";

/** Ephemeral UI state. Never persisted — it is meaningless across a reload. */

export type ToastTone = "default" | "success" | "error";

export type Toast = {
  id: number;
  message: string;
  tone: ToastTone;
};

type UIState = {
  toast: Toast | null;
  /** Slug of the product shown in the quick-view dialog, if any. */
  quickViewSlug: string | null;
  /** Incremented to replay the header cart animation. */
  cartPulse: number;
  showToast: (message: string, tone?: ToastTone) => void;
  clearToast: () => void;
  openQuickView: (slug: string) => void;
  closeQuickView: () => void;
  pulseCart: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  toast: null,
  quickViewSlug: null,
  cartPulse: 0,

  showToast: (message, tone = "default") =>
    // `Date.now()` can repeat within a millisecond; the counter guarantees a
    // unique key so two quick toasts always animate independently.
    set((state) => ({
      toast: { id: Date.now() + state.cartPulse, message, tone },
    })),

  clearToast: () => set({ toast: null }),
  openQuickView: (slug) => set({ quickViewSlug: slug }),
  closeQuickView: () => set({ quickViewSlug: null }),
  pulseCart: () => set((state) => ({ cartPulse: state.cartPulse + 1 })),
}));
