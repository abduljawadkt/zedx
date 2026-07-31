import { NextRequest } from "next/server";
import { z } from "zod";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { prisma } from "@/lib/backend/prisma";
import { createAdminSession, createSessionCookie } from "@/lib/backend/session";
import { hashPassword, verifyPassword } from "@/lib/backend/password";
import { seedDatabaseIfNeeded } from "@/lib/backend/seed";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  await seedDatabaseIfNeeded();
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return errorResponse(parsed.error.message, 400);
  }

  const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return errorResponse("Invalid credentials.", 401);
  }

  const passwordOk = verifyPassword(parsed.data.password, user.passwordHash);
  if (!passwordOk) {
    return errorResponse("Invalid credentials.", 401);
  }

  if (!user.passwordHash.startsWith("pbkdf2$")) {
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(parsed.data.password) },
    });
  }

  const session = await createAdminSession(user.id);
  const response = jsonResponse({
    user: { id: user.id, email: user.email, role: user.role },
    authenticated: true,
  });

  response.headers.append(
    "Set-Cookie",
    `${createSessionCookie(session.token, session.expiresAt).name}=${createSessionCookie(session.token, session.expiresAt).value}; Path=/; HttpOnly; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure;" : ""} Expires=${session.expiresAt.toUTCString()}`,
  );

  return response;
}
