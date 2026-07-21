import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryProductsPage } from "@/components/product/CategoryProductsPage";
import { getCategory, getProducts } from "@/lib/backend/catalog";

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

  return {
    title: category.name,
    description: category.description,
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

  return <CategoryProductsPage category={category} products={categoryProducts} />;
}
