import type { Metadata } from "next";
import { getProducts } from "@/lib/backend/catalog";
import type { Product } from "@/data/products";
import { BrandExperience } from "@/components/home/BrandExperience";
import { CategoryUniverse } from "@/components/home/CategoryUniverse";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { HomeSeoContent } from "@/components/home/HomeSeoContent";
import { ImmersiveProductStories } from "@/components/home/ImmersiveProductStories";
import { StickyProductStory } from "@/components/home/StickyProductStory";
import { NewArrivals, TrendingProducts } from "@/components/home/TrendingProducts";

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

export default async function Home() {
  // Backend-driven selections from the live catalog (Medusa/DB) — no hardcoded SKUs.
  const [featured, newArrivals] = await Promise.all([
    getProducts({ sort: "featured", limit: 4 }) as Promise<Product[]>,
    getProducts({ sort: "newest", limit: 4 }) as Promise<Product[]>,
  ]);

  return (
    <main className="flex-1 -mt-[5rem]">
      <Hero />
      <CategoryStrip />
      <NewArrivals products={newArrivals} />
      <ImmersiveProductStories />
      <TrendingProducts products={featured} />
      <StickyProductStory />
      <CategoryUniverse />
      <BrandExperience />
      <HomeSeoContent />
      <FinalCTA />
    </main>
  );
}
