import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryProductsPage } from "@/components/product/CategoryProductsPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCategory, getProducts } from "@/lib/backend/catalog";
import { breadcrumbJsonLd, categorySeoTitle, collectionJsonLd } from "@/lib/seo";

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

  return {
    title: categorySeoTitle(category, categoryProducts),
    description: category.description,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title: category.name,
      description: category.description,
      url: `/categories/${category.slug}`,
      images: [category.image],
    },
    twitter: {
      card: "summary_large_image",
      title: category.name,
      description: category.description,
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
