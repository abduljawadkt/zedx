import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about ZEDX products and shopping.",
};

export default function FaqPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Frequently asked questions"
      description="Answers for common ZEDX shopping, product, warranty, and delivery questions."
      sections={[
        {
          title: "Which ZEDX product should I choose?",
          body: "Start with your use case: audio for calls and music, power banks for travel, GaN chargers for multi-device charging, and mounts for car or desk visibility.",
        },
        {
          title: "Are reviews and ratings verified?",
          body: "Ratings are not shown until ZEDX confirms a real review source and collection process.",
        },
      ]}
    />
  );
}
