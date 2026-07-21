import type { Metadata } from "next";
import { AdminConsole } from "@/components/admin/AdminConsole";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { getCollections, getHomepageSections, getSiteSettings } from "@/lib/backend/catalog";

export const metadata: Metadata = {
  title: "Admin Preview",
};

export default async function AdminPage() {
  const [collections, homepageSections, siteSettings] = await Promise.all([
    getCollections(),
    getHomepageSections(),
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
