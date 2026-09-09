import { NextRequest } from "next/server";
import { z } from "zod";
import { safeCustomer, upsertCustomerAccount, verifyCustomerLogin } from "@/lib/backend/customer";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import {
  createCustomerSession,
  createCustomerSessionCookie,
  createMedusaCustomerTokenCookie,
  serializeCookie,
} from "@/lib/backend/session";
import { getMedusaConfig, medusaLoginCustomerAccount } from "@/lib/medusa";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  let medusaToken: string | null = null;
  let customer = null;

  if (getMedusaConfig()) {
    try {
      const medusaAccount = await medusaLoginCustomerAccount(parsed.data.email, parsed.data.password);
      medusaToken = medusaAccount.token;
      customer = await upsertCustomerAccount({
        name: medusaAccount.name,
        email: medusaAccount.customer.email ?? parsed.data.email,
        phone: medusaAccount.customer.phone ?? "",
        password: parsed.data.password,
      });
    } catch {
      customer = await verifyCustomerLogin(parsed.data.email, parsed.data.password);
    }
  } else {
    customer = await verifyCustomerLogin(parsed.data.email, parsed.data.password);
  }

  if (!customer) return errorResponse("Invalid email or password.", 401);

  const session = await createCustomerSession(customer.id);
  const cookie = createCustomerSessionCookie(session.token, session.expiresAt);
  const response = jsonResponse({ customer: safeCustomer(customer) });
  response.headers.append("Set-Cookie", serializeCookie(cookie));
  if (medusaToken) {
    response.headers.append(
      "Set-Cookie",
      serializeCookie(createMedusaCustomerTokenCookie(medusaToken, session.expiresAt)),
    );
  }
  return response;
}
