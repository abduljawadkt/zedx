import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { categoryWriteSchema } from "@/lib/backend/validation";
import { deleteCategory, updateCategoryBySlug } from "@/lib/backend/repository";

export async function PATCH(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  const { slug } = await context.params;
  const parsed = categoryWriteSchema.partial().safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);
  return jsonResponse(await updateCategoryBySlug(slug, parsed.data));
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  const { slug } = await context.params;
  await deleteCategory(slug);
  return jsonResponse({ ok: true });
}
