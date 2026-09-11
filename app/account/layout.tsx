import type { ReactNode } from "react";

import { AccountNav } from "@/components/account/AccountNav";
import { requireUser } from "@/lib/auth/guard";
import { accountNavLinks } from "@/config/site";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

/**
 * Guards the whole account section.
 *
 * The auth check lives here rather than in each page, so a new route added
 * beneath `/account` is protected by default instead of by remembering to add
 * a check to it.
 */
export default async function AccountLayout({ children }: { children: ReactNode }) {
  const user = await requireUser("/account");

  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div
        className={cn(
          tokens.container,
          "grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16",
        )}
      >
        <AccountNav links={accountNavLinks} userName={user.name} userPhone={user.phone} />

        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
