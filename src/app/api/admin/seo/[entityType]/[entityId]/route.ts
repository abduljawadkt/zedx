import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { seoWriteSchema } from "@/lib/backend/validation";
import { upsertSeoMetadata } from "@/lib/backend/repository";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ entityType: string; entityId: string }> },
) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  const { entityType, entityId } = await context.params;
  const parsed = seoWriteSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);
  return jsonResponse(await upsertSeoMetadata({ entityType: entityType as never, entitySlug: entityId, ...parsed.data }));
}
