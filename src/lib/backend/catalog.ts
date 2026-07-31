import { prisma } from "@/lib/backend/prisma";
import { seedDatabaseIfNeeded } from "@/lib/backend/seed";
import type { Category, Collection, DashboardSummary, HomepageSection, Product, ProductQuery, SeoMetadata, SiteSettings } from "@/lib/backend/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseJsonArray(value: string | null | undefined) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function mapProduct(row: {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  category: string;
  categorySlug: string;
  collection: string;
  price: number;
  oldPrice: number;
  currency: string;
  badge: string;
  color: string;
  image: string;
  galleryJson: string;
  shortDescription: string;
  description: string;
  specsJson: string;
  highlightsJson: string;
  published?: boolean;
  status?: string;
  featured?: boolean;
  sortOrder?: number;
}): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku ?? null,
    category: row.category,
    categorySlug: row.categorySlug,
    collection: row.collection,
    price: row.price,
    oldPrice: row.oldPrice,
    currency: row.currency,
    badge: row.badge,
    color: row.color,
    image: row.image,
    gallery: parseJsonArray(row.galleryJson),
    shortDescription: row.shortDescription,
    description: row.description,
    specs: parseJsonArray(row.specsJson),
    highlights: parseJsonArray(row.highlightsJson),
    published: row.published ?? true,
    status: row.status === "draft" || row.status === "archived" ? row.status : "published",
    featured: row.featured ?? false,
    sortOrder: row.sortOrder ?? 0,
  };
}

function mapCategory(row: {
  slug: string;
  name: string;
  description: string;
  accent: string;
  collection: string;
  image: string;
  productCount: number;
  featured?: boolean;
  sortOrder?: number;
}): Category {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    accent: row.accent as Category["accent"],
    collection: row.collection,
    image: row.image,
    productCount: row.productCount,
    featured: row.featured ?? false,
    sortOrder: row.sortOrder ?? 0,
  };
}

function mapCollection(row: {
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
  sortOrder?: number;
}): Collection {
  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    description: row.description,
    image: row.image,
    productCount: row.productCount,
    featured: row.featured,
    sortOrder: row.sortOrder ?? 0,
  };
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
  await seedDatabaseIfNeeded();

  const rows = await prisma.product.findMany({
    where: {
      published: true,
      status: "published",
      ...(category ? { categorySlug: category } : {}),
      ...(badge ? { badge } : {}),
      ...(typeof minPrice === "number" || typeof maxPrice === "number"
        ? {
            price: {
              ...(typeof minPrice === "number" ? { gte: minPrice } : {}),
              ...(typeof maxPrice === "number" ? { lte: maxPrice } : {}),
            },
          }
        : {}),
    },
    orderBy:
      sort === "price-asc"
        ? [{ price: "asc" }]
        : sort === "price-desc"
          ? [{ price: "desc" }]
          : sort === "name"
            ? [{ name: "asc" }]
            : sort === "newest"
              ? [{ createdAt: "desc" }]
              : [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  let items = rows.map(mapProduct);

  if (collection) {
    items = items.filter((product) => slugify(product.collection) === collection);
  }

  if (search) {
    const query = search.toLowerCase();
    items = items.filter((product) =>
      [
        product.name,
        product.sku,
        product.category,
        product.collection,
        product.badge,
        product.color,
        product.shortDescription,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export async function getProduct(slug: string) {
  await seedDatabaseIfNeeded();
  const product = await prisma.product.findFirst({
    where: {
      slug,
      published: true,
      status: "published",
    },
  });

  return product ? mapProduct(product) : null;
}

export async function getCategories() {
  await seedDatabaseIfNeeded();
  const [rows, products] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.product.findMany({ where: { published: true, status: "published" }, select: { categorySlug: true } }),
  ]);

  return rows.map((row) =>
    mapCategory({
      ...row,
      productCount: products.filter((product) => product.categorySlug === row.slug).length,
    }),
  );
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((category) => category.slug === slug) ?? null;
}

export async function getCollections() {
  await seedDatabaseIfNeeded();
  const [rows, products] = await Promise.all([
    prisma.collection.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.product.findMany({ where: { published: true, status: "published" }, select: { collection: true } }),
  ]);

  return rows.map((row) =>
    mapCollection({
      ...row,
      productCount: products.filter((product) => slugify(product.collection) === row.slug).length,
    }),
  );
}

export async function getCollection(slug: string) {
  return (await getCollections()).find((collection) => collection.slug === slug) ?? null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await seedDatabaseIfNeeded();
  const settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });

  if (!settings) {
    return {
      brandName: "ZEDX",
      tagline: "Premium gadgets and accessories for modern everyday setups.",
      announcement: "Catalog database is ready for merchandising.",
      currency: "AED",
      seo: {
        title: "ZEDX Premium Tech Store",
        description: "A premium ecommerce launch experience for audio, power, wearables, tablets, and accessories.",
        openGraphImage: "/brand/zedx-logo-transparent.png",
        canonicalPath: "/",
        robots: "index,follow",
      },
      socialLinks: [],
    };
  }

  return {
    brandName: settings.brandName,
    tagline: settings.tagline,
    announcement: settings.announcement,
    currency: settings.currency,
    seo: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      openGraphImage: settings.openGraphImage,
      canonicalPath: settings.canonicalPath,
      robots: settings.robots as SeoMetadata["robots"],
    },
    socialLinks: parseSocialLinks(settings.socialLinksJson),
  };
}

function parseSocialLinks(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is { label: string; href: string } =>
        typeof item?.label === "string" && typeof item?.href === "string",
    );
  } catch {
    return [];
  }
}

export async function getHomepageSections() {
  await seedDatabaseIfNeeded();
  const rows = await prisma.homepageSection.findMany({
    where: { enabled: true },
    orderBy: { sortOrder: "asc" },
  });

  return rows.map((row) => ({
    id: row.id,
    type: row.type as HomepageSection["type"],
    title: row.title,
    enabled: row.enabled,
    sortOrder: row.sortOrder,
  }));
}

export async function getEntitySeo(entityType: "product" | "category" | "collection", slug: string) {
  await seedDatabaseIfNeeded();
  const saved = await prisma.seoMetadata.findUnique({
    where: {
      entityType_entitySlug: {
        entityType,
        entitySlug: slug,
      },
    },
  });

  if (saved) {
    return {
      title: saved.title,
      description: saved.description,
      openGraphImage: saved.openGraphImage ?? undefined,
      canonicalPath: saved.canonicalPath,
      robots: saved.robots as SeoMetadata["robots"],
    } satisfies SeoMetadata;
  }

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

export async function getDashboardSummary(): Promise<DashboardSummary> {
  await seedDatabaseIfNeeded();
  const [products, categories, collections, redirects, inventory] = await Promise.all([
    prisma.product.findMany(),
    prisma.category.findMany(),
    prisma.collection.findMany(),
    prisma.redirect.count(),
    prisma.inventoryItem.findMany(),
  ]);

  return {
    products: {
      total: products.length,
      featured: products.filter((product) => product.featured).length,
      missingImages: products.filter((product) => !product.image).length,
      missingAltText: 0,
    },
    categories: {
      total: categories.length,
    },
    collections: {
      total: collections.length,
      featured: collections.filter((collection) => collection.featured).length,
    },
    seo: {
      missingMetaDescriptions: products.filter((product) => product.shortDescription.length < 24).length,
      redirectRules: redirects,
    },
    inventory: {
      lowStock: inventory.filter((item) => item.quantity - item.reserved <= item.lowStockAt).length,
      trackedSkus: inventory.length,
    },
    nextBuildModules: [
      "Database-backed catalog",
      "Admin product management",
      "Collection merchandising",
      "Inventory-ready SKUs",
    ],
  };
}
