import { NextRequest } from "next/server";
import { safeCustomer } from "@/lib/backend/customer";
import { jsonResponse } from "@/lib/backend/http";
import { getCustomerSession } from "@/lib/backend/session";

export async function GET(request: NextRequest) {
  const session = await getCustomerSession(request);
  return jsonResponse({
    authenticated: !!session,
    customer: session ? safeCustomer(session.customer) : null,
  });
}
