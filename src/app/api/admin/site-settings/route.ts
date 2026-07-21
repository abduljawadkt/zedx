import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { siteSettingsWriteSchema } from "@/lib/backend/validation";
import { updateSiteSettings } from "@/lib/backend/repository";

export async function PATCH(request: NextRequest) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  const parsed = siteSettingsWriteSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);
  return jsonResponse(
    await updateSiteSettings({
      ...parsed.data,
      seo: {
        ...parsed.data.seo,
        openGraphImage: parsed.data.seo.openGraphImage ?? undefined,
      },
    }),
  );
}
