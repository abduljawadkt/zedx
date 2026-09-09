import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product/ProductDetailPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { getProduct, getProducts } from "@/lib/backend/catalog";
import { breadcrumbJsonLd, productJsonLd, productSeoDescription } from "@/lib/seo";
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

  return {
    title: `${formatProductName(product.name)} — ${formatCategoryName(product.category)} AED ${product.price} | Buy Online UAE`,
    description: productSeoDescription(product),
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: formatProductName(product.name),
      description: productSeoDescription(product),
      url: `/products/${product.slug}`,
      images: [product.image],
    },
    twitter: {
      card: "summary_large_image",
      title: formatProductName(product.name),
      description: productSeoDescription(product),
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
