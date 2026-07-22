import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ZEDX privacy information and data-use summary.",
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="This demo page outlines the privacy sections ZEDX should finalize before collecting customer data."
      sections={[
        {
          title: "Information collected",
          body: "Final policy should describe account data, order data, support messages, analytics, cookies, and payment-provider data handling.",
        },
        {
          title: "Customer rights",
          body: "ZEDX should publish contact details and request handling steps for access, correction, and deletion requests.",
        },
      ]}
    />
  );
}
