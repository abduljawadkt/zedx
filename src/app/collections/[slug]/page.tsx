import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryProductsPage } from "@/components/product/CategoryProductsPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCollection, getProducts } from "@/lib/backend/catalog";
import { breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";

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
    alternates: {
      canonical: `/collections/${collection.slug}`,
    },
    openGraph: {
      title: collection.name,
      description: collection.description,
      url: `/collections/${collection.slug}`,
      images: [collection.image],
    },
    twitter: {
      card: "summary_large_image",
      title: collection.name,
      description: collection.description,
      images: [collection.image],
    },
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

  const category = {
    slug: collection.slug,
    name: collection.name,
    description: collection.description,
    accent: "blue" as const,
    collection: "ZEDX",
    image: collection.image,
    productCount: collection.productCount,
  };

  return (
    <>
      <StructuredData
        data={[
          collectionJsonLd(category, `/collections/${collection.slug}`),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: collection.name, path: `/collections/${collection.slug}` },
          ]),
        ]}
      />
    <CategoryProductsPage
      category={category}
      products={await getProducts({ collection: slug })}
    />
    </>
  );
}
