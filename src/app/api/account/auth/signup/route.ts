import { NextRequest } from "next/server";
import { z } from "zod";
import { createCustomerAccount, getCustomerByEmail, safeCustomer, upsertCustomerAccount } from "@/lib/backend/customer";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import {
  createCustomerSession,
  createCustomerSessionCookie,
  createMedusaCustomerTokenCookie,
  serializeCookie,
} from "@/lib/backend/session";
import { getMedusaConfig, medusaRegisterCustomerAccount } from "@/lib/medusa";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  const parsed = signupSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  try {
    const existing = await getCustomerByEmail(parsed.data.email);
    if (existing) {
      return errorResponse("An account already exists for this email.", 400);
    }

    let medusaToken: string | null = null;
    if (getMedusaConfig()) {
      const medusaAccount = await medusaRegisterCustomerAccount(parsed.data);
      medusaToken = medusaAccount.token;
    }

    const customer = getMedusaConfig()
      ? await upsertCustomerAccount(parsed.data)
      : await createCustomerAccount(parsed.data);
    const session = await createCustomerSession(customer.id);
    const cookie = createCustomerSessionCookie(session.token, session.expiresAt);
    const response = jsonResponse({ customer: safeCustomer(customer) }, { status: 201 });
    response.headers.append("Set-Cookie", serializeCookie(cookie));
    if (medusaToken) {
      response.headers.append(
        "Set-Cookie",
        serializeCookie(createMedusaCustomerTokenCookie(medusaToken, session.expiresAt)),
      );
    }
    return response;
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to create account.", 400);
  }
}
