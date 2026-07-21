import { categories, getCategoryBySlug } from "@/data/categories";
import { getProductBySlug, products } from "@/data/products";
import type { HomepageSection, ProductQuery, SeoMetadata } from "@/lib/backend/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getProducts({
  badge,
  category,
  collection,
  limit,
  maxPrice,
  minPrice,
  search,
  sort = "featured",
}: ProductQuery = {}) {
  let items = products;

  if (search) {
    const query = search.toLowerCase();
    items = items.filter((product) =>
      [
        product.name,
        product.category,
        product.collection,
        product.badge,
        product.color,
        product.shortDescription,
        product.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  if (category) {
    items = items.filter((product) => product.categorySlug === category);
  }

  if (collection) {
    items = items.filter((product) => slugify(product.collection) === collection);
  }

  if (badge) {
    items = items.filter((product) => product.badge.toLowerCase() === badge.toLowerCase());
  }

  if (typeof minPrice === "number") {
    items = items.filter((product) => product.price >= minPrice);
  }

  if (typeof maxPrice === "number") {
    items = items.filter((product) => product.price <= maxPrice);
  }

  items = [...items].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "newest") return b.id.localeCompare(a.id);
    return Number(b.badge === "Premium") - Number(a.badge === "Premium");
  });

  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export async function getProduct(slug: string) {
  return getProductBySlug(slug);
}

export async function getCategory(slug: string) {
  return getCategoryBySlug(slug);
}

export async function getCategories() {
  return categories;
}

export async function getCollections() {
  const names = Array.from(new Set(products.map((product) => product.collection)));

  return names.map((name) => {
    const collectionProducts = products.filter((product) => product.collection === name);
    const heroProduct = collectionProducts[0] ?? products[0];

    return {
      id: slugify(name),
      slug: slugify(name),
      name,
      description: `A focused ZEDX ${name.toLowerCase()} selection for premium demo shopping journeys.`,
      image: heroProduct.image,
      productCount: collectionProducts.length,
      featured: collectionProducts.length > 2,
    };
  });
}

export async function getCollection(slug: string) {
  return (await getCollections()).find((collection) => collection.slug === slug);
}

export async function getSiteSettings() {
  return {
    brandName: "ZEDX",
    tagline: "Premium gadgets and accessories for modern everyday setups.",
    announcement: "Frontend demo preview. Catalog, cart, and UI flows use mock data.",
    currency: "AED",
    seo: {
      title: "ZEDX Premium Tech Store",
      description: "A premium ecommerce launch experience for audio, power, wearables, tablets, and accessories.",
      openGraphImage: "/cropped-zedx-logo-1.webp",
      canonicalPath: "/",
      robots: "index,follow",
    } satisfies SeoMetadata,
    socialLinks: [],
  };
}

export async function getHomepageSections() {
  return [
    { id: "hero", type: "hero", title: "Launch hero", enabled: true, sortOrder: 10 },
    { id: "category-strip", type: "category-strip", title: "Category strip", enabled: true, sortOrder: 20 },
    { id: "product-story", type: "product-story", title: "Scroll product story", enabled: true, sortOrder: 30 },
    { id: "trending", type: "trending", title: "Trending products", enabled: true, sortOrder: 40 },
    { id: "brand-experience", type: "brand-experience", title: "Brand experience", enabled: true, sortOrder: 50 },
  ] satisfies HomepageSection[];
}

export async function getEntitySeo(entityType: "product" | "category" | "collection", slug: string) {
  const entity =
    entityType === "product"
      ? await getProduct(slug)
      : entityType === "category"
        ? await getCategory(slug)
        : await getCollection(slug);

  if (!entity) return undefined;

  const description = "shortDescription" in entity ? entity.shortDescription : entity.description;

  return {
    title: entity.name,
    description,
    openGraphImage: "image" in entity ? entity.image : undefined,
    canonicalPath: `/${entityType === "product" ? "products" : `${entityType}s`}/${slug}`,
    robots: "index,follow",
  } satisfies SeoMetadata;
}

export async function getDashboardSummary() {
  return {
    products: {
      total: products.length,
      featured: products.filter((product) => ["Premium", "Best Seller", "Client Pick"].includes(product.badge)).length,
      missingImages: products.filter((product) => !product.image).length,
      missingAltText: 0,
    },
    categories: {
      total: categories.length,
    },
    collections: {
      total: (await getCollections()).length,
      featured: (await getCollections()).filter((collection) => collection.featured).length,
    },
    seo: {
      missingMetaDescriptions: products.filter((product) => product.shortDescription.length < 24).length,
      redirectRules: 0,
    },
    inventory: {
      lowStock: 0,
      trackedSkus: products.length,
    },
    nextBuildModules: [
      "Frontend-only mock catalog",
      "Responsive product presentation",
      "Cart/search overlays",
      "Premium launch-page interactions",
    ],
  };
}
