import type { Instrumentation } from "next";

/**
 * Server observability hooks.
 *
 * `onRequestError` is Next.js's official capture point for server-side errors —
 * Server Components, route handlers and server actions all funnel through it.
 * This is where an APM (Sentry, Datadog, OpenTelemetry) is wired in; until then
 * every error is written as a structured line carrying the `digest` that the
 * client-facing error page shows the user, so a report can be traced to its log.
 */

/**
 * Runs once as the server starts, before the first request is served.
 *
 * Seeds the in-memory demo account and orders so the account section has
 * something to show. The seeder is a no-op in production unless explicitly
 * enabled.
 */
export async function register(): Promise<void> {
  // Node-only: the seeder uses `node:crypto` for password hashing.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { seedDemoData } = await import("@/lib/data/seed");
  await seedDemoData();
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  // Imported lazily so the logger (and its `server-only` guard) is not pulled
  // into the Edge bundle when this module is evaluated there.
  const { logger, toErrorContext } = await import("@/lib/observability/logger");

  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String((error as { digest?: unknown }).digest)
      : undefined;

  logger.error("Unhandled server error", {
    digest,
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
    ...toErrorContext(error),
  });
};
