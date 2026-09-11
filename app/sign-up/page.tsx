import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { redirectIfSignedIn, safeReturnPath } from "@/lib/auth/guard";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Viraasat account with your mobile number to manage your heritage curations and bespoke gifting orders.",
  robots: { index: false, follow: true },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await redirectIfSignedIn();

  const params = await searchParams;
  const returnTo = safeReturnPath(readParam(params, "next"));

  return (
    <AuthShell
      eyebrow="The Concierge"
      title="Begin your journey with Viraasat."
      description="Save meaningful gifting curations, track handmade artifact commissions, and access our dedicated gifting concierge."
      image={{
        src: "/images/corporate-gifting.jpg",
        alt: "Artisanal heritage gift box with brass seal and handcrafted token",
      }}
      footer={{
        prompt: "Already have an account?",
        href: `/sign-in?next=${encodeURIComponent(returnTo)}`,
        label: "Sign in",
      }}
    >
      <SignUpForm
        returnTo={returnTo}
        countryCodes={siteConfig.auth.countryCodes}
        defaultCountryCode={siteConfig.auth.defaultCountryCode}
      />
    </AuthShell>
  );
}
