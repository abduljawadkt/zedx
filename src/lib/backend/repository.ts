import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { Category, Collection, HomepageSection, OrderSummary, SeoMetadata, SiteSettings } from "@/lib/backend/types";
import {
  getCollections,
  getDashboardSummary,
  getEntitySeo,
  getHomepageSections,
  getSiteSettings,
} from "@/lib/backend/catalog";

export async function ensureSeeded() {
  return { ok: true };
}

export { getCollections, getDashboardSummary, getEntitySeo, getHomepageSections, getSiteSettings };

export async function getOrders(): Promise<OrderSummary[]> {
  return [];
}

export async function upsertProduct(input: Partial<(typeof products)[number]> & { slug: string }) {
  return input;
}

export async function upsertCategory(input: Category) {
  return input;
}

export async function upsertCollection(input: Omit<Collection, "id"> & { id?: string }) {
  return {
    id: input.id ?? input.slug,
    ...input,
  };
}

export async function upsertHomepageSection(input: HomepageSection) {
  return input;
}

export async function upsertSeoMetadata(input: Omit<SeoMetadata, "openGraphImage"> & {
  entityType: "product" | "category" | "collection";
  entitySlug: string;
  openGraphImage?: string | null;
}) {
  return input;
}

export async function createRedirect(input: { from: string; to: string; status: number }) {
  return {
    id: "demo-redirect",
    ...input,
  };
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
  return {
    id: "demo-media",
    ...input,
  };
}

export async function updateSiteSettings(input: SiteSettings) {
  return input;
}

export async function getCategories() {
  return categories;
}

export async function getProduct(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getCollection(slug: string) {
  return (await getCollections()).find((collection) => collection.slug === slug) ?? null;
}
