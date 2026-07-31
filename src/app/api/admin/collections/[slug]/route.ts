import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { collectionWriteSchema } from "@/lib/backend/validation";
import { deleteCollection, updateCollectionBySlug } from "@/lib/backend/repository";

export async function PATCH(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  const { slug } = await context.params;
  const parsed = collectionWriteSchema.partial().safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);
  const updated = await updateCollectionBySlug(slug, parsed.data);
  if (!updated) return errorResponse("Collection not found.", 404);
  return jsonResponse(updated);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  const { slug } = await context.params;
  const deleted = await deleteCollection(slug);
  if (!deleted) return errorResponse("Collection not found.", 404);
  return jsonResponse({ ok: true });
}
