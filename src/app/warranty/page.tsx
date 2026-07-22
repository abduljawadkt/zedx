import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";
import { storefrontConfig } from "@/config/storefront";

export const metadata: Metadata = {
  title: "Warranty Support",
  description: "ZEDX warranty-support information for Dubai and UAE shoppers.",
};

export default function WarrantyPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Warranty support"
      description={storefrontConfig.warranty.description}
      sections={[
        {
          title: "Coverage pending client confirmation",
          body: "ZEDX should confirm the official warranty duration, covered faults, excluded damage, service channel, and proof-of-purchase requirements before launch.",
        },
        {
          title: "How to prepare a request",
          body: "Keep your order details, product name, and photos or videos of the issue ready before contacting support.",
        },
      ]}
    />
  );
}
