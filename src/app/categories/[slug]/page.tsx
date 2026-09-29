import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryProductsPage } from "@/components/product/CategoryProductsPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCategory, getProducts } from "@/lib/backend/catalog";
import { breadcrumbJsonLd, categorySeoTitle, collectionJsonLd } from "@/lib/seo";
import { getSeoOverride } from "@/lib/seoOverrides";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Category not found",
    };
  }

  const categoryProducts = await getProducts({ category: category.slug });

  const override = getSeoOverride("category", category.slug);
  const title = override?.title ?? categorySeoTitle(category, categoryProducts);
  const description = override?.description ?? category.description;
  const ogTitle = override?.title ?? category.name;

  return {
    title,
    description,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: `/categories/${category.slug}`,
      images: [category.image],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [category.image],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = await getProducts({ category: category.slug });

  return (
    <>
      <StructuredData
        data={[
          collectionJsonLd(category, `/categories/${category.slug}`),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Categories", path: "/products" },
            { name: category.name, path: `/categories/${category.slug}` },
          ]),
        ]}
      />
      <CategoryProductsPage category={category} products={categoryProducts} />
    </>
  );
}
