import type { Metadata } from "next";
import { CategoryProductsPage } from "@/components/product/CategoryProductsPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getProducts } from "@/lib/backend/catalog";
import { productGroups } from "@/lib/productDisplay";
import { breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import type { Category } from "@/data/categories";

export const metadata: Metadata = {
  title: "Accessories",
  description: "Explore ZEDX wearables, car mounts, and polished everyday setup accessories.",
  alternates: {
    canonical: "/collections/accessories",
  },
};

// "Accessories" has no single Medusa collection; build it live from the catalog
// using the curated accessories grouping (categories + collections).
export default async function AccessoriesCollectionPage() {
  const group = productGroups.accessories;
  const collectionsLower = group.collections.map((c) => c.toLowerCase());
  const all = await getProducts();
  const products = all.filter(
    (product) =>
      group.categorySlugs.includes(product.categorySlug) ||
      collectionsLower.includes((product.collection ?? "").toLowerCase()),
  );

  const category: Category = {
    slug: "accessories",
    name: group.name,
    description: group.description,
    accent: "blue",
    collection: group.eyebrow,
    image: products[0]?.image ?? "/hero-animation/dock.png",
    productCount: products.length,
  };

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
      <CategoryProductsPage category={category} products={products} />
    </>
  );
}
