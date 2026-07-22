import type { Category } from "@/data/categories";
import type { Product } from "@/data/products";
import { formatCategoryName, formatProductDescription, formatProductName } from "@/lib/productDisplay";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://zedx.vercel.app").replace(/\/$/, "");

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function productSeoDescription(product: Product) {
  const name = formatProductName(product.name);
  const category = formatCategoryName(product.category).toLowerCase();
  const price = `${product.currency} ${product.price}`;
  return `${name} is a ZEDX ${category} option for Dubai and UAE shoppers, with ${product.highlights
    .slice(0, 2)
    .join(", ")
    .toLowerCase()} and clear ${price} pricing.`;
}

export function categorySeoTitle(category: Category, products: Product[]) {
  const minPrice = products.length ? Math.min(...products.map((product) => product.price)) : 0;
  return `${category.name} in Dubai & UAE | ZEDX — ${products.length} Products from AED ${minPrice}`;
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: formatProductName(product.name),
    image: product.gallery.length
      ? product.gallery.map((image) => absoluteUrl(image))
      : [absoluteUrl(product.image)],
    description: productSeoDescription(product),
    brand: {
      "@type": "Brand",
      name: "ZEDX",
    },
    sku: product.id,
    category: formatCategoryName(product.category),
    color: product.color,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/products/${product.slug}`),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionJsonLd(category: Category, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: absoluteUrl(path),
    image: absoluteUrl(category.image),
  };
}
