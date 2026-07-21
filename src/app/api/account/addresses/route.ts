import { NextRequest } from "next/server";
import { z } from "zod";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { prisma } from "@/lib/backend/prisma";
import { getCustomerSession } from "@/lib/backend/session";

const addressSchema = z.object({
  label: z.string().min(1).default("Default"),
  fullName: z.string().min(1),
  phone: z.string().min(1),
  city: z.string().min(1),
  addressLine: z.string().min(1),
  apartment: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getCustomerSession(request);
  if (!session) return errorResponse("Please sign in to manage delivery details.", 401);

  const addresses = await prisma.customerAddress.findMany({
    where: { customerId: session.customerId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });

  return jsonResponse({ addresses });
}

export async function PUT(request: NextRequest) {
  const session = await getCustomerSession(request);
  if (!session) return errorResponse("Please sign in to manage delivery details.", 401);

  const parsed = addressSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  await prisma.customerAddress.updateMany({
    where: { customerId: session.customerId },
    data: { isDefault: false },
  });

  const existing = await prisma.customerAddress.findFirst({
    where: { customerId: session.customerId, label: parsed.data.label },
  });

  const address = existing
    ? await prisma.customerAddress.update({
        where: { id: existing.id },
        data: { ...parsed.data, apartment: parsed.data.apartment || null, isDefault: true },
      })
    : await prisma.customerAddress.create({
        data: {
          ...parsed.data,
          apartment: parsed.data.apartment || null,
          isDefault: true,
          customerId: session.customerId,
        },
      });

  await prisma.customer.update({
    where: { id: session.customerId },
    data: { name: parsed.data.fullName, phone: parsed.data.phone },
  });

  return jsonResponse({ address });
}
