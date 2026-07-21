type MedusaConfig = {
  baseUrl: string;
  publishableApiKey: string;
};

type MedusaProductImage = {
  url?: string;
};

type MedusaProduct = {
  id: string;
  title?: string;
  handle?: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  images?: MedusaProductImage[];
  variants?: Array<{
    calculated_price?: {
      calculated_amount?: number;
      original_amount?: number;
      currency_code?: string;
    };
  }>;
  categories?: Array<{ handle?: string; name?: string }>;
  collection?: { handle?: string; title?: string; name?: string };
  tags?: Array<{ value?: string }>;
};

type MedusaListResponse<T> = {
  products?: T[];
  collections?: T[];
  categories?: T[];
  count?: number;
};

export function getMedusaConfig(): MedusaConfig | null {
  const baseUrl = process.env.MEDUSA_BACKEND_URL?.trim();
  const publishableApiKey = process.env.MEDUSA_PUBLISHABLE_API_KEY?.trim();

  if (!baseUrl || !publishableApiKey) {
    return null;
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    publishableApiKey,
  };
}

async function medusaFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const config = getMedusaConfig();
  if (!config) {
    throw new Error("Medusa is not configured.");
  }

  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      "x-publishable-api-key": config.publishableApiKey,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Medusa request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

export async function medusaListProducts() {
  return medusaFetch<MedusaListResponse<MedusaProduct>>("/store/products");
}

export async function medusaGetProduct(handle: string) {
  return medusaFetch<{ product?: MedusaProduct }>(`/store/products/${handle}`);
}

export async function medusaListCollections() {
  return medusaFetch<MedusaListResponse<{ id: string; title?: string; handle?: string; description?: string }>>("/store/collections");
}

export async function medusaListCategories() {
  return medusaFetch<MedusaListResponse<{ id: string; name?: string; handle?: string; description?: string }>>("/store/categories");
}

export function mapMedusaProduct(product: MedusaProduct) {
  const price = product.variants?.[0]?.calculated_price;
  const amount = price?.calculated_amount ?? price?.original_amount ?? 0;
  const currency = price?.currency_code?.toUpperCase() ?? "AED";
  const image = product.thumbnail ?? product.images?.[0]?.url ?? "/hero-animation/dock.png";

  return {
    id: product.id,
    name: product.title ?? "Untitled Product",
    slug: product.handle ?? product.id,
    category: product.categories?.[0]?.name ?? "Accessories",
    categorySlug: product.categories?.[0]?.handle ?? "accessories",
    collection: product.collection?.title ?? product.collection?.name ?? "Collection",
    price: Math.round(amount / 100),
    oldPrice: Math.round(amount / 100),
    currency,
    badge: product.tags?.[0]?.value ?? "Featured",
    color: "Graphite Black",
    image,
    gallery: [image],
    shortDescription: product.subtitle ?? product.description?.slice(0, 120) ?? "",
    description: product.description ?? product.subtitle ?? "",
    specs: [],
    highlights: [],
  };
}
