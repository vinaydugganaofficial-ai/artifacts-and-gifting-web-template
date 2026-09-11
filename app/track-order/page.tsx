import type { Metadata } from "next";

import { TrackOrderForm } from "@/components/orders/TrackOrderForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { getCurrentUser } from "@/lib/services/auth.service";
import { tokens } from "@/config/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Track an order",
  description:
    "Follow an Aaranya order from the workshop to your door using your order number.",
  alternates: { canonical: "/track-order" },
};

export default async function TrackOrderPage() {
  // Signed-in visitors get their number pre-filled; guests type it themselves.
  const user = await getCurrentUser();

  return (
    <section className={cn(tokens.gutter, tokens.pageTop, tokens.pageBottom)}>
      <div className={tokens.container}>
        <PageHeader
          eyebrow="Orders"
          title="Track an order."
          description="Enter your order number and the mobile number it was placed with. Both are on your confirmation."
        />

        <TrackOrderForm defaultPhone={user?.phone ?? ""} />
      </div>
    </section>
  );
}
