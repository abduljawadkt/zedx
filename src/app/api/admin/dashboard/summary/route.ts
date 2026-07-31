import { NextRequest } from "next/server";
import { hasAdminAccess } from "@/lib/backend/auth";
import { getDashboardSummary } from "@/lib/backend/catalog";
import { errorResponse, jsonResponse } from "@/lib/backend/http";

export async function GET(request: NextRequest) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  return jsonResponse(await getDashboardSummary());
}
