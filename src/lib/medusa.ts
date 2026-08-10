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
    id?: string;
    sku?: string;
    title?: string;
    metadata?: Record<string, unknown> | null;
    calculated_price?: {
      calculated_amount?: number;
      original_amount?: number;
      currency_code?: string;
    };
  }>;
  categories?: Array<{ handle?: string; name?: string }>;
  collection?: { handle?: string; title?: string; name?: string };
  tags?: Array<{ value?: string }>;
  metadata?: Record<string, unknown> | null;
};

type MedusaListResponse<T> = {
  products?: T[];
  collections?: T[];
  categories?: T[];
  product_categories?: T[];
  count?: number;
};

type MedusaRegion = {
  id: string;
  name?: string;
  currency_code?: string;
  countries?: Array<{ iso_2?: string }>;
};

type MedusaCustomer = {
  id: string;
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
};

type MedusaOrder = {
  id: string;
  display_id?: number;
  status?: string;
  total?: number;
  currency_code?: string;
  created_at?: string;
  items?: Array<{
    id?: string;
    title?: string;
    product_title?: string;
    quantity?: number;
    unit_price?: number;
    total?: number;
  }>;
};

type MedusaCustomerAddress = {
  id: string;
  address_name?: string | null;
};

type MedusaAuthResponse = {
  token: string;
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

export async function medusaFetch<T>(path: string, init?: RequestInit): Promise<T> {
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
    const message = await response.text().catch(() => "");
    throw new Error(`Medusa request failed with status ${response.status}${message ? `: ${message}` : ""}`);
  }

  return response.json() as Promise<T>;
}

function splitCustomerName(name: string) {
  const parts = name.trim().split(/\s+/);
  return {
    first_name: parts[0] || name,
    last_name: parts.slice(1).join(" ") || "",
  };
}

function joinCustomerName(customer: MedusaCustomer) {
  return [customer.first_name, customer.last_name].filter(Boolean).join(" ").trim() || customer.email || "ZEDX Customer";
}

export function medusaCustomerAuthHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function medusaRegisterCustomerAccount(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const auth = await medusaFetch<MedusaAuthResponse>("/auth/customer/emailpass/register", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
  });

  const name = splitCustomerName(input.name);
  const response = await medusaFetch<{ customer: MedusaCustomer }>("/store/customers", {
    method: "POST",
    headers: medusaCustomerAuthHeaders(auth.token),
    body: JSON.stringify({
      email: input.email,
      first_name: name.first_name,
      last_name: name.last_name,
      phone: input.phone ?? "",
      metadata: {
        source: "zedx-frontend",
      },
    }),
  });

  const login = await medusaFetch<MedusaAuthResponse>("/auth/customer/emailpass", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
  });

  return { token: login.token, customer: response.customer };
}

export async function medusaLoginCustomerAccount(email: string, password: string) {
  const auth = await medusaFetch<MedusaAuthResponse>("/auth/customer/emailpass", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const response = await medusaFetch<{ customer: MedusaCustomer }>(
    "/store/customers/me?fields=id,email,first_name,last_name,phone",
    {
      headers: medusaCustomerAuthHeaders(auth.token),
    },
  );

  return {
    token: auth.token,
    customer: response.customer,
    name: joinCustomerName(response.customer),
  };
}

export async function medusaListCustomerOrders(token: string) {
  return medusaFetch<{ orders?: MedusaOrder[]; count?: number }>(
    "/store/orders?limit=50&fields=id,display_id,status,total,currency_code,created_at,*items",
    {
      headers: medusaCustomerAuthHeaders(token),
    },
  );
}

function medusaAddressPayload(input: {
  fullName: string;
  phone: string;
  city: string;
  addressLine: string;
  apartment?: string | null;
  label?: string | null;
}) {
  const name = splitCustomerName(input.fullName);

  return {
    address_name: input.label || "Default",
    first_name: name.first_name,
    last_name: name.last_name,
    address_1: input.addressLine,
    address_2: input.apartment || "",
    city: input.city,
    country_code: "ae",
    phone: input.phone,
    is_default_shipping: true,
    is_default_billing: true,
  };
}

export async function medusaUpsertCustomerAddress(
  token: string,
  input: {
    fullName: string;
    phone: string;
    city: string;
    addressLine: string;
    apartment?: string | null;
    label?: string | null;
  },
) {
  const addresses = await medusaFetch<{ addresses?: MedusaCustomerAddress[] }>(
    "/store/customers/me/addresses?limit=50",
    {
      headers: medusaCustomerAuthHeaders(token),
    },
  );
  const label = input.label || "Default";
  const existing = addresses.addresses?.find((address) => address.address_name === label);
  const path = existing ? `/store/customers/me/addresses/${existing.id}` : "/store/customers/me/addresses";

  return medusaFetch(path, {
    method: "POST",
    headers: medusaCustomerAuthHeaders(token),
    body: JSON.stringify(medusaAddressPayload(input)),
  });
}

export function mapMedusaOrder(order: MedusaOrder) {
  return {
    id: order.id,
    orderNumber: order.display_id ? `MED-${order.display_id}` : order.id,
    status: order.status ?? "pending",
    currency: order.currency_code?.toUpperCase() ?? "AED",
    total: order.total ?? 0,
    createdAt: order.created_at ?? new Date().toISOString(),
    items:
      order.items?.map((item, index) => ({
        id: item.id ?? `${order.id}-${index}`,
        name: item.title ?? item.product_title ?? "ZEDX product",
        quantity: item.quantity ?? 1,
        price: item.unit_price ?? item.total ?? 0,
      })) ?? [],
  };
}

export async function medusaListProducts() {
  const region = await medusaGetDefaultRegion();
  const params = new URLSearchParams({
    limit: "100",
    fields: "id,title,handle,subtitle,description,thumbnail,metadata,*variants,*variants.calculated_price,*categories,*collection,*images",
  });

  if (region?.id) {
    params.set("region_id", region.id);
  }

  return medusaFetch<MedusaListResponse<MedusaProduct>>(`/store/products?${params.toString()}`);
}

export async function medusaGetProduct(handle: string) {
  const region = await medusaGetDefaultRegion();
  const params = new URLSearchParams({
    handle,
    limit: "1",
    fields: "id,title,handle,subtitle,description,thumbnail,metadata,*variants,*variants.calculated_price,*categories,*collection,*images",
  });

  if (region?.id) {
    params.set("region_id", region.id);
  }

  const response = await medusaFetch<MedusaListResponse<MedusaProduct>>(`/store/products?${params.toString()}`);
  return { product: response.products?.[0] };
}

export async function medusaListCollections() {
  return medusaFetch<MedusaListResponse<{ id: string; title?: string; handle?: string; description?: string }>>(
    "/store/collections?limit=100&fields=id,title,handle,metadata",
  );
}

export async function medusaListCategories() {
  return medusaFetch<MedusaListResponse<{ id: string; name?: string; handle?: string; description?: string }>>(
    "/store/product-categories?limit=100&fields=id,name,handle,description,metadata",
  );
}

export async function medusaListRegions() {
  return medusaFetch<{ regions?: MedusaRegion[] }>("/store/regions");
}

export async function medusaGetDefaultRegion() {
  const countryCode = process.env.NEXT_PUBLIC_DEFAULT_REGION?.trim().toLowerCase() || "ae";
  const response = await medusaListRegions();
  return (
    response.regions?.find((region) =>
      region.countries?.some((country) => country.iso_2?.toLowerCase() === countryCode),
    ) ?? response.regions?.[0] ?? null
  );
}

function normalizeMedusaImage(url: string) {
  if (!url) return "/hero-animation/dock.png";

  try {
    const parsed = new URL(url);
    if (parsed.hostname === "localhost" && parsed.port === "3000") {
      return parsed.pathname;
    }
  } catch {}

  return url;
}

function stringMetadata(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function numberMetadata(value: unknown, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

function stringArrayMetadata(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function mapMedusaProduct(product: MedusaProduct) {
  const variant = product.variants?.[0];
  const price = variant?.calculated_price;
  const amount = price?.calculated_amount ?? price?.original_amount ?? 0;
  const currency = price?.currency_code?.toUpperCase() ?? "AED";
  const metadata = product.metadata ?? {};
  const image = normalizeMedusaImage(
    stringMetadata(metadata.local_image) || product.thumbnail || product.images?.[0]?.url || "/hero-animation/dock.png",
  );
  const gallery = stringArrayMetadata(metadata.local_gallery).length
    ? stringArrayMetadata(metadata.local_gallery)
    : (product.images ?? []).map((item) => normalizeMedusaImage(item.url ?? "")).filter(Boolean);

  return {
    id: product.id,
    medusaProductId: product.id,
    medusaVariantId: variant?.id,
    sku: variant?.sku ?? null,
    name: product.title ?? "Untitled Product",
    slug: product.handle ?? product.id,
    category: stringMetadata(metadata.category, product.categories?.[0]?.name ?? "Accessories"),
    categorySlug: stringMetadata(metadata.category_slug, product.categories?.[0]?.handle ?? "accessories"),
    collection: stringMetadata(metadata.collection, product.collection?.title ?? product.collection?.name ?? "Collection"),
    price: Math.round(amount),
    oldPrice: numberMetadata(metadata.old_price, Math.round(amount)),
    currency,
    badge: stringMetadata(metadata.badge, product.tags?.[0]?.value ?? "Featured"),
    color: stringMetadata(metadata.color, variant?.title ?? "Graphite Black"),
    image,
    gallery: gallery.length ? gallery : [image],
    shortDescription: product.subtitle ?? product.description?.slice(0, 120) ?? "",
    description: product.description ?? product.subtitle ?? "",
    specs: stringArrayMetadata(metadata.specs),
    highlights: stringArrayMetadata(metadata.highlights),
  };
}
