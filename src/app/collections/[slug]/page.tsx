import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryProductsPage } from "@/components/product/CategoryProductsPage";
import { getCollection, getProducts } from "@/lib/backend/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    return {
      title: "Collection not found",
    };
  }

  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    notFound();
  }

  return (
    <CategoryProductsPage
      category={{
        slug: collection.slug,
        name: collection.name,
        description: collection.description,
        accent: "blue",
        collection: "ZEDX",
        image: collection.image,
        productCount: collection.productCount,
      }}
      products={await getProducts({ collection: slug })}
    />
  );
}
