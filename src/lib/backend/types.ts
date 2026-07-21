import type { Category as DataCategory } from "@/data/categories";
import type { Product as DataProduct } from "@/data/products";

export type Category = DataCategory;
export type Product = DataProduct;

export type ApiMeta = {
  mode: "database";
  generatedAt: string;
};

export type ApiResponse<T> = {
  data: T;
  meta: ApiMeta;
};

export type ProductQuery = {
  search?: string;
  category?: string;
  collection?: string;
  badge?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "newest" | "price-asc" | "price-desc" | "name";
  limit?: number;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
};

export type SeoMetadata = {
  title: string;
  description: string;
  openGraphImage?: string;
  canonicalPath: string;
  robots: "index,follow" | "noindex,nofollow";
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  announcement: string;
  currency: string;
  seo: SeoMetadata;
  socialLinks: Array<{
    label: string;
    href: string;
  }>;
};

export type HomepageSection = {
  id: string;
  type: "hero" | "category-strip" | "product-story" | "trending" | "brand-experience";
  title: string;
  enabled: boolean;
  sortOrder: number;
};

export type DashboardSummary = {
  products: {
    total: number;
    featured: number;
    missingImages: number;
    missingAltText: number;
  };
  categories: {
    total: number;
  };
  collections: {
    total: number;
    featured: number;
  };
  seo: {
    missingMetaDescriptions: number;
    redirectRules: number;
  };
  inventory: {
    lowStock: number;
    trackedSkus: number;
  };
  nextBuildModules: string[];
};

export type BackendEntity = Product | Category | Collection;

export type OrderSummary = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  paymentMethod: string;
  currency: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: "pending" | "paid" | "processing" | "fulfilled" | "cancelled";
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    productSlug: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
};
