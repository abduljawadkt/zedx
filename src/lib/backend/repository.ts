import { prisma } from "@/lib/backend/prisma";
import { seedDatabaseIfNeeded } from "@/lib/backend/seed";
import type { Category, Collection, HomepageSection, OrderSummary, SeoMetadata, SiteSettings } from "@/lib/backend/types";
import {
  getCategories,
  getCategory,
  getCollection,
  getCollections,
  getDashboardSummary,
  getEntitySeo,
  getHomepageSections,
  getProduct,
  getSiteSettings,
} from "@/lib/backend/catalog";
import type { Product } from "@/data/products";

function stringify(value: unknown) {
  return JSON.stringify(value);
}

function productSku(slug: string) {
  return slug.toUpperCase().replace(/[^A-Z0-9]/g, "-");
}

function toProductCreate(input: Partial<Product> & {
  id?: string;
  slug: string;
  sku?: string | null;
  published?: boolean;
  status?: string;
  featured?: boolean;
  sortOrder?: number;
}) {
  return {
    id: input.id ?? input.slug,
    name: input.name ?? input.slug,
    slug: input.slug,
    sku: input.sku || input.slug.toUpperCase().replace(/[^A-Z0-9]/g, "-"),
    category: input.category ?? "Uncategorized",
    categorySlug: input.categorySlug ?? "uncategorized",
    collection: input.collection ?? "General",
    price: input.price ?? 0,
    oldPrice: input.oldPrice ?? input.price ?? 0,
    currency: input.currency ?? "AED",
    badge: input.badge ?? "New",
    color: input.color ?? "Black",
    image: input.image ?? "/brand/zedx-logo-transparent.png",
    galleryJson: stringify(input.gallery ?? []),
    shortDescription: input.shortDescription ?? input.name ?? input.slug,
    description: input.description ?? input.shortDescription ?? input.name ?? input.slug,
    specsJson: stringify(input.specs ?? []),
    highlightsJson: stringify(input.highlights ?? []),
    published: input.published ?? input.status !== "draft",
    status: input.status ?? (input.published === false ? "draft" : "published"),
    featured: input.featured ?? false,
    sortOrder: input.sortOrder ?? 0,
  };
}

function toProductUpdate(input: Partial<Product> & {
  sku?: string | null;
  published?: boolean;
  status?: string;
  featured?: boolean;
  sortOrder?: number;
}) {
  return {
    ...("name" in input ? { name: input.name } : {}),
    ...("slug" in input ? { slug: input.slug } : {}),
    ...("sku" in input ? { sku: input.sku || null } : {}),
    ...("category" in input ? { category: input.category } : {}),
    ...("categorySlug" in input ? { categorySlug: input.categorySlug } : {}),
    ...("collection" in input ? { collection: input.collection } : {}),
    ...("price" in input ? { price: input.price } : {}),
    ...("oldPrice" in input ? { oldPrice: input.oldPrice } : {}),
    ...("currency" in input ? { currency: input.currency } : {}),
    ...("badge" in input ? { badge: input.badge } : {}),
    ...("color" in input ? { color: input.color } : {}),
    ...("image" in input ? { image: input.image } : {}),
    ...("gallery" in input ? { galleryJson: stringify(input.gallery ?? []) } : {}),
    ...("shortDescription" in input ? { shortDescription: input.shortDescription } : {}),
    ...("description" in input ? { description: input.description } : {}),
    ...("specs" in input ? { specsJson: stringify(input.specs ?? []) } : {}),
    ...("highlights" in input ? { highlightsJson: stringify(input.highlights ?? []) } : {}),
    ...("published" in input ? { published: input.published } : {}),
    ...("status" in input ? { status: input.status } : {}),
    ...("featured" in input ? { featured: input.featured } : {}),
    ...("sortOrder" in input ? { sortOrder: input.sortOrder } : {}),
  };
}

export async function ensureSeeded() {
  return seedDatabaseIfNeeded();
}

export { getCategories, getCategory, getCollection, getCollections, getDashboardSummary, getEntitySeo, getHomepageSections, getProduct, getSiteSettings };

export async function getOrders(): Promise<OrderSummary[]> {
  await ensureSeeded();
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    email: order.email,
    paymentMethod: order.paymentMethod,
    currency: order.currency,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    status: order.status as OrderSummary["status"],
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productSlug: item.productSlug,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
  }));
}

export async function upsertProduct(input: Partial<Product> & {
  slug: string;
  sku?: string | null;
  published?: boolean;
  status?: string;
  featured?: boolean;
  sortOrder?: number;
}) {
  await ensureSeeded();
  const create = toProductCreate(input);
  const update = toProductUpdate(input);
  const product = await prisma.product.upsert({
    where: { slug: input.slug },
    create,
    update,
  });
  await prisma.inventoryItem.upsert({
    where: { productId: product.id },
    create: {
      productId: product.id,
      sku: product.sku ?? productSku(product.slug),
      quantity: 0,
      reserved: 0,
      lowStockAt: 5,
    },
    update: {
      sku: product.sku ?? productSku(product.slug),
    },
  });

  await syncCategoryAndCollectionCounts(product.categorySlug, product.collection);
  return getProduct(product.slug);
}

export async function updateProductBySlug(slug: string, input: Partial<Product> & {
  sku?: string | null;
  published?: boolean;
  status?: string;
  featured?: boolean;
  sortOrder?: number;
}) {
  await ensureSeeded();
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (!existing) return null;
  const product = await prisma.product.update({
    where: { slug },
    data: toProductUpdate(input),
  });
  await prisma.inventoryItem.upsert({
    where: { productId: product.id },
    create: {
      productId: product.id,
      sku: product.sku ?? productSku(product.slug),
      quantity: 0,
      reserved: 0,
      lowStockAt: 5,
    },
    update: {
      sku: product.sku ?? productSku(product.slug),
    },
  });
  await syncCategoryAndCollectionCounts(existing.categorySlug, existing.collection);
  await syncCategoryAndCollectionCounts(product.categorySlug, product.collection);
  return getProduct(product.slug);
}

export async function deleteProduct(slug: string) {
  await ensureSeeded();
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (!existing) return false;
  await prisma.product.delete({ where: { slug } });
  await syncCategoryAndCollectionCounts(existing.categorySlug, existing.collection);
  return true;
}

export async function upsertCategory(input: Category & { featured?: boolean; sortOrder?: number }) {
  await ensureSeeded();
  const category = await prisma.category.upsert({
    where: { slug: input.slug },
    create: {
      slug: input.slug,
      name: input.name,
      description: input.description,
      accent: input.accent,
      collection: input.collection,
      image: input.image,
      productCount: input.productCount ?? 0,
      featured: input.featured ?? false,
      sortOrder: input.sortOrder ?? 0,
    },
    update: {
      name: input.name,
      description: input.description,
      accent: input.accent,
      collection: input.collection,
      image: input.image,
      featured: input.featured ?? false,
      sortOrder: input.sortOrder ?? 0,
    },
  });
  await syncCategoryAndCollectionCounts(category.slug);
  return getCategory(category.slug);
}

export async function updateCategoryBySlug(slug: string, input: Partial<Category> & { featured?: boolean; sortOrder?: number }) {
  await ensureSeeded();
  const category = await prisma.category.update({
    where: { slug },
    data: input,
  });
  await syncCategoryAndCollectionCounts(category.slug);
  return getCategory(category.slug);
}

export async function deleteCategory(slug: string) {
  await ensureSeeded();
  await prisma.product.updateMany({
    where: { categorySlug: slug },
    data: {
      category: "Uncategorized",
      categorySlug: "uncategorized",
    },
  });
  await prisma.category.delete({ where: { slug } });
  await syncCategoryAndCollectionCounts("uncategorized");
}

export async function upsertCollection(input: Omit<Collection, "id"> & { id?: string; sortOrder?: number }) {
  await ensureSeeded();
  const collection = await prisma.collection.upsert({
    where: { slug: input.slug },
    create: {
      slug: input.slug,
      name: input.name,
      description: input.description,
      image: input.image,
      productCount: input.productCount ?? 0,
      featured: input.featured,
      sortOrder: input.sortOrder ?? 0,
    },
    update: {
      name: input.name,
      description: input.description,
      image: input.image,
      featured: input.featured,
      sortOrder: input.sortOrder ?? 0,
    },
  });
  await syncCategoryAndCollectionCounts(undefined, collection.name);
  return getCollection(collection.slug);
}

export async function updateCollectionBySlug(slug: string, input: Partial<Omit<Collection, "id">> & { sortOrder?: number }) {
  await ensureSeeded();
  const existing = await prisma.collection.findUnique({ where: { slug } });
  if (!existing) return null;
  const collection = await prisma.collection.update({
    where: { slug },
    data: {
      ...("slug" in input ? { slug: input.slug } : {}),
      ...("name" in input ? { name: input.name } : {}),
      ...("description" in input ? { description: input.description } : {}),
      ...("image" in input ? { image: input.image } : {}),
      ...("productCount" in input ? { productCount: input.productCount } : {}),
      ...("featured" in input ? { featured: input.featured } : {}),
      ...("sortOrder" in input ? { sortOrder: input.sortOrder } : {}),
    },
  });
  await syncCategoryAndCollectionCounts(undefined, existing.name);
  await syncCategoryAndCollectionCounts(undefined, collection.name);
  return getCollection(collection.slug);
}

export async function deleteCollection(slug: string) {
  await ensureSeeded();
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection) return false;
  await prisma.product.updateMany({
    where: { collection: collection.name },
    data: { collection: "General" },
  });
  await prisma.collection.delete({ where: { slug } });
  await syncCategoryAndCollectionCounts(undefined, "General");
  return true;
}

async function syncCategoryAndCollectionCounts(categorySlug?: string, collectionName?: string) {
  if (categorySlug) {
    const productCount = await prisma.product.count({
      where: { categorySlug, published: true, status: "published" },
    });
    await prisma.category.updateMany({
      where: { slug: categorySlug },
      data: { productCount },
    });
  }

  if (collectionName) {
    const slug = collectionName
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const productCount = await prisma.product.count({
      where: { collection: collectionName, published: true, status: "published" },
    });
    await prisma.collection.updateMany({
      where: { slug },
      data: { productCount },
    });
  }
}

export async function upsertHomepageSection(input: HomepageSection) {
  await ensureSeeded();
  return prisma.homepageSection.upsert({
    where: { id: input.id },
    create: input,
    update: input,
  });
}

export async function upsertSeoMetadata(input: Omit<SeoMetadata, "openGraphImage"> & {
  entityType: "product" | "category" | "collection";
  entitySlug: string;
  openGraphImage?: string | null;
}) {
  await ensureSeeded();
  return prisma.seoMetadata.upsert({
    where: {
      entityType_entitySlug: {
        entityType: input.entityType,
        entitySlug: input.entitySlug,
      },
    },
    create: input,
    update: {
      title: input.title,
      description: input.description,
      openGraphImage: input.openGraphImage,
      canonicalPath: input.canonicalPath,
      robots: input.robots,
    },
  });
}

export async function createRedirect(input: { from: string; to: string; status: number }) {
  await ensureSeeded();
  return prisma.redirect.create({ data: input });
}

export async function createMediaAsset(input: {
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  sortOrder?: number;
  owner?: string | null;
}) {
  await ensureSeeded();
  return prisma.mediaAsset.create({ data: input });
}

export async function updateSiteSettings(input: SiteSettings) {
  await ensureSeeded();
  return prisma.siteSettings.upsert({
    where: { id: "site" },
    create: {
      id: "site",
      brandName: input.brandName,
      tagline: input.tagline,
      announcement: input.announcement,
      currency: input.currency,
      seoTitle: input.seo.title,
      seoDescription: input.seo.description,
      openGraphImage: input.seo.openGraphImage ?? "",
      canonicalPath: input.seo.canonicalPath,
      robots: input.seo.robots,
      socialLinksJson: stringify(input.socialLinks),
    },
    update: {
      brandName: input.brandName,
      tagline: input.tagline,
      announcement: input.announcement,
      currency: input.currency,
      seoTitle: input.seo.title,
      seoDescription: input.seo.description,
      openGraphImage: input.seo.openGraphImage ?? "",
      canonicalPath: input.seo.canonicalPath,
      robots: input.seo.robots,
      socialLinksJson: stringify(input.socialLinks),
    },
  });
}
