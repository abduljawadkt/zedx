import type { Metadata } from "next";
import { CategoryProductsPage } from "@/components/product/CategoryProductsPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getGroupAsCategory, getProductsForGroup } from "@/lib/productDisplay";
import { breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Power",
  description: "Explore ZEDX chargers, power banks, adapters, car power, and charging cables.",
  alternates: {
    canonical: "/collections/power",
  },
};

export default function PowerCollectionPage() {
  const category = getGroupAsCategory("power");

  return (
    <>
      <StructuredData
        data={[
          collectionJsonLd(category, "/collections/power"),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: "Power", path: "/collections/power" },
          ]),
        ]}
      />
      <CategoryProductsPage category={category} products={getProductsForGroup("power")} />
    </>
  );
}
