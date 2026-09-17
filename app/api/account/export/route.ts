import { exportUserData } from '@/lib/repo';
import { getCurrentUser } from '@/lib/session';

// Portability: everything we hold about you, as one JSON file.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new Response('Please sign in first.', { status: 401 });

  const data = await exportUserData(user.id);
  const date = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': `attachment; filename="relationshift-my-data-${date}.json"`,
      'cache-control': 'no-store',
    },
  });
}
