import { getHomepageSections, getProducts, getSiteSettings } from "@/lib/backend/catalog";
import { jsonResponse } from "@/lib/backend/http";

export async function GET() {
  return jsonResponse({
    settings: await getSiteSettings(),
    sections: await getHomepageSections(),
    featuredProducts: await getProducts({ limit: 8 }),
  });
}
