import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { prisma } from "@/lib/backend/prisma";
import { getCustomerSession } from "@/lib/backend/session";

export async function GET(request: NextRequest) {
  const session = await getCustomerSession(request);
  if (!session) return errorResponse("Please sign in to view order history.", 401);

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { customerId: session.customerId },
        { email: session.customer.email },
      ],
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return jsonResponse({ orders });
}
