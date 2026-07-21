import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-20 text-white sm:px-8">
      <p className="text-sm font-semibold text-[var(--brand-blue-soft)]">About ZEDX</p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">Premium tech, presented clearly.</h1>
      <p className="mt-6 text-lg leading-8 text-white/60">
        This frontend-only demo presents ZEDX audio, power, wearables, and accessories with a dark premium launch experience.
      </p>
    </main>
  );
}
