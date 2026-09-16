import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShareGroup } from '@/components/ShareGroup';
import { ChevronLeft, ChevronRight } from '@/components/Icons';
import { findPost, fmtDate, postImage, posts, youtubeEmbed } from '@/lib/news';
import { richHtml } from '@/lib/rich';

export function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = findPost(slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

export default async function NewsSingle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = findPost(slug);
  if (!p) notFound();
  const i = posts.indexOf(p);
  const prev = posts[i + 1]; // older
  const next = posts[i - 1]; // newer
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const yt = youtubeEmbed(p.youtube);
  return (
    <>
      <div className="featured-single" style={{ backgroundImage: `url(${postImage(p)})` }} />
      <div className="dynamic-page">
        <div className="single-content container news-content">
          <div className="title-share">
            <div className="title">{p.title}</div>
            <div className="author">by Relationshift · {fmtDate(p.date)}</div>
            <ShareGroup shareUrl={`${siteUrl}/news/${p.slug}`} title={p.title} />
          </div>
          <div className="single-main-content">
            <div className="content" dangerouslySetInnerHTML={{ __html: richHtml(p.content) }} />
            {yt && <div className="youtube"><iframe src={yt} title={p.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>}
            <div className="share-bottom">
              <div className="share-head">Share this article</div>
              <ShareGroup shareUrl={`${siteUrl}/news/${p.slug}`} title={p.title} />
            </div>
          </div>
        </div>
      </div>
      <div className="next-prev">
        {prev ? (
          <Link href={`/news/${prev.slug}`} className="prev" style={{ backgroundImage: `url(${postImage(prev)})` }}>
            <div className="content"><ChevronLeft /><div className="title">{prev.title}</div></div>
          </Link>
        ) : <span className="prev" />}
        {next ? (
          <Link href={`/news/${next.slug}`} className="next" style={{ backgroundImage: `url(${postImage(next)})` }}>
            <div className="content"><ChevronRight /><div className="title">{next.title}</div></div>
          </Link>
        ) : <Link href="/news" className="next" style={{ backgroundImage: `url(/media/site/hero-3.jpg)` }}><div className="content"><ChevronRight /><div className="title">All news</div></div></Link>}
      </div>
    </>
  );
}
