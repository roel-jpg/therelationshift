import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { coupleMembers, findUserById, type Member, type User } from './repo';

const COOKIE = 'rs_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s === 'change-me') {
    if (process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET is not set');
    return 'dev-secret-not-for-production';
  }
  return s;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export async function createSession(userId: string) {
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp: Date.now() + MAX_AGE * 1000 })).toString('base64url');
  const store = await cookies();
  store.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

function readSessionUserId(value: string | undefined): string | null {
  if (!value) return null;
  const [payload, sig] = value.split('.');
  if (!payload || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(payload));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { uid: string; exp: number };
    if (!data.uid || data.exp < Date.now()) return null;
    return data.uid;
  } catch {
    return null;
  }
}

export type CurrentUser = User & { partner: Member | null };

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const store = await cookies();
  const uid = readSessionUserId(store.get(COOKIE)?.value);
  if (!uid) return null;
  const user = await findUserById(uid);
  if (!user) return null;
  let partner: Member | null = null;
  if (user.coupleId) {
    partner = (await coupleMembers(user.coupleId)).find((m) => m.id !== user.id) ?? null;
  }
  return { ...user, partner };
}
