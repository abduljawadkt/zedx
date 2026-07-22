import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";

export const metadata: Metadata = {
  title: "Returns",
  description: "ZEDX returns information for UAE shoppers.",
};

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Policy"
      title="Returns"
      description="Return conditions should be finalized by ZEDX before launch."
      sections={[
        {
          title: "Return window pending confirmation",
          body: "ZEDX should confirm return window, eligible products, sealed-product rules, inspection process, and restocking conditions.",
        },
        {
          title: "Before requesting a return",
          body: "Keep the product, packaging, accessories, and order details ready. Do not ship items back until ZEDX confirms the support process.",
        },
      ]}
    />
  );
}
