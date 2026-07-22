import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";

export const metadata: Metadata = {
  title: "Refunds",
  description: "ZEDX refund policy information for UAE shoppers.",
};

export default function RefundsPage() {
  return (
    <InfoPage
      eyebrow="Policy"
      title="Refunds"
      description="Refund timing and payment-channel rules should be confirmed before launch."
      sections={[
        {
          title: "Refund method",
          body: "Refunds should be processed through the original payment channel once ZEDX confirms payment providers and approval rules.",
        },
        {
          title: "Processing timing",
          body: "Do not publish a fixed refund timeline until bank, wallet, COD, and gateway workflows are verified.",
        },
      ]}
    />
  );
}
