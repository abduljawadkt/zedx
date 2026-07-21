import { getCollection, getEntitySeo, getProducts } from "@/lib/backend/catalog";
import { errorResponse, jsonResponse } from "@/lib/backend/http";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const collection = await getCollection(slug);

  if (!collection) {
    return errorResponse("Collection not found.", 404);
  }

  return jsonResponse({
    collection,
    seo: await getEntitySeo("collection", slug),
    products: await getProducts({ collection: slug }),
  });
}
