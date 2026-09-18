import type { Metadata } from "next";
import { CategoryProductsPage } from "@/components/product/CategoryProductsPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getGroupAsCategory, getProductsForGroup } from "@/lib/productDisplay";
import { breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Accessories",
  description: "Explore ZEDX wearables, car mounts, and polished everyday setup accessories.",
  alternates: {
    canonical: "/collections/accessories",
  },
};

export default function AccessoriesCollectionPage() {
  const category = getGroupAsCategory("accessories");

  return (
    <>
      <StructuredData
        data={[
          collectionJsonLd(category, "/collections/accessories"),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: "Accessories", path: "/collections/accessories" },
          ]),
        ]}
      />
      <CategoryProductsPage category={category} products={getProductsForGroup("accessories")} />
    </>
  );
}
