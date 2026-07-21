import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/backend/http";
import { CUSTOMER_SESSION_COOKIE, destroyCustomerSession } from "@/lib/backend/session";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (token) await destroyCustomerSession(token);

  const response = jsonResponse({ ok: true });
  response.headers.append("Set-Cookie", `${CUSTOMER_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  return response;
}
