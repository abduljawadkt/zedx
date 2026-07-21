import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { productWriteSchema } from "@/lib/backend/validation";
import { upsertProduct } from "@/lib/backend/repository";

export async function POST(request: NextRequest) {
  if (!(await hasAdminAccess(request))) {
    return errorResponse("Unauthorized", 401);
  }

  const parsed = productWriteSchema.safeParse(await request.json());
  if (!parsed.success) {
    return errorResponse(parsed.error.message, 400);
  }

  const payload = parsed.data;
  const product = await upsertProduct({
    id: payload.id ?? payload.slug,
    ...payload,
  });

  return jsonResponse(product, { status: 201 });
}
