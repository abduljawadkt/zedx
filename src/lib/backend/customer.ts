import { prisma } from "@/lib/backend/prisma";
import { hashPassword, verifyPassword } from "@/lib/backend/password";

type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
};

export async function getCustomerProfile(customerId: string) {
  return prisma.customer.findUnique({ where: { id: customerId } });
}

export async function getCustomerOrders(customerId: string) {
  return prisma.order.findMany({
    where: { customerId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export function safeCustomer(customer: CustomerRecord | null) {
  if (!customer) return null;

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? "",
  };
}

export async function verifyCustomerLogin(
  email: string,
  password: string,
): Promise<CustomerRecord | null> {
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) return null;

  const passwordOk = verifyPassword(password, customer.passwordHash);
  if (!passwordOk) return null;

  if (!customer.passwordHash.startsWith("pbkdf2$")) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: { passwordHash: hashPassword(password) },
    });
  }

  return customer;
}

export async function createCustomerAccount(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const existing = await prisma.customer.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new Error("An account already exists for this email.");
  }

  return prisma.customer.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone ?? "",
      passwordHash: hashPassword(input.password),
    },
  });
}
