import { jsonResponse } from "@/lib/backend/http";
import { getOrderSummary } from "@/lib/backend/commerce";

export async function GET() {
  return jsonResponse(await getOrderSummary());
}
