import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminConsole } from "@/components/admin/AdminConsole";
import { getCategories, getCollections, getHomepageSections, getProducts, getSiteSettings } from "@/lib/backend/catalog";
import { ADMIN_SESSION_COOKIE, getAdminSessionFromToken } from "@/lib/backend/session";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = await getAdminSessionFromToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");

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
