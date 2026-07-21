import { NextRequest } from "next/server";
import { z } from "zod";
import { createCustomerAccount, safeCustomer } from "@/lib/backend/customer";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { createCustomerSession, createCustomerSessionCookie } from "@/lib/backend/session";

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
    const customer = await createCustomerAccount(parsed.data);
    const session = await createCustomerSession(customer.id);
    const cookie = createCustomerSessionCookie(session.token, session.expiresAt);
    const response = jsonResponse({ customer: safeCustomer(customer) }, { status: 201 });
    response.headers.append(
      "Set-Cookie",
      `${cookie.name}=${cookie.value}; Path=${cookie.path}; HttpOnly; SameSite=Lax; ${
        cookie.secure ? "Secure;" : ""
      } Expires=${cookie.expires.toUTCString()}`,
    );
    return response;
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to create account.", 400);
  }
}
