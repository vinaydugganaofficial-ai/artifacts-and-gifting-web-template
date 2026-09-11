import "server-only";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/services/auth.service";
import type { User } from "@/types/account";

/**
 * Page-level auth guard.
 *
 * Used by `app/account/layout.tsx`, so every route beneath it is protected by
 * one check rather than each page remembering to do its own.
 *
 * `next` carries where the visitor was heading, so signing in returns them
 * there instead of dumping them on a dashboard.
 */
export async function requireUser(returnTo?: string): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    const target = returnTo ? `?next=${encodeURIComponent(returnTo)}` : "";
    redirect(`/sign-in${target}`);
  }

  return user;
}

/** Sends an already-signed-in visitor away from the sign-in / sign-up pages. */
export async function redirectIfSignedIn(to = "/account"): Promise<void> {
  const user = await getCurrentUser();
  if (user) redirect(to);
}

/**
 * Validates a redirect target supplied through the URL.
 *
 * Only same-origin, single-slash paths are allowed. Without this check a link
 * like `/sign-in?next=https://evil.example` would turn our own sign-in form
 * into an open redirect.
 */
export function safeReturnPath(value: string | undefined, fallback = "/account"): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  // `//evil.com` and `/\evil.com` are protocol-relative URLs, not local paths.
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;

  return value;
}
