import type { Category } from "@/data/categories";
import { categories as seedCategories } from "@/data/categories";
import { collections as seedCollections, products as seedProducts } from "@/data/products";
import { prisma } from "@/lib/backend/prisma";
import { hashPassword } from "@/lib/backend/password";

function stringify(value: unknown) {
  return JSON.stringify(value);
}

function productSku(slug: string) {
  return slug.toUpperCase().replace(/[^A-Z0-9]/g, "-");
}

export async function seedDatabaseIfNeeded() {
  const [productCount, categoryCount, collectionCount, settingsCount, homepageCount, adminCount, inventoryCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.collection.count(),
      prisma.siteSettings.count(),
      prisma.homepageSection.count(),
      prisma.adminUser.count(),
      prisma.inventoryItem.count(),
    ]);

  if (productCount === 0) {
    await prisma.product.createMany({
      data: seedProducts.map((product, index) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: productSku(product.slug),
        category: product.category,
        categorySlug: product.categorySlug,
        collection: product.collection,
        price: product.price,
        oldPrice: product.oldPrice,
        currency: product.currency,
        badge: product.badge,
        color: product.color,
        image: product.image,
        galleryJson: stringify(product.gallery),
        shortDescription: product.shortDescription,
        description: product.description,
        specsJson: stringify(product.specs),
        highlightsJson: stringify(product.highlights),
        published: true,
        status: "published",
        featured: ["Premium", "Best Seller", "Client Pick"].includes(product.badge),
        sortOrder: index + 1,
      })),
    });
  } else {
    const existingProducts = await prisma.product.findMany({
      select: { id: true, slug: true, badge: true, sku: true, sortOrder: true },
      orderBy: { createdAt: "asc" },
    });
    await Promise.all(
      existingProducts.map((product, index) =>
        prisma.product.update({
          where: { id: product.id },
          data: {
            sku: product.sku ?? productSku(product.slug),
            status: "published",
            published: true,
            featured: ["Premium", "Best Seller", "Client Pick"].includes(product.badge),
            sortOrder: product.sortOrder || index + 1,
          },
        }),
      ),
    );
  }

  if (categoryCount === 0) {
    await prisma.category.createMany({
      data: seedCategories.map((category: Category, index) => ({
        slug: category.slug,
        name: category.name,
        description: category.description,
        accent: category.accent,
        collection: category.collection,
        image: category.image,
        productCount: category.productCount,
        featured: index < 6,
        sortOrder: index + 1,
      })),
    });
  } else {
    const existingCategories = await prisma.category.findMany({
      select: { slug: true, sortOrder: true },
      orderBy: { createdAt: "asc" },
    });
    await Promise.all(
      existingCategories.map((category, index) =>
        prisma.category.update({
          where: { slug: category.slug },
          data: {
            featured: index < 6,
            sortOrder: category.sortOrder || index + 1,
          },
        }),
      ),
    );
  }

  if (collectionCount === 0) {
    const uniqueCollections = Array.from(new Set(seedCollections));
    await prisma.collection.createMany({
      data: uniqueCollections.map((collection, index) => {
        const collectionProducts = seedProducts.filter((product) => product.collection === collection);
        const leadProduct = collectionProducts[0];
        return {
          slug: collection
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, ""),
          name: collection,
          description: `Curated ${collection.toLowerCase()} products for a premium everyday tech setup.`,
          image: leadProduct?.image ?? "/brand/zedx-logo-transparent.png",
          productCount: collectionProducts.length,
          featured: index < 4,
          sortOrder: index + 1,
        };
      }),
    });
  } else {
    const existingCollections = await prisma.collection.findMany({
      select: { slug: true, sortOrder: true },
      orderBy: { createdAt: "asc" },
    });
    await Promise.all(
      existingCollections.map((collection, index) =>
        prisma.collection.update({
          where: { slug: collection.slug },
          data: {
            sortOrder: collection.sortOrder || index + 1,
          },
        }),
      ),
    );
  }

  if (settingsCount === 0) {
    await prisma.siteSettings.create({
      data: {
        id: "site",
        brandName: "ZEDX",
        tagline: "Premium gadgets and accessories for modern everyday setups.",
        announcement: "Client demo backend foundation: catalog, CMS, SEO, and dashboard ready.",
        currency: "AED",
        seoTitle: "ZEDX Premium Tech Store",
        seoDescription:
          "A premium ecommerce launch experience for audio, power, wearables, tablets, and accessories.",
        openGraphImage: "/brand/zedx-logo-transparent.png",
        canonicalPath: "/",
        robots: "index,follow",
        socialLinksJson: stringify([]),
      },
    });
  }

  if (homepageCount === 0) {
    await prisma.homepageSection.createMany({
      data: [
        { id: "hero", type: "hero", title: "Launch hero", enabled: true, sortOrder: 10 },
        { id: "category-strip", type: "category-strip", title: "Category strip", enabled: true, sortOrder: 20 },
        { id: "product-story", type: "product-story", title: "Scroll product story", enabled: true, sortOrder: 30 },
        { id: "trending", type: "trending", title: "Trending products", enabled: true, sortOrder: 40 },
        { id: "brand-experience", type: "brand-experience", title: "Brand experience", enabled: true, sortOrder: 50 },
      ],
    });
  }

  if (adminCount === 0) {
    const adminPassword = process.env.ADMIN_PASSWORD ?? "zedx-admin";
    await prisma.adminUser.create({
      data: {
        email: process.env.ADMIN_EMAIL ?? "admin@zedx.local",
        passwordHash: hashPassword(adminPassword),
        role: "admin",
      },
    });
  } else if (process.env.NODE_ENV !== "production") {
    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@zedx.local";
    const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
    if (existingAdmin && !existingAdmin.passwordHash.startsWith("pbkdf2$")) {
      await prisma.adminUser.update({
        where: { email: adminEmail },
        data: {
          passwordHash: hashPassword(process.env.ADMIN_PASSWORD ?? "zedx-admin"),
        },
      });
    }
  }

  const inventoryProducts = await prisma.product.findMany({
    select: { id: true, slug: true, sku: true },
  });
  await Promise.all(
    inventoryProducts.map((product) =>
      prisma.inventoryItem.upsert({
        where: { productId: product.id },
        create: {
          productId: product.id,
          sku: product.sku ?? productSku(product.slug),
          quantity: inventoryCount === 0 ? 50 : 0,
          reserved: 0,
          lowStockAt: 5,
        },
        update: {
          sku: product.sku ?? productSku(product.slug),
        },
      }),
    ),
  );
}
