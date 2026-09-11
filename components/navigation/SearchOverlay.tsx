"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";

import { searchCatalog } from "@/lib/api/client";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { easeTactile } from "@/lib/motion";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";

const NO_RESULTS: Product[] = [];

type SearchOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: readonly string[];
};

export function SearchOverlay({ open, onOpenChange, suggestions }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [settled, setSettled] = useState<{ key: string; items: Product[] } | null>(null);
  const [highlight, setHighlight] = useState<{ key: string; index: number } | null>(null);

  const debouncedQuery = useDebouncedValue(query, 220);
  const trimmed = debouncedQuery.trim();

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || trimmed.length === 0) return;

    const controller = new AbortController();

    searchCatalog(trimmed, { signal: controller.signal }).then((result) => {
      if (controller.signal.aborted) return;
      setSettled({ key: trimmed, items: result.ok ? result.data : NO_RESULTS });
    });

    return () => controller.abort();
  }, [open, trimmed]);

  const isCurrent = trimmed.length > 0 && settled?.key === trimmed;
  const results = isCurrent ? settled.items : NO_RESULTS;
  const loading = trimmed.length > 0 && !isCurrent;
  const activeIndex = highlight?.key === trimmed ? highlight.index : -1;

  function setActiveIndex(index: number) {
    setHighlight({ key: trimmed, index });
  }

  function handleOpenChange(next: boolean) {
    if (!next) setQuery("");
    onOpenChange(next);
  }

  function go(href: string) {
    handleOpenChange(false);
    router.push(href);
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;

    const highlighted = results[activeIndex];
    if (highlighted) {
      go(`/products/${highlighted.slug}`);
      return;
    }

    go(`/search?q=${encodeURIComponent(value)}`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((activeIndex + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(activeIndex <= 0 ? results.length - 1 : activeIndex - 1);
    }
  }

  const showNoResults = trimmed.length > 0 && !loading && results.length === 0;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[var(--z-overlay)] bg-forest/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[var(--z-dialog)] flex items-start justify-center overflow-y-auto px-5 pb-10 pt-[12vh] focus:outline-none md:px-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <VisuallyHidden>
                  <DialogPrimitive.Title>Search the collection</DialogPrimitive.Title>
                  <DialogPrimitive.Description>
                    Search artifacts, gifts, brass, and collections.
                  </DialogPrimitive.Description>
                </VisuallyHidden>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.35, ease: easeTactile }}
                  className="w-full max-w-2xl border border-copper/20 bg-off-white p-6 sm:p-10 shadow-2xl"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-terracotta font-medium">
                      Catalogue Search
                    </p>
                    <DialogPrimitive.Close
                      aria-label="Close search"
                      className="grid size-9 place-items-center text-forest/70 transition-colors hover:text-forest hover:bg-forest/5 rounded-full"
                    >
                      <X className="size-4" />
                    </DialogPrimitive.Close>
                  </div>

                  <form
                    className="mt-6 flex items-center gap-3 border-b border-copper/30 pb-2"
                    onSubmit={onSubmit}
                    role="search"
                  >
                    <Search className="size-5 text-copper" aria-hidden />
                    <label htmlFor="search-input" className="sr-only">
                      Search artifacts, gifts, brass, collections…
                    </label>
                    <input
                      id="search-input"
                      ref={inputRef}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={onKeyDown}
                      autoComplete="off"
                      placeholder="Search artifacts, gifts, brass, collections…"
                      className="h-12 w-full bg-transparent text-lg text-deep-brown placeholder:text-deep-brown/40 focus:outline-none"
                    />
                  </form>

                  <div aria-live="polite" className="min-h-[1.5rem]">
                    {loading ? (
                      <p className="mt-6 text-sm text-deep-brown/50">Searching catalogue…</p>
                    ) : null}

                    {!loading && results.length > 0 ? (
                      <ul className="mt-6 divide-y divide-copper/10">
                        {results.map((product, index) => (
                          <li key={product.id}>
                            <button
                              type="button"
                              onClick={() => go(`/products/${product.slug}`)}
                              onMouseEnter={() => setActiveIndex(index)}
                              data-active={index === activeIndex}
                              className="flex w-full items-baseline justify-between gap-4 py-3 text-left text-sm text-deep-brown transition-colors hover:text-terracotta data-[active=true]:text-terracotta"
                            >
                              <span className="font-medium">{product.name}</span>
                              <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-copper">
                                {formatPrice(product.price)}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {showNoResults ? (
                      <p className="mt-6 text-sm text-deep-brown/60">
                        No pieces match that search. Try searching by occasion, brass, urli, or collection.
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-8 pt-6 border-t border-copper/15">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-copper font-medium">
                      Suggested Searches
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      {suggestions.map((item) => (
                        <li key={item}>
                          <button
                            type="button"
                            onClick={() => setQuery(item)}
                            className="link-underline text-xs text-forest hover:text-terracotta font-medium"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
