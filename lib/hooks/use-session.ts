"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { fetchSession } from "@/lib/api/client";
import type { User } from "@/types/account";

export type SessionState = {
  user: User | null;
  /** True until the first lookup settles. */
  loading: boolean;
};

/**
 * The signed-in user, read from the API.
 *
 * Deliberately client-side. Reading the session cookie in the root layout would
 * opt EVERY page into dynamic rendering, including the statically prerendered
 * catalog. Fetching it here keeps those pages static and costs one small
 * request after hydration.
 *
 * Re-checked on navigation so signing in or out is reflected without a reload.
 */
export function useSession(): SessionState {
  const pathname = usePathname();
  const [settled, setSettled] = useState<{ key: string; user: User | null } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchSession({ signal: controller.signal }).then((result) => {
      if (controller.signal.aborted) return;
      setSettled({ key: pathname, user: result.ok ? result.data.user : null });
    });

    return () => controller.abort();
  }, [pathname]);

  return {
    user: settled?.user ?? null,
    // Only the very first lookup shows as loading; later navigations keep the
    // previous answer on screen rather than flickering back to signed-out.
    loading: settled === null,
  };
}
