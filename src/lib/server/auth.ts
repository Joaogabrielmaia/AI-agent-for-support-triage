import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { MAX_AGE_S, makeToken, readToken } from "./crypto";
import { db } from "./db";

const COOKIE = "prumo_session";

export async function startSession(userId: string): Promise<void> {
  (await cookies()).set(COOKIE, makeToken(userId), { httpOnly: true, sameSite: "lax", path: "/", maxAge: MAX_AGE_S });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function currentUser() {
  const id = readToken((await cookies()).get(COOKIE)?.value);
  if (!id) return null;
  return db.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true } });
}

/** Server-side guard used by every staff page and action (RNF-05). */
export async function requireUser(roles?: Role[]) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (roles && !roles.includes(user.role)) redirect("/tickets");
  return user;
}
