import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPolicy } from "@/lib/services/content.service";
import { PolicyPage } from "@/components/shared/PolicyPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms on which Viraasat crafts, packages, and delivers artifacts and bespoke gifting curations.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const policy = await getPolicy("terms");
  if (!policy) notFound();

  return <PolicyPage policy={policy} />;
}
