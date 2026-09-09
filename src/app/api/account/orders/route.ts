import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { prisma } from "@/lib/backend/prisma";
import { MEDUSA_CUSTOMER_TOKEN_COOKIE, getCustomerSession } from "@/lib/backend/session";
import { getMedusaConfig, mapMedusaOrder, medusaListCustomerOrders } from "@/lib/medusa";

export async function GET(request: NextRequest) {
  const session = await getCustomerSession(request);
  if (!session) return errorResponse("Please sign in to view order history.", 401);

  const medusaToken = request.cookies.get(MEDUSA_CUSTOMER_TOKEN_COOKIE)?.value;
  if (getMedusaConfig() && medusaToken) {
    try {
      const response = await medusaListCustomerOrders(medusaToken);
      return jsonResponse({ orders: response.orders?.map(mapMedusaOrder) ?? [] });
    } catch {
      // Fall back to legacy local orders if the Medusa customer token expired.
    }
  }

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
