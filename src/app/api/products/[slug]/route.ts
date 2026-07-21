import { getEntitySeo, getProduct, getProducts } from "@/lib/backend/catalog";
import { errorResponse, jsonResponse } from "@/lib/backend/http";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const product = await getProduct(slug);

  if (!product) {
    return errorResponse("Product not found.", 404);
  }

  return jsonResponse({
    product,
    seo: await getEntitySeo("product", slug),
    relatedProducts: (await getProducts({ category: product.categorySlug, limit: 4 })).filter(
      (item) => item.id !== product.id,
    ),
  });
}
