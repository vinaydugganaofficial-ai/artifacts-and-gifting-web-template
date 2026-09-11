"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import type { NavLink } from "@/config/site";
import { formatPhone } from "@/lib/auth/phone";
import { signOut } from "@/lib/api/client";
import { useUIStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

type AccountNavProps = {
  links: readonly NavLink[];
  userName: string;
  /** E.164. Displayed grouped, and it is the account's identity. */
  userPhone: string;
};

export function AccountNav({ links, userName, userPhone }: AccountNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const showToast = useUIStore((state) => state.showToast);
  const [signingOut, setSigningOut] = useState(false);

  async function onSignOut() {
    setSigningOut(true);
    const result = await signOut();

    if (!result.ok) {
      setSigningOut(false);
      showToast("Could not sign out. Please try again.", "error");
      return;
    }

    showToast("Signed out", "success");
    router.replace("/");
    // Re-runs the Server Components so the header reflects the ended session.
    router.refresh();
  }

  return (
    <nav aria-label="Account" className="lg:sticky lg:top-28 lg:self-start">
      <div className="border-b border-deep-brown/15 pb-6">
        <p className="font-display text-2xl leading-tight text-forest">{userName}</p>
        <p className="mt-1 truncate text-sm text-deep-brown/60">{formatPhone(userPhone)}</p>
      </div>

      <ul className="mt-6 flex gap-x-6 gap-y-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {links.map((link) => {
          // `/account` would otherwise match every child route.
          const active =
            link.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(link.href);

          return (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                data-active={active}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block whitespace-nowrap py-2 text-[11px] uppercase tracking-[0.22em] transition-colors",
                  active ? "font-medium text-terracotta" : "text-deep-brown/70 hover:text-forest",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onSignOut}
        disabled={signingOut}
        className="mt-6 border-t border-deep-brown/15 pt-6 text-[11px] uppercase tracking-[0.22em] text-deep-brown/60 transition-colors hover:text-danger disabled:opacity-50"
      >
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </nav>
  );
}
