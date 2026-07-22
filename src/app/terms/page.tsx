import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "ZEDX website and shopping terms.",
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms & Conditions"
      description="ZEDX should finalize these terms before accepting live orders."
      sections={[
        {
          title: "Website use",
          body: "Terms should define acceptable use, product information accuracy, pricing changes, order acceptance, and account responsibilities.",
        },
        {
          title: "Purchases",
          body: "Final terms should align with verified payment methods, delivery rules, returns, refunds, and warranty support.",
        },
      ]}
    />
  );
}
