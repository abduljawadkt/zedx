import type { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/backend/session";

export async function getCurrentUser(request: NextRequest) {
  return getAdminSession(request);
}

export async function requireAdmin(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function hasAdminAccess(request?: NextRequest) {
  if (!request) return false;
  return Boolean(await getAdminSession(request));
}
