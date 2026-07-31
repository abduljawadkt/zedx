import type { Metadata } from "next";
import { BrandExperience } from "@/components/home/BrandExperience";
import { CategoryUniverse } from "@/components/home/CategoryUniverse";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { HomeSeoContent } from "@/components/home/HomeSeoContent";
import { ImmersiveProductStories } from "@/components/home/ImmersiveProductStories";
import { StickyProductStory } from "@/components/home/StickyProductStory";
import { TrendingProducts } from "@/components/home/TrendingProducts";

export const metadata: Metadata = {
  title: "ZEDX UAE | Premium Mobile Accessories, Chargers, Power Banks & Smart Devices",
  description:
    "Shop premium ZEDX audio, fast charging, wearables, car mounts, cables, and refined everyday tech accessories.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ZEDX Premium Tech",
    description:
      "A cinematic ecommerce experience for premium ZEDX audio, power, wearables, mounts, and everyday accessories.",
    url: "/",
    images: ["/brand/zedx-logo-transparent.png"],
  },
};

export default function Home() {
  return (
    <main className="flex-1 -mt-[5rem]">
      <Hero />
      <CategoryStrip />
      <ImmersiveProductStories />
      <TrendingProducts />
      <StickyProductStory />
      <CategoryUniverse />
      <BrandExperience />
      <HomeSeoContent />
      <FinalCTA />
    </main>
  );
}
