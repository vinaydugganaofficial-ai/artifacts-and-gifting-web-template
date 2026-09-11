"use client";

import { useEffect, useState } from "react";

/**
 * Delays propagating a rapidly-changing value.
 *
 * Used by the search overlay so a request is issued once the visitor pauses,
 * rather than on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
