import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogCard } from '@/components/news/BlogCard';
import { ShareGroup } from '@/components/ShareGroup';
import { fmtDate, limit, postImage, posts } from '@/lib/news';

export const metadata: Metadata = { title: 'News', description: 'News, workshops and stories from The Relationshift®.' };

export default function NewsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const [featured, ...rest] = posts;
  const medium = rest.slice(0, 2);
  const small = rest.slice(2);
  return (
    <>
      <div className="big-featured" style={{ backgroundImage: `url(${postImage(featured)})` }}>
        <div className="featured-content">
          <div className="date">{fmtDate(featured.date)}</div>
          <div className="title"><Link href={`/news/${featured.slug}`}><h2 className="heading">{featured.title}</h2></Link></div>
          <div className="summary">
            {limit(featured.excerpt, 150)} <Link href={`/news/${featured.slug}`}><strong>Read the Story</strong></Link>
          </div>
          <ShareGroup shareUrl={`${siteUrl}/news/${featured.slug}`} title={featured.title} />
        </div>
      </div>
      <div className="container-blog container">
        <div className="featured-title">Featured Stories</div>
        <div className="medium-list">
          {medium.map((p) => <BlogCard key={p.id} p={p} siteUrl={siteUrl} />)}
        </div>
      </div>
      <div className="container-thumb container">
        <div className="small-list">
          {small.map((p) => <BlogCard key={p.id} p={p} small siteUrl={siteUrl} />)}
        </div>
      </div>
    </>
  );
}
