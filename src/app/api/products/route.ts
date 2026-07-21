import { getProducts } from "@/lib/backend/catalog";
import { jsonResponse, parseNumberParam } from "@/lib/backend/http";
import type { ProductQuery } from "@/lib/backend/types";

const allowedSorts = new Set<ProductQuery["sort"]>([
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "name",
]);

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const sortParam = searchParams.get("sort") as ProductQuery["sort"] | null;
  const sort = sortParam && allowedSorts.has(sortParam) ? sortParam : "featured";

  return jsonResponse(
    await getProducts({
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      collection: searchParams.get("collection") ?? undefined,
      badge: searchParams.get("badge") ?? undefined,
      minPrice: parseNumberParam(searchParams.get("minPrice")),
      maxPrice: parseNumberParam(searchParams.get("maxPrice")),
      limit: parseNumberParam(searchParams.get("limit")),
      sort,
    }),
  );
}
