import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";
import { storefrontConfig } from "@/config/storefront";

export const metadata: Metadata = {
  title: "Support",
  description: "Contact ZEDX support for product and order help.",
};

export default function SupportPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="ZEDX Support"
      description="Get help choosing products, understanding order status, or preparing a warranty-support request."
      sections={[
        {
          title: "Email",
          body: `Use ${storefrontConfig.contactEmail} until ZEDX confirms the final support email for the live domain.`,
        },
        {
          title: "Product help",
          body: "Include the product name, category, use case, and budget so support can recommend a suitable ZEDX option.",
        },
      ]}
    />
  );
}
