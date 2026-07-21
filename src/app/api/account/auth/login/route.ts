import { NextRequest } from "next/server";
import { z } from "zod";
import { safeCustomer, verifyCustomerLogin } from "@/lib/backend/customer";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { createCustomerSession, createCustomerSessionCookie } from "@/lib/backend/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const customer = await verifyCustomerLogin(parsed.data.email, parsed.data.password);
  if (!customer) return errorResponse("Invalid email or password.", 401);

  const session = await createCustomerSession(customer.id);
  const cookie = createCustomerSessionCookie(session.token, session.expiresAt);
  const response = jsonResponse({ customer: safeCustomer(customer) });
  response.headers.append(
    "Set-Cookie",
    `${cookie.name}=${cookie.value}; Path=${cookie.path}; HttpOnly; SameSite=Lax; ${
      cookie.secure ? "Secure;" : ""
    } Expires=${cookie.expires.toUTCString()}`,
  );
  return response;
}
