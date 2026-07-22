import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";

export const metadata: Metadata = {
  title: "Track Order",
  description: "ZEDX order tracking information.",
};

export default function TrackOrderPage() {
  return (
    <InfoPage
      eyebrow="Orders"
      title="Track order"
      description="Live tracking should be connected after ZEDX confirms fulfilment and courier workflows."
      sections={[
        {
          title: "Tracking pending integration",
          body: "This frontend demo does not connect to live courier systems. After backend integration, customers should be able to search by order number and email or phone.",
        },
        {
          title: "Support",
          body: "Until tracking is integrated, order questions should be routed through the confirmed ZEDX support channel.",
        },
      ]}
    />
  );
}
