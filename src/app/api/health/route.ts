import { jsonResponse } from "@/lib/backend/http";

export async function GET() {
  return jsonResponse({
    status: "ok",
    service: "zedx",
    modules: ["catalog", "categories", "collections", "seo", "cms", "dashboard"],
  });
}
