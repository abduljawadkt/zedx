import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { collectionWriteSchema } from "@/lib/backend/validation";
import { ensureSeeded } from "@/lib/backend/repository";
import { prisma } from "@/lib/backend/prisma";

export async function PATCH(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  await ensureSeeded();
  const { slug } = await context.params;
  const parsed = collectionWriteSchema.partial().safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);
  return jsonResponse(await prisma.collection.update({ where: { slug }, data: parsed.data }));
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  await ensureSeeded();
  const { slug } = await context.params;
  await prisma.collection.delete({ where: { slug } });
  return jsonResponse({ ok: true });
}
