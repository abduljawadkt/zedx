import { z } from "zod";

export const slugSchema = z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const productWriteSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  slug: slugSchema,
  sku: z.string().min(1).optional().nullable(),
  category: z.string().min(1),
  categorySlug: slugSchema,
  collection: z.string().min(1),
  price: z.number().int().nonnegative(),
  oldPrice: z.number().int().nonnegative(),
  currency: z.string().min(1),
  badge: z.string().min(1),
  color: z.string().min(1),
  image: z.string().min(1),
  gallery: z.array(z.string().min(1)).default([]),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  specs: z.array(z.string().min(1)).default([]),
  highlights: z.array(z.string().min(1)).default([]),
  published: z.boolean().optional().default(true),
  status: z.enum(["draft", "published", "archived"]).optional().default("published"),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const categoryWriteSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  accent: z.enum(["blue", "violet", "green", "silver"]),
  collection: z.string().min(1),
  image: z.string().min(1),
  productCount: z.number().int().nonnegative().optional().default(0),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const collectionWriteSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  productCount: z.number().int().nonnegative().optional().default(0),
  featured: z.boolean(),
  sortOrder: z.number().int().optional().default(0),
});

export const homepageSectionWriteSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["hero", "category-strip", "product-story", "trending", "brand-experience"]),
  title: z.string().min(1),
  enabled: z.boolean(),
  sortOrder: z.number().int(),
});

export const seoWriteSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  openGraphImage: z.string().min(1).optional().nullable(),
  canonicalPath: z.string().min(1),
  robots: z.enum(["index,follow", "noindex,nofollow"]),
});

export const redirectWriteSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  status: z.number().int().min(300).max(308),
});

export const siteSettingsWriteSchema = z.object({
  brandName: z.string().min(1),
  tagline: z.string().min(1),
  announcement: z.string().min(1),
  currency: z.string().min(1),
  seo: seoWriteSchema,
  socialLinks: z.array(z.object({ label: z.string().min(1), href: z.string().min(1) })),
});
