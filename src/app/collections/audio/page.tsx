import type { Metadata } from "next";
import { CategoryProductsPage } from "@/components/product/CategoryProductsPage";
import { getGroupAsCategory, getProductsForGroup } from "@/lib/productDisplay";

export const metadata: Metadata = {
  title: "Audio",
  description: "Explore ZEDX earbuds, headphones, neckbands, and speakers.",
};

export default function AudioCollectionPage() {
  return (
    <CategoryProductsPage
      category={getGroupAsCategory("audio")}
      products={getProductsForGroup("audio")}
    />
  );
}
