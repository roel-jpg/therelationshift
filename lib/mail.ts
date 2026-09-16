// Outgoing e-mail via the Resend HTTP API (no npm dependency needed).
// Without RESEND_API_KEY nothing is sent — the caller keeps working, the message is still stored.

const ENDPOINT = 'https://api.resend.com/emails';

export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'roel@therelationshift.com';
const FROM = process.env.MAIL_FROM || 'The Relationshift <onboarding@resend.dev>';

export type MailResult = 'sent' | 'skipped' | 'failed';

export async function sendMail({ to, subject, text, replyTo }: {
  to?: string; subject: string; text: string; replyTo?: string;
}): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return 'skipped';
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [to || CONTACT_EMAIL], subject, text, reply_to: replyTo }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error('[mail] resend rejected the message', res.status, await res.text().catch(() => ''));
      return 'failed';
    }
    return 'sent';
  } catch (err) {
    console.error('[mail] could not reach resend', err);
    return 'failed';
  }
}
