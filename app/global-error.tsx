"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for failures in the root layout itself.
 *
 * This replaces the entire document when active, so it must render its own
 * `<html>` and `<body>` and cannot rely on the layout's fonts or providers.
 * Styling is inline for that reason — the stylesheet may be exactly what failed.
 */
export default function GlobalError({
  error,
  unstable_retry,
  reset,
}: {
  error: Error & { digest?: string };
  unstable_retry?: () => void;
  reset?: () => void;
}) {
  useEffect(() => {
    console.error("Global error", error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F5EE",
          color: "#332A24",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        {/* `global-error` cannot export metadata, so the title is set here. */}
        <title>Something went wrong — Viraasat</title>

        <main style={{ maxWidth: "34rem" }}>
          <p
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "#A94F35",
              margin: 0,
              fontWeight: 600,
            }}
          >
            Something went wrong
          </p>

          <h1
            style={{
              fontFamily: '"Times New Roman", Georgia, serif',
              fontSize: "2.5rem",
              lineHeight: 1.15,
              margin: "1rem 0 0",
              fontWeight: 500,
              color: "#243A2D",
            }}
          >
            The site failed to load.
          </h1>

          <div
            style={{
              height: 2,
              width: "4rem",
              background: "#A94F35",
              margin: "1.5rem 0",
            }}
          />

          <p style={{ color: "rgba(51,42,36,0.75)", lineHeight: 1.65, margin: 0 }}>
            An unexpected error stopped the page rendering. Reloading usually clears it.
          </p>

          {error.digest ? (
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "0.6875rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(51,42,36,0.5)",
              }}
            >
              Reference {error.digest}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => (retry ? retry() : window.location.reload())}
            style={{
              marginTop: "2.5rem",
              height: "3rem",
              padding: "0 1.75rem",
              background: "#243A2D",
              color: "#F8F5EE",
              border: "none",
              cursor: "pointer",
              fontSize: "0.6875rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
