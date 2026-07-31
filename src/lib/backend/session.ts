import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/backend/prisma";

export const ADMIN_SESSION_COOKIE = "zedx_admin_session";
export const CUSTOMER_SESSION_COOKIE = "zedx_customer_session";
const SESSION_DAYS = 7;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_API_KEY;
  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET is required in production.");
  }

  return "zedx-session-secret";
}

export function createSessionToken() {
  return `${crypto.randomUUID()}.${crypto.randomBytes(24).toString("hex")}.${getSessionSecret().slice(0, 8)}`;
}

export async function createAdminSession(userId: string) {
  const token = createSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.adminSession.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function createCustomerSession(customerId: string) {
  const token = createSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.customerSession.create({
    data: {
      tokenHash,
      customerId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function getAdminSessionFromToken(token?: string) {
  if (!token) return null;

  const tokenHash = hashToken(token);
  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.adminSession.delete({ where: { tokenHash } }).catch(() => undefined);
    }
    return null;
  }

  return session;
}

export async function getAdminSession(request: NextRequest) {
  return getAdminSessionFromToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function getCustomerSessionFromToken(token?: string) {
  if (!token) return null;

  const tokenHash = hashToken(token);
  const session = await prisma.customerSession.findUnique({
    where: { tokenHash },
    include: { customer: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.customerSession.delete({ where: { tokenHash } }).catch(() => undefined);
    }
    return null;
  }

  return session;
}

export async function getCustomerSession(request: NextRequest) {
  return getCustomerSessionFromToken(request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
}

export async function destroyAdminSession(token: string) {
  return prisma.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } });
}

export async function destroyCustomerSession(token: string) {
  return prisma.customerSession.deleteMany({ where: { tokenHash: hashToken(token) } });
}

export function createSessionCookie(token: string, expiresAt: Date) {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  };
}

export function createCustomerSessionCookie(token: string, expiresAt: Date) {
  return {
    name: CUSTOMER_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  };
}
