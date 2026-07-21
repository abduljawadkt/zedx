import { getCategory, getEntitySeo, getProducts } from "@/lib/backend/catalog";
import { errorResponse, jsonResponse } from "@/lib/backend/http";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const category = await getCategory(slug);

  if (!category) {
    return errorResponse("Category not found.", 404);
  }

  return jsonResponse({
    category,
    seo: await getEntitySeo("category", slug),
    products: await getProducts({ category: slug }),
  });
}
