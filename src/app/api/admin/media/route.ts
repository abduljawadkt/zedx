import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { createMediaAsset } from "@/lib/backend/repository";
import { z } from "zod";

const mediaSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  owner: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  const parsed = mediaSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);
  return jsonResponse(await createMediaAsset(parsed.data), { status: 201 });
}
