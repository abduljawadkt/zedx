import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/backend/http";
import { destroyAdminSession } from "@/lib/backend/session";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("zedx_admin_session")?.value;
  if (token) {
    await destroyAdminSession(token);
  }

  const response = jsonResponse({ authenticated: false });
  response.headers.append("Set-Cookie", `zedx_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  return response;
}
