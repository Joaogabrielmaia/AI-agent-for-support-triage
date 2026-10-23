import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const MAX_AGE_S = 60 * 60 * 8;

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET ausente ou curto demais (veja .env.example)");
  return s;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const a = Buffer.from(hash, "hex");
  const b = scryptSync(password, salt, 64);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function makeToken(userId: string, now = Date.now()): string {
  const payload = `${userId}.${now + MAX_AGE_S * 1000}`;
  return `${payload}.${sign(payload)}`;
}

export function readToken(token: string | undefined, now = Date.now()): string | null {
  if (!token) return null;
  const i = token.lastIndexOf(".");
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = sign(payload);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const [userId, exp] = payload.split(".");
  return Number(exp) > now ? userId : null;
}

