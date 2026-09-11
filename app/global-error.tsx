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
          background: "#f7f3ea",
          color: "#2c2520",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        {/* `global-error` cannot export metadata, so the title is set here. */}
        <title>Something went wrong — Aaranya</title>

        <main style={{ maxWidth: "34rem" }}>
          <p
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "#8f7348",
              margin: 0,
            }}
          >
            Something broke
          </p>

          <h1
            style={{
              fontFamily: '"Times New Roman", Georgia, serif',
              fontSize: "2.5rem",
              lineHeight: 1.15,
              margin: "1rem 0 0",
              fontWeight: 500,
            }}
          >
            The site failed to load.
          </h1>

          <div
            style={{
              height: 1,
              width: "4rem",
              background: "#b08d57",
              margin: "1.5rem 0",
            }}
          />

          <p style={{ color: "rgba(44,37,32,0.65)", lineHeight: 1.65, margin: 0 }}>
            An unexpected error stopped the page rendering. Reloading usually clears it.
          </p>

          {error.digest ? (
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "0.6875rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(44,37,32,0.4)",
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
              background: "#2c2520",
              color: "#f7f3ea",
              border: "none",
              cursor: "pointer",
              fontSize: "0.6875rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
