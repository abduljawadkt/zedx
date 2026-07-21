import type { Metadata } from "next";
import { CategoryProductsPage } from "@/components/product/CategoryProductsPage";
import { getGroupAsCategory, getProductsForGroup } from "@/lib/productDisplay";

export const metadata: Metadata = {
  title: "Accessories",
  description: "Explore ZEDX mounts, wearables, tablets, and everyday setup accessories.",
};

export default function AccessoriesCollectionPage() {
  return (
    <CategoryProductsPage
      category={getGroupAsCategory("accessories")}
      products={getProductsForGroup("accessories")}
    />
  );
}
