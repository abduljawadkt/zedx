import type { MetadataRoute } from "next";
import { getCategories, getCollections, getProducts } from "@/lib/backend/catalog";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
    getCollections().catch(() => []),
  ]);

  return [
    "",
    "/products",
    "/collections",
    ...collections.map((collection) => `/collections/${collection.slug}`),
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
