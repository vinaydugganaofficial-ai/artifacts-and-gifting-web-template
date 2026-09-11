"use client";

import { useEffect } from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorProps = {
  error: Error & { digest?: string };
  /** Re-fetches and re-renders the segment. Preferred over `reset` in Next 16. */
  unstable_retry?: () => void;
  reset?: () => void;
};

/**
 * Route-level error boundary.
 *
 * Server errors reach the client with a generic message and a `digest` only —
 * details stay on the server, where `instrumentation.ts` logs them against that
 * same digest. Showing the digest here is what lets a user report turn into a
 * specific log line.
 */
export default function RouteError({ error, unstable_retry, reset }: ErrorProps) {
  useEffect(() => {
    // Surfaces the error in the browser console for local debugging; the
    // authoritative record is the server log written by onRequestError.
    console.error("Route error", error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-2xl flex-col justify-center px-5 py-32">
      <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-terracotta">
        Something broke
      </p>

      <h1 className="mt-4 font-display text-4xl leading-tight text-forest sm:text-5xl">
        This page did not load.
      </h1>

      <span className="mt-6 block h-px w-16 bg-terracotta" aria-hidden />

      <p className="mt-6 text-deep-brown/75">
        The fault is at our end, not yours. Trying again often resolves it — if it does
        not, the collection is still browsable.
      </p>

      {error.digest ? (
        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-deep-brown/50">
          Reference {error.digest}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-4">
        {retry ? (
          <button
            type="button"
            onClick={() => retry()}
            className={buttonVariants({ variant: "forest" })}
          >
            Try again
          </button>
        ) : null}

        <Link href="/" className={cn(buttonVariants({ variant: "sand" }))}>
          Return home
        </Link>
      </div>
    </section>
  );
}
