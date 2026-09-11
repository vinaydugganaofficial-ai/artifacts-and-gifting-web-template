import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPolicy } from "@/lib/services/content.service";
import { PolicyPage } from "@/components/shared/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What this site collects, why, how long it is kept, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const policy = await getPolicy("privacy");
  if (!policy) notFound();

  return <PolicyPage policy={policy} />;
}
