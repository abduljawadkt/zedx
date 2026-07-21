import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { hasAdminAccess } from "@/lib/backend/auth";
import { updateOrderStatus } from "@/lib/backend/commerce";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["pending", "paid", "processing", "fulfilled", "cancelled"]),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ orderNumber: string }> }) {
  if (!(await hasAdminAccess(request))) return errorResponse("Unauthorized", 401);
  const { orderNumber } = await context.params;
  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  try {
    return jsonResponse(await updateOrderStatus(orderNumber, parsed.data.status));
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to update order.", 400);
  }
}
