import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product/ProductDetailPage";
import { getProduct, getProducts } from "@/lib/backend/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getProducts({ category: product.categorySlug, limit: 8 }))
    .filter((item) => item.id !== product.id)
    .concat((await getProducts({ limit: 8 })).filter((item) => item.id !== product.id))
    .slice(0, 4);

  return <ProductDetailPage product={product} relatedProducts={relatedProducts} />;
}
