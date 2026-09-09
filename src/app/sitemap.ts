import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
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
