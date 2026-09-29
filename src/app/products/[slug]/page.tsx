import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product/ProductDetailPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getProduct, getProducts } from "@/lib/backend/catalog";
import { breadcrumbJsonLd, productJsonLd, productSeoDescription } from "@/lib/seo";
import { getSeoOverride } from "@/lib/seoOverrides";
import { formatCategoryName, formatProductName } from "@/lib/productDisplay";

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

  const override = getSeoOverride("product", product.slug);
  const title =
    override?.title ??
    `${formatProductName(product.name)} — ${formatCategoryName(product.category)} AED ${product.price} | Buy Online UAE`;
  const description = override?.description ?? productSeoDescription(product);
  const ogTitle = override?.title ?? formatProductName(product.name);

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: `/products/${product.slug}`,
      images: [product.image],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [product.image],
    },
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

  return (
    <>
      <StructuredData
        data={[
          productJsonLd(product),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: formatCategoryName(product.category), path: `/categories/${product.categorySlug}` },
            { name: formatProductName(product.name), path: `/products/${product.slug}` },
          ]),
        ]}
      />
      <ProductDetailPage product={product} relatedProducts={relatedProducts} />
    </>
  );
}
