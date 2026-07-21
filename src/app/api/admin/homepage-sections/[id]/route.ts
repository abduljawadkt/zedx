import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { homepageSectionWriteSchema } from "@/lib/backend/validation";
import { upsertHomepageSection } from "@/lib/backend/repository";
import { prisma } from "@/lib/backend/prisma";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  const { id } = await context.params;
  const parsed = homepageSectionWriteSchema.partial().safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);
  const existing = await prisma.homepageSection.findUnique({ where: { id } });
  if (!existing) return errorResponse("Homepage section not found.", 404);
  return jsonResponse(
    await upsertHomepageSection({
      id: existing.id,
      type: (parsed.data.type ?? existing.type) as "hero" | "category-strip" | "product-story" | "trending" | "brand-experience",
      title: parsed.data.title ?? existing.title,
      enabled: parsed.data.enabled ?? existing.enabled,
      sortOrder: parsed.data.sortOrder ?? existing.sortOrder,
    }),
  );
}
