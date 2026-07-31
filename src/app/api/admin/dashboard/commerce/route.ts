import { NextRequest } from "next/server";
import { hasAdminAccess } from "@/lib/backend/auth";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { getOrderSummary } from "@/lib/backend/commerce";

export async function GET(request: NextRequest) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  return jsonResponse(await getOrderSummary());
}
