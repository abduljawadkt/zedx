import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { ensureSeeded } from "@/lib/backend/repository";
import { prisma } from "@/lib/backend/prisma";
import { z } from "zod";

const mediaPatchSchema = z.object({
  url: z.string().min(1).optional(),
  alt: z.string().min(1).optional(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  owner: z.string().optional().nullable(),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  await ensureSeeded();
  const { id } = await context.params;
  const parsed = mediaPatchSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);
  return jsonResponse(await prisma.mediaAsset.update({ where: { id }, data: parsed.data }));
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  await ensureSeeded();
  const { id } = await context.params;
  await prisma.mediaAsset.delete({ where: { id } });
  return jsonResponse({ ok: true });
}
