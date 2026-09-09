import type { Metadata } from "next";
import { ProductsExplorer } from "@/components/product/ProductsExplorer";
import { getCategories, getCollections, getProducts } from "@/lib/backend/catalog";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore the ZEDX premium catalog across wireless audio, fast charging, wearables, mounts, and everyday accessories.",
  alternates: {
    canonical: "/products",
  },
};

export default async function ProductsPage() {
  const [products, categories, collections] = await Promise.all([
    getProducts(),
    getCategories(),
    getCollections(),
  ]);

  return (
    <ProductsExplorer
      categories={categories}
      collections={collections.map((collection) => collection.name)}
      products={products}
    />
  );
}
