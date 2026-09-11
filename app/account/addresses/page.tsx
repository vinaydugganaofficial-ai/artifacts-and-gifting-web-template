import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/guard";
import { listAddresses } from "@/lib/services/account.service";
import { AddressBook } from "@/components/account/AddressBook";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Addresses",
  description: "Your saved delivery addresses.",
  robots: { index: false, follow: false },
};

export default async function AddressesPage() {
  const user = await requireUser("/account/addresses");
  const addresses = await listAddresses(user.id);

  return (
    <div>
      <header>
        <p className="text-[11px] uppercase tracking-[0.38em] text-gold-muted">
          Addresses
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
          Where we send things
        </h1>
        <span className="mt-6 block h-px w-16 bg-gold" aria-hidden />
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-charcoal/70">
          Saved addresses are offered at checkout, so you never type one twice. Your
          default is used first.
        </p>
      </header>

      <div className="mt-12">
        <AddressBook
          initialAddresses={addresses}
          maxAddresses={siteConfig.commerce.maxAddresses}
          defaultCountry="India"
        />
      </div>
    </div>
  );
}
