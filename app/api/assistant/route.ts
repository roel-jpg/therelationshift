import { SYSTEM_PROMPT } from '@/lib/assistant-context';

// Doctor Love: answers questions about the programme. Conversations are not stored anywhere.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = process.env.ASSISTANT_MODEL || 'claude-haiku-4-5-20251001';
const MAX_MESSAGES = 14;
const MAX_CHARS = 1000;

const OFFLINE = 'Doctor Love is offline at the moment. Please use the form on the support page — Roel or Andrea will answer you personally.';
const BUSY = 'You have asked quite a few questions in a short while. Give it a minute, or use the form on the support page so a real person can help you.';

type Msg = { role: 'user' | 'assistant'; content: string };

// Best-effort brake per serverless instance: enough to stop a stuck script, not a security measure.
const hits = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) hits.clear();
  return recent.length > 25;
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ reply: OFFLINE, offline: true });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (tooMany(ip)) return Response.json({ reply: BUSY });

  let messages: Msg[];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return Response.json({ reply: OFFLINE });
  }

  const clean = messages
    .filter((m): m is Msg => !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim().length > 0)
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (!clean.length || clean[clean.length - 1].role !== 'user') {
    return Response.json({ reply: 'Ask me anything about the programme and I will do my best.' });
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        temperature: 0.4,
        system: SYSTEM_PROMPT,
        messages: clean,
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!res.ok) {
      console.error('[assistant] model call failed', res.status, await res.text().catch(() => ''));
      return Response.json({ reply: OFFLINE });
    }

    const data = await res.json();
    const reply = (data?.content ?? [])
      .filter((b: { type?: string }) => b?.type === 'text')
      .map((b: { text?: string }) => b.text ?? '')
      .join('')
      .trim();

    return Response.json({ reply: reply || OFFLINE });
  } catch (err) {
    console.error('[assistant] could not reach the model', err);
    return Response.json({ reply: OFFLINE });
  }
}
