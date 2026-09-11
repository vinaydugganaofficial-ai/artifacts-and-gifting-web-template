import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPolicy } from "@/lib/services/content.service";
import { PolicyPage } from "@/components/shared/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping",
  description:
    "How pieces travel from the Aaranya atelier — dispatch times, transit windows, duties and packaging.",
  alternates: { canonical: "/shipping" },
};

export default async function ShippingPage() {
  const policy = await getPolicy("shipping");
  if (!policy) notFound();

  return <PolicyPage policy={policy} />;
}
