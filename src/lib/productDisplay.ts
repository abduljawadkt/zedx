import { categories, type Category } from "@/data/categories";
import { products, type Product } from "@/data/products";

export type ProductGroupId = "audio" | "power" | "accessories";

export const productGroups: Record<
  ProductGroupId,
  {
    eyebrow: string;
    name: string;
    slug: ProductGroupId;
    description: string;
    categorySlugs: string[];
    collections: string[];
  }
> = {
  audio: {
    eyebrow: "Audio collection",
    name: "Audio",
    slug: "audio",
    description:
      "Earbuds, headphones, neckbands, and speakers tuned for calls, focus, gaming, and everyday listening.",
    categorySlugs: ["earpods", "over-heads", "wired-headphones", "neck-band", "speakers"],
    collections: ["Audio"],
  },
  power: {
    eyebrow: "Power collection",
    name: "Power",
    slug: "power",
    description:
      "Fast chargers, power banks, car power, travel adapters, and cables for long days away from outlets.",
    categorySlugs: ["power-banks", "chargers", "adapters", "car-chargers", "charging-cables"],
    collections: ["Power", "Portable Power", "Travel Power", "Auto Power", "Essentials"],
  },
  accessories: {
    eyebrow: "Accessories collection",
    name: "Accessories",
    slug: "accessories",
    description:
      "Refined add-ons for desk, car, mobile, and wearable setups.",
    categorySlugs: ["car-holders", "smart-watches"],
    collections: ["Mounts", "Smart Wearables"],
  },
};

function normalizeAssetName(value: string) {
  return value
    .toLowerCase()
    .replace(/\.(jpe?g|png|webp|svg)$/i, "")
    .replace(/\s+-\s+\d+$/g, "")
    .replace(/\bzedx\b/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

export function hasExactCatalogImage(product: Product) {
  if (!product.image.startsWith("/products/")) return false;

  const imageName = product.image.split("/").pop() ?? "";
  return normalizeAssetName(imageName) === normalizeAssetName(product.name);
}

export function getProductsForGroup(groupId: ProductGroupId) {
  const group = productGroups[groupId];

  return products
    .filter((product) =>
      group.categorySlugs.includes(product.categorySlug) ||
      group.collections.includes(product.collection),
    )
    .filter((product) => groupId !== "accessories" || hasExactCatalogImage(product))
    .sort((a, b) => {
      const categoryA = group.categorySlugs.indexOf(a.categorySlug);
      const categoryB = group.categorySlugs.indexOf(b.categorySlug);
      return (categoryA === -1 ? 999 : categoryA) - (categoryB === -1 ? 999 : categoryB);
    });
}

export function getCategoriesForGroup(groupId: ProductGroupId) {
  const group = productGroups[groupId];

  return categories.filter((category) => group.categorySlugs.includes(category.slug));
}

export function getGroupAsCategory(groupId: ProductGroupId): Category {
  const group = productGroups[groupId];
  const groupProducts = getProductsForGroup(groupId);
  const heroProduct = groupProducts[0];

  return {
    slug: group.slug,
    name: group.name,
    description: group.description,
    accent: "blue",
    collection: group.eyebrow,
    image: heroProduct?.image ?? "/hero-animation/dock.png",
    productCount: groupProducts.length,
  };
}

export function formatProductName(name: string) {
  return name
    .replace(/\bZEDX\b/g, "ZEDX")
    .replace(/\bZedx\b/g, "ZEDX")
    .replace(/\bZsmart\b/g, "Z Smart")
    .replace(/\bPc\b/g, "PC")
    .replace(/\bGb\b/g, "GB")
    .replace(/\bgb\b/g, "GB")
    .replace(/\bmah\b/gi, "mAh")
    .replace(/\bGan\b/g, "GaN")
    .replace(/\bPd\b/g, "PD")
    .replace(/\bTws\b/g, "TWS")
    .replace(/\bWiresless\b/g, "Wireless")
    .replace(/\bWirless\b/g, "Wireless")
    .replace(/\bSterio\b/g, "Stereo")
    .replace(/\bHaed\b/g, "Head")
    .replace(/\bVaccum\b/g, "Vacuum")
    .replace(/\bChrging\b/g, "Charging")
    .replace(/\bChRGING\b/g, "Charging")
    .replace(/\bCHRGING\b/g, "Charging")
    .replace(/\b10inch\b/gi, "10 inch")
    .replace(/\(([^)]+)\)/g, " ($1)")
    .replace(/\s*-\s*/g, " - ")
    .replace(/\bZx - ([a-z0-9]+)\b/gi, (_, code: string) => `ZX-${code.toUpperCase()}`)
    .replace(/\bZe - ([a-z0-9]+)\b/gi, (_, code: string) => `ZE-${code.toUpperCase()}`)
    .replace(/\bCr -? ?([0-9]+)\b/gi, (_, code: string) => `CR${code}`)
    .replace(/([0-9])([a-zA-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatCategoryName(name: string) {
  const normalized = name.toLowerCase();
  const overrides: Record<string, string> = {
    "car holders": "Car Mounts",
    earpods: "Wireless Earbuds",
    "neck band": "Neckbands",
    "over heads": "Over-Ear Headphones",
  };

  return overrides[normalized] ?? name;
}

export function formatLabelName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((word) =>
      word
        .split("-")
        .map((part) => {
          if (/^zedx$/i.test(part)) return "ZEDX";
          if (/^uae$/i.test(part)) return "UAE";
          return part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part;
        })
        .join("-"),
    )
    .join(" ");
}

export function formatProductDescription(product: Product) {
  return product.description.replace(product.name, formatProductName(product.name));
}
