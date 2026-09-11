import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPolicy } from "@/lib/services/content.service";
import { PolicyPage } from "@/components/shared/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "How pieces travel from the Viraasat atelier — dispatch times, bespoke gift packaging, transit windows, and white-glove courier handling.",
  alternates: { canonical: "/shipping" },
};

export default async function ShippingPage() {
  const policy = await getPolicy("shipping");
  if (!policy) notFound();

  return <PolicyPage policy={policy} />;
}
