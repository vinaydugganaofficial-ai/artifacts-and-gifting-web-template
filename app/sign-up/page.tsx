import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { redirectIfSignedIn, safeReturnPath } from "@/lib/auth/guard";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an Aaranya account with your mobile number.",
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
      eyebrow="The Atelier"
      title="Create an account."
      description="Your name and a mobile number is all it takes. We will send a one-time code to confirm the number is yours."
      image={{
        src: "/images/gallery/packaging.jpg",
        alt: "A brass piece wrapped in cloth inside an open wooden box",
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
