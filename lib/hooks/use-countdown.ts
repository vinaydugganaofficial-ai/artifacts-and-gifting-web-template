"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Seconds remaining until an instant, ticking down to zero.
 *
 * Anchored to an absolute ISO timestamp from the server rather than to a
 * client-side duration, so the countdown stays honest across a backgrounded
 * tab, a device sleep or a clock the browser throttles. It is a MIRROR of the
 * server's cooldown, never the control — the server refuses an early resend
 * whatever this shows.
 *
 * Built on `useSyncExternalStore` because the clock IS an external source. The
 * alternative — `setState` on an interval — writes state from inside an effect,
 * which cascades an extra render every second and is what the
 * `react-hooks/set-state-in-effect` rule warns about. Here the snapshot is a
 * plain number, so React re-renders only when the displayed second actually
 * changes.
 */
export function useCountdown(targetIso: string | null): number {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!targetIso) return () => {};

      const timer = window.setInterval(onStoreChange, 1000);
      return () => window.clearInterval(timer);
    },
    [targetIso],
  );

  const getSnapshot = useCallback(() => secondsUntil(targetIso), [targetIso]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

function secondsUntil(targetIso: string | null): number {
  if (!targetIso) return 0;

  const target = Date.parse(targetIso);
  if (Number.isNaN(target)) return 0;

  return Math.max(0, Math.ceil((target - Date.now()) / 1000));
}
