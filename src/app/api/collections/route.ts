import { getCollections } from "@/lib/backend/catalog";
import { jsonResponse } from "@/lib/backend/http";

export async function GET() {
  return jsonResponse(await getCollections());
}
