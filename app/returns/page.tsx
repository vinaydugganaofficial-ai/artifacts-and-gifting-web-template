import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPolicy } from "@/lib/services/content.service";
import { PolicyPage } from "@/components/shared/PolicyPage";

export const metadata: Metadata = {
  title: "Returns",
  description:
    "Aaranya's returns window, what counts as a fault in a hand-cast piece, and how transit damage is handled.",
  alternates: { canonical: "/returns" },
};

export default async function ReturnsPage() {
  const policy = await getPolicy("returns");
  if (!policy) notFound();

  return <PolicyPage policy={policy} />;
}
