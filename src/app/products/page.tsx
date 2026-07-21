import type { Metadata } from "next";
import { ProductsExplorer } from "@/components/product/ProductsExplorer";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore the full ZEDX frontend demo catalog.",
};

export default function ProductsPage() {
  return <ProductsExplorer />;
}
