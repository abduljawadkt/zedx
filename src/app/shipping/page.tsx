import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";
import { storefrontConfig } from "@/config/storefront";

export const metadata: Metadata = {
  title: "Shipping",
  description: "ZEDX UAE shipping information and delivery-support notes.",
};

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Delivery"
      title="Shipping in Dubai & UAE"
      description={storefrontConfig.shipping.description}
      sections={[
        {
          title: "Delivery SLA pending confirmation",
          body: "The live site should show one confirmed delivery promise across product pages, checkout, footer, and support pages.",
        },
        {
          title: "Order updates",
          body: "After shipping rules are finalized, this page should explain tracking, courier coverage, delivery fees, and support contacts.",
        },
      ]}
    />
  );
}
