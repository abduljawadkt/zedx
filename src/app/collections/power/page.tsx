import type { Metadata } from "next";
import { CategoryProductsPage } from "@/components/product/CategoryProductsPage";
import { getGroupAsCategory, getProductsForGroup } from "@/lib/productDisplay";

export const metadata: Metadata = {
  title: "Power",
  description: "Explore ZEDX chargers, power banks, adapters, car power, and charging cables.",
};

export default function PowerCollectionPage() {
  return (
    <CategoryProductsPage
      category={getGroupAsCategory("power")}
      products={getProductsForGroup("power")}
    />
  );
}
