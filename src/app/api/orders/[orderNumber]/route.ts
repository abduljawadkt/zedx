import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/backend/http";
import { prisma } from "@/lib/backend/prisma";

export async function GET(_request: NextRequest, context: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await context.params;
  const order = await prisma.order.findUnique({ where: { orderNumber }, include: { items: true } });
  if (!order) return errorResponse("Order not found.", 404);
  return jsonResponse(order);
}
