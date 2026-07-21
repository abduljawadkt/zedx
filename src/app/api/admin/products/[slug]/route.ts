import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { productWriteSchema } from "@/lib/backend/validation";
import { prisma } from "@/lib/backend/prisma";
import { ensureSeeded } from "@/lib/backend/repository";

export async function PATCH(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  await ensureSeeded();
  const { slug } = await context.params;
  const parsed = productWriteSchema.partial().safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (!existing) return errorResponse("Product not found.", 404);

  const updated = await prisma.product.update({
    where: { slug },
    data: {
      ...parsed.data,
      ...(parsed.data.gallery ? { galleryJson: JSON.stringify(parsed.data.gallery) } : {}),
      ...(parsed.data.specs ? { specsJson: JSON.stringify(parsed.data.specs) } : {}),
      ...(parsed.data.highlights ? { highlightsJson: JSON.stringify(parsed.data.highlights) } : {}),
    },
  });

  return jsonResponse(updated);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  await ensureSeeded();
  const { slug } = await context.params;
  await prisma.product.delete({ where: { slug } });
  return jsonResponse({ ok: true });
}
