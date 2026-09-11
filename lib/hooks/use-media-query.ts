"use client";

import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query.
 *
 * Always returns `false` on the server and on the first client render so the
 * hydrated markup matches the server's, then updates once mounted.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const list = window.matchMedia(query);
    const sync = () => setMatches(list.matches);

    sync();
    list.addEventListener("change", sync);
    return () => list.removeEventListener("change", sync);
  }, [query]);

  return matches;
}
