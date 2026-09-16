import Link from 'next/link';
import { ShareGroup } from '../ShareGroup';
import { fmtDate, limit, postImage, type Post } from '@/lib/news';

export function BlogCard({ p, small, siteUrl }: { p: Post; small?: boolean; siteUrl: string }) {
  const href = `/news/${p.slug}`;
  return (
    <div className={`blog-card blog-listing-hover ${small ? 'small-content' : 'medium-content'}`}>
      <Link href={href} className="images-box">
        <div className="images" style={{ backgroundImage: `url(${postImage(p)})` }}>
          <ShareGroup shareUrl={`${siteUrl}${href}`} title={p.title} className="card-share" />
        </div>
      </Link>
      <div className="date">{fmtDate(p.date)}</div>
      <div className="title"><h2><Link href={href}>{limit(p.title, small ? 55 : 50)}</Link></h2></div>
      <div className="desc">{limit(p.excerpt, small ? 90 : 140)}</div>
      <div className="read-more"><Link href={href}>Read more <span className="line" /></Link></div>
    </div>
  );
}
