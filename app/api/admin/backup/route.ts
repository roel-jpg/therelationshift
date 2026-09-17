import { timingSafeEqual } from 'node:crypto';
import { query } from '@/lib/db';

// A full copy of the database for the nightly backup. Locked behind BACKUP_TOKEN;
// without that variable the route does not exist as far as the world is concerned.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorised(req: Request): boolean {
  const expected = process.env.BACKUP_TOKEN;
  if (!expected || expected.length < 20) return false;
  const given = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  if (!authorised(req)) return new Response('Not found', { status: 404 });

  const [users, couples, invites, answers, messages] = await Promise.all([
    query('SELECT * FROM users ORDER BY created_at'),
    query('SELECT * FROM couples ORDER BY started_at'),
    query('SELECT * FROM invites ORDER BY created_at'),
    query('SELECT * FROM answers ORDER BY updated_at'),
    query('SELECT * FROM messages ORDER BY created_at'),
  ]);

  const body = JSON.stringify({
    takenAt: new Date().toISOString(),
    counts: { users: users.length, couples: couples.length, invites: invites.length, answers: answers.length, messages: messages.length },
    users, couples, invites, answers, messages,
  });

  return new Response(body, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
    },
  });
}
