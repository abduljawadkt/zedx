import type { Metadata } from "next";
import { CategoryProductsPage } from "@/components/product/CategoryProductsPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getGroupAsCategory, getProductsForGroup } from "@/lib/productDisplay";
import { breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Audio",
  description: "Explore ZEDX earbuds, headphones, neckbands, and speakers.",
  alternates: {
    canonical: "/collections/audio",
  },
};

export default function AudioCollectionPage() {
  const category = getGroupAsCategory("audio");

  return (
    <>
      <StructuredData
        data={[
          collectionJsonLd(category, "/collections/audio"),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: "Audio", path: "/collections/audio" },
          ]),
        ]}
      />
      <CategoryProductsPage category={category} products={getProductsForGroup("audio")} />
    </>
  );
}
