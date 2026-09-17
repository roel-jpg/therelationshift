import { one } from '@/lib/db';

// A page the watchdog can ask "are you still there?". Says nothing about anyone.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const started = Date.now();
  try {
    const exercises = await one<{ c: number }>('SELECT COUNT(*) AS c FROM exercises');
    const days = Number(exercises?.c ?? 0);
    const ok = days === 21;
    return Response.json(
      { ok, days, database: 'reachable', ms: Date.now() - started },
      { status: ok ? 200 : 503, headers: { 'cache-control': 'no-store' } },
    );
  } catch (err) {
    console.error('[health] database unreachable', err);
    return Response.json(
      { ok: false, database: 'unreachable', ms: Date.now() - started },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    );
  }
}
