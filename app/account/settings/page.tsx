import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth/guard";
import {
  ProfileForm,
  SignInMethodPanel,
} from "@/components/account/AccountSettingsForms";

export const metadata: Metadata = {
  title: "Account settings",
  description: "Your details and how you sign in.",
  robots: { index: false, follow: false },
};

export default async function AccountSettingsPage() {
  const user = await requireUser("/account/settings");

  return (
    <div>
      <header>
        <p className="text-[11px] uppercase tracking-[0.38em] text-gold-muted">
          Settings
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
          Account settings
        </h1>
        <span className="mt-6 block h-px w-16 bg-gold" aria-hidden />
      </header>

      <section className="mt-14">
        <h2 className="font-display text-2xl">Your details</h2>
        <span className="mt-4 block h-px w-10 bg-gold" aria-hidden />
        <div className="mt-8">
          <ProfileForm user={user} />
        </div>
      </section>

      <section className="mt-16 border-t border-charcoal/10 pt-12">
        <h2 className="font-display text-2xl">How you sign in</h2>
        <span className="mt-4 block h-px w-10 bg-gold" aria-hidden />
        <div className="mt-8">
          <SignInMethodPanel user={user} />
        </div>
      </section>

      <section className="mt-16 border-t border-charcoal/10 pt-12">
        <h2 className="font-display text-2xl">Your data</h2>
        <span className="mt-4 block h-px w-10 bg-gold" aria-hidden />

        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-charcoal/70">
          You may ask for a copy of everything we hold about you, have it corrected, or
          have it erased. Write to the atelier and we will answer within thirty days.
        </p>

        <p className="mt-6 text-sm text-charcoal/55">
          What we keep and for how long is set out in our{" "}
          <Link href="/privacy" className="link-underline text-charcoal/80">
            privacy policy
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
