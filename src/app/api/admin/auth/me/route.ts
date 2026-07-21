import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/backend/http";
import { getAdminSession } from "@/lib/backend/session";

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  return jsonResponse({
    authenticated: !!session,
    user: session ? { id: session.user.id, email: session.user.email, role: session.user.role } : null,
  });
}
