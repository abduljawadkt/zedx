import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about ZEDX premium mobile accessories, chargers, power banks, audio, and smart devices for Dubai and UAE shoppers.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-20 text-white sm:px-8">
      <p className="text-sm font-semibold text-[var(--brand-blue-soft)]">About ZEDX</p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">
        Premium mobile accessories for modern UAE lifestyles.
      </h1>
      <p className="mt-6 text-lg leading-8 text-white/60">
        ZEDX focuses on practical everyday technology: wireless audio, power banks, fast chargers, smart wearables,
        car mounts, charging cables, and mobile accessories for customers in Dubai and across the UAE.
      </p>
      <p className="mt-5 text-lg leading-8 text-white/56">
        The brand experience is built around clear product discovery, strong product imagery, transparent pricing,
        and support content that avoids unverified claims until warranty, delivery, reviews, and payment methods are
        formally confirmed.
      </p>
    </main>
  );
}
