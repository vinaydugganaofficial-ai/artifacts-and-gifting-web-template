"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useUIStore, type ToastTone } from "@/lib/store/ui";
import { easeLuxury } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TOAST_DURATION_MS = 3200;

const toneClass: Record<ToastTone, string> = {
  default: "border-gold/40 bg-charcoal text-ivory",
  success: "border-success/50 bg-charcoal text-ivory",
  error: "border-danger/60 bg-danger text-ivory",
};

export function Toast() {
  const toast = useUIStore((state) => state.toast);
  const clearToast = useUIStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(clearToast, TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <div
      // `aria-live` sits on the always-present container, not on the message.
      // A live region added to the DOM at the same moment as its content is not
      // reliably announced; an existing region whose content changes is.
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-8 z-[var(--z-toast)] flex justify-center px-4"
    >
      <AnimatePresence mode="wait">
        {toast ? (
          <motion.p
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: easeLuxury }}
            className={cn(
              "max-w-[90vw] border px-6 py-3 text-center text-[11px] uppercase tracking-[0.24em]",
              toneClass[toast.tone],
            )}
          >
            {toast.message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
