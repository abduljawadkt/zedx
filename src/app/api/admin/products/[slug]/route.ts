import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { productWriteSchema } from "@/lib/backend/validation";
import { deleteProduct, updateProductBySlug } from "@/lib/backend/repository";

export async function PATCH(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  const { slug } = await context.params;
  const parsed = productWriteSchema.partial().safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const updated = await updateProductBySlug(slug, parsed.data);
  if (!updated) return errorResponse("Product not found.", 404);

  return jsonResponse(updated);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  const { slug } = await context.params;
  const deleted = await deleteProduct(slug);
  if (!deleted) return errorResponse("Product not found.", 404);
  return jsonResponse({ ok: true });
}
