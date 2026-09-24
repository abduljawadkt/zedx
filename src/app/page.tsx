import type { Metadata } from "next";
import { getProducts, getProductsByHandles, NEW_ARRIVAL_HANDLES } from "@/lib/backend/catalog";
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
  const [featured, curatedArrivals, newestAll] = await Promise.all([
    getProducts({ sort: "featured", limit: 4 }) as Promise<Product[]>,
    getProductsByHandles(NEW_ARRIVAL_HANDLES),
    getProducts({ sort: "newest", limit: 40 }) as Promise<Product[]>,
  ]);

  // New Arrivals: the curated picks (NEW_ARRIVAL_HANDLES), pulled live from the
  // backend. If any curated handle is unavailable, top up with the newest
  // products across distinct categories so the row always shows four items.
  const newArrivals: Product[] = [...curatedArrivals];
  if (newArrivals.length < 4) {
    const seenIds = new Set(newArrivals.map((product) => product.id));
    const seenCategories = new Set(newArrivals.map((product) => product.categorySlug));
    for (const product of newestAll) {
      if (seenIds.has(product.id) || seenCategories.has(product.categorySlug)) continue;
      seenIds.add(product.id);
      seenCategories.add(product.categorySlug);
      newArrivals.push(product);
      if (newArrivals.length >= 4) break;
    }
  }

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
