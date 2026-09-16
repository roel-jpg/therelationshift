'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { hashPassword, verifyPassword } from './password';
import { sendMail } from './mail';
import { button, esc, field, quote, renderEmail } from './email-template';
import { createSession, destroySession, getCurrentUser } from './session';
import {
  coupleMembers, createCouple, createInviteRow, createUser, findInvite, findUserByEmail, findUserById,
  createMessage, markInviteAccepted, openInviteFor, setUserCouple, touchLogin, upsertAnswer,
} from './repo';

export type ActionState = { error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

function safeNext(next: string): string {
  return next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
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

  if (invite && (await acceptInviteToken(invite, user.id)) === 'ok') redirect('/dashboard?paired=1');
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

  if (invite && (await acceptInviteToken(invite, user.id)) === 'ok') redirect('/dashboard?paired=1');
  redirect(safeNext(next));
}

export async function logOut() {
  await destroySession();
  redirect('/');
}

// ---------- Partner invites ----------

export async function createInviteAction() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/dashboard');
  if (!(await openInviteFor(user.id))) await createInviteRow(user.id);
  revalidatePath('/dashboard');
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
  if (result === 'ok') redirect('/dashboard?paired=1');
  redirect(`/invite/${encodeURIComponent(token)}?status=${result}`);
}

export async function leaveCouple() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  await setUserCouple(user.id, null);
  revalidatePath('/dashboard');
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
  const shared = form.get('share') === 'on';

  await upsertAnswer(user.id, day, data, reflection, rating, shared);
  revalidatePath('/dashboard');
  revalidatePath(`/program/day/${day}`);
  redirect(`/program/day/${day}?done=1`);
}

// ---------- Contact form (support page) ----------

export type ContactState = { ok?: boolean; error?: string } | undefined;

export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  const name = str(form, 'name');
  const email = str(form, 'email').toLowerCase();
  const message = str(form, 'message');
  if (!name) return { error: 'Please fill in your name, so we know who we are writing back to.' };
  if (!EMAIL_RE.test(email)) return { error: 'That e-mail address does not look right — we need it to answer you.' };
  if (message.length < 2) return { error: 'Please write your question or feedback in the box below.' };
  if (str(form, 'website')) return { ok: true }; // honeypot

  const body = message.slice(0, 5000);
  await createMessage({ name, email, message: body });

  // The message is stored either way; the e-mail is a notification on top of that.
  await sendMail({
    subject: `Relationshift contact form: ${name}`,
    replyTo: email,
    text: `${name} <${email}> wrote via the support page:\n\n${body}\n\nReply straight to this mail to answer ${name}.`,
    html: renderEmail({
      title: 'A message from the support page',
      preheader: `${name}: ${body.slice(0, 90)}`,
      body: field('From', name) + field('E-mail', email) + quote(body)
        + `<p style="margin:0;font-size:14px;line-height:1.6;color:#656772;">Replying to this mail answers ${esc(name)} directly.</p>`
        + button(`Reply to ${name}`, `mailto:${email}?subject=${encodeURIComponent('Re: your message to The Relationshift')}`),
    }),
  });

  return { ok: true };
}
