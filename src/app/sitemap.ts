import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/backend/catalog";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
  ]);

  return [
    "",
    "/products",
    "/collections",
    "/collections/audio",
    "/collections/power",
    "/collections/accessories",
    "/about",
    "/contact",
    "/support",
    "/faq",
    "/warranty",
    "/shipping",
    "/returns",
    "/refunds",
    "/privacy",
    "/terms",
    "/track-order",
    ...categories.map((category) => `/categories/${category.slug}`),
    ...products.map((product) => `/products/${product.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
