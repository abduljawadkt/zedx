import type { Metadata } from "next";
import { BrandExperience } from "@/components/home/BrandExperience";
import { CategoryUniverse } from "@/components/home/CategoryUniverse";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { ImmersiveProductStories } from "@/components/home/ImmersiveProductStories";
import { StickyProductStory } from "@/components/home/StickyProductStory";
import { TrendingProducts } from "@/components/home/TrendingProducts";

export const metadata: Metadata = {
  title: "ZEDX Premium Tech",
  description:
    "Explore premium ZEDX audio, power, wearables, tablets, mounts, cables, and everyday tech accessories.",
};

export default function Home() {
  return (
    <main className="flex-1 -mt-[5rem]">
      <Hero />
      <CategoryStrip />
      <ImmersiveProductStories />
      <StickyProductStory />
      <TrendingProducts />
      <CategoryUniverse />
      <BrandExperience />
      <FinalCTA />
    </main>
  );
}
