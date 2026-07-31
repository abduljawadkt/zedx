import type { Metadata } from "next";
import { AdminConsole } from "@/components/admin/AdminConsole";
import { getCategories, getCollections, getHomepageSections, getProducts, getSiteSettings } from "@/lib/backend/catalog";

export const metadata: Metadata = {
  title: "Admin Preview",
};

export default async function AdminPage() {
  const [categories, collections, homepageSections, products, siteSettings] = await Promise.all([
    getCategories(),
    getCollections(),
    getHomepageSections(),
    getProducts({ sort: "featured" }),
    getSiteSettings(),
  ]);

  return (
    <AdminConsole
      categories={categories}
      collections={collections}
      homepageSections={homepageSections}
      products={products}
      siteSettings={siteSettings}
    />
  );
}
