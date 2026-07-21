import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { categoryWriteSchema } from "@/lib/backend/validation";
import { upsertCategory } from "@/lib/backend/repository";

export async function POST(request: NextRequest) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  const parsed = categoryWriteSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);
  return jsonResponse(await upsertCategory(parsed.data), { status: 201 });
}
