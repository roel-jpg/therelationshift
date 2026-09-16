import newsJson from '@/content/news.json';

export type Post = { id: number; title: string; slug: string; date: string; content: string; excerpt: string; image: string | null; youtube: string | null };

const FALLBACK_IMAGES = ['/media/site/hero-1.jpg', '/media/site/hero-2.jpg', '/media/site/hero-3.jpg', '/media/site/how-bg.jpg'];

export const posts: Post[] = (newsJson as unknown as Post[])
  .map((p) => ({ ...p, youtube: p.youtube && p.youtube !== 'None' ? p.youtube : null }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const postImage = (p: Post) => p.image ?? FALLBACK_IMAGES[Number(p.id) % FALLBACK_IMAGES.length];

export const findPost = (slug: string) => posts.find((p) => p.slug === slug);

export function youtubeEmbed(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
export const limit = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
