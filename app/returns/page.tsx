import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPolicy } from "@/lib/services/content.service";
import { PolicyPage } from "@/components/shared/PolicyPage";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description:
    "Viraasat's returns window, what counts as natural artisanal character in a hand-cast piece, and our transit damage replacement guarantee.",
  alternates: { canonical: "/returns" },
};

export default async function ReturnsPage() {
  const policy = await getPolicy("returns");
  if (!policy) notFound();

  return <PolicyPage policy={policy} />;
}
