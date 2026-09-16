'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { hashPassword, verifyPassword } from './password';
import { createSession, destroySession, getCurrentUser } from './session';
import {
  coupleMembers, createCouple, createInviteRow, createUser, findInvite, findUserByEmail, findUserById,
  markInviteAccepted, openInviteFor, setUserCouple, touchLogin, upsertAnswer,
} from './repo';

export type ActionState = { error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

function safeNext(next: string): string {
  return next.startsWith('/') && !next.startsWith('//') ? next : '/program';
}

// ---------- Sign up / login / logout ----------

export async function signUp(_prev: ActionState, form: FormData): Promise<ActionState> {
  const firstName = str(form, 'firstName');
  const email = str(form, 'email').toLowerCase();
  const password = str(form, 'password');
  const invite = str(form, 'invite');
  const next = str(form, 'next');

  if (firstName.length < 1) return { error: 'Please tell us your first name.' };
  if (!EMAIL_RE.test(email)) return { error: 'That email address does not look right.' };
  if (password.length < 8) return { error: 'Use a password of at least 8 characters.' };
  if (await findUserByEmail(email)) return { error: 'There is already an account with this email. Try logging in.' };

  const user = await createUser({ firstName, email, passwordHash: hashPassword(password) });
  await createSession(user.id);

  if (invite && (await acceptInviteToken(invite, user.id)) === 'ok') redirect('/program?paired=1');
  redirect(safeNext(next));
}

export async function logIn(_prev: ActionState, form: FormData): Promise<ActionState> {
  const email = str(form, 'email').toLowerCase();
  const password = str(form, 'password');
  const invite = str(form, 'invite');
  const next = str(form, 'next');

  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) return { error: 'Email or password is incorrect.' };
  await touchLogin(user.id);
  await createSession(user.id);

  if (invite && (await acceptInviteToken(invite, user.id)) === 'ok') redirect('/program?paired=1');
  redirect(safeNext(next));
}

export async function logOut() {
  await destroySession();
  redirect('/');
}

// ---------- Partner invites ----------

export async function createInviteAction() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/program');
  if (!(await openInviteFor(user.id))) await createInviteRow(user.id);
  revalidatePath('/program');
}

type AcceptResult = 'ok' | 'not-found' | 'own' | 'already-paired' | 'sender-paired';

async function acceptInviteToken(token: string, userId: string): Promise<AcceptResult> {
  const invite = await findInvite(token);
  if (!invite || invite.acceptedAt) return 'not-found';
  if (invite.senderId === userId) return 'own';

  const me = await findUserById(userId);
  const sender = await findUserById(invite.senderId);
  if (!me || !sender) return 'not-found';
  if (me.coupleId) return 'already-paired';

  let coupleId = sender.coupleId;
  if (coupleId) {
    if ((await coupleMembers(coupleId)).length >= 2) return 'sender-paired';
  } else {
    coupleId = await createCouple();
    await setUserCouple(sender.id, coupleId);
  }
  await setUserCouple(userId, coupleId);
  await markInviteAccepted(invite.id);
  return 'ok';
}

export async function acceptInvite(token: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/signup?invite=${encodeURIComponent(token)}`);
  const result = await acceptInviteToken(token, user.id);
  if (result === 'ok') redirect('/program?paired=1');
  redirect(`/invite/${encodeURIComponent(token)}?status=${result}`);
}

export async function leaveCouple() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  await setUserCouple(user.id, null);
  revalidatePath('/program');
  revalidatePath('/account');
}

// ---------- Answers ----------

export async function saveAnswer(form: FormData) {
  const user = await getCurrentUser();
  const day = Number(form.get('day'));
  if (!Number.isInteger(day) || day < 1 || day > 21) return;
  if (!user) redirect(`/signup?next=${encodeURIComponent(`/program/day/${day}`)}`);

  let data: unknown = null;
  const raw = form.get('data');
  if (typeof raw === 'string' && raw.length > 0) {
    try { data = JSON.parse(raw); } catch { data = null; }
  }
  const reflection = str(form, 'reflection') || null;
  const ratingRaw = Number(form.get('rating'));
  const rating = ratingRaw >= 1 && ratingRaw <= 5 ? ratingRaw : null;

  await upsertAnswer(user.id, day, data, reflection, rating);
  revalidatePath('/program');
  revalidatePath(`/program/day/${day}`);
  redirect(`/program/day/${day}?done=1`);
}
