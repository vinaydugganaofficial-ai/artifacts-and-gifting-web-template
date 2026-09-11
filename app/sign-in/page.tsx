import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";
import { redirectIfSignedIn, safeReturnPath } from "@/lib/auth/guard";
import { DEMO_PHONE } from "@/lib/data/seed";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Aaranya account with your mobile number.",
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

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await redirectIfSignedIn();

  const params = await searchParams;
  // Validated so `?next=` cannot be turned into an open redirect.
  const returnTo = safeReturnPath(readParam(params, "next"));
  const registered = readParam(params, "registered") === "1";

  return (
    <AuthShell
      eyebrow="The Atelier"
      title="Welcome back."
      description="Enter your mobile number and we will send you a one-time code. No password to remember."
      image={{
        src: "/images/gallery/interior.jpg",
        alt: "A brass sculpture in a quiet interior",
      }}
      footer={{
        prompt: "No account yet?",
        href: `/sign-up?next=${encodeURIComponent(returnTo)}`,
        label: "Create one",
      }}
    >
      <SignInForm
        returnTo={returnTo}
        countryCodes={siteConfig.auth.countryCodes}
        defaultCountryCode={siteConfig.auth.defaultCountryCode}
        notice={registered ? "Your account is ready. Sign in to continue." : undefined}
        demoPhone={process.env.NODE_ENV !== "production" ? DEMO_PHONE : undefined}
      />
    </AuthShell>
  );
}
