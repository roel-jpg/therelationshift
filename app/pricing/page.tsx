import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import texts from '@/content/site-texts.json';
import { BookHead } from '@/components/BookHead';
import { BookstoreFooter } from '@/components/Books';
import { ArrowRight } from '@/components/Icons';

type Hardcode = Record<string, string>;
const site = texts as unknown as { hardcode: Record<string, unknown>; locale: Record<string, Record<string, string>>; hardcode_meta: Record<string, Record<string, string>> };
const hc = ((site.hardcode.en as Hardcode | undefined) ?? (site.hardcode as Hardcode));
const loc = site.locale?.en ?? {};
const meta = site.hardcode_meta?.en ?? {};

export const metadata: Metadata = { title: { absolute: meta.pricing_meta_title ?? 'Pricing | The Relationshift' }, description: meta.pricing_meta_description };

// The program is free at the moment; the two "plans" of the original pricing page are kept so paid bundles can return later.
export default async function PricingPage() {
  const user = await getCurrentUser();
  const joinHref = user ? '/dashboard' : '/signup';
  return (
    <>
      <BookHead image="/media/site/pricing.jpg" title={loc.banner_title ?? 'Pricing'} center text="The complete 21-day Relationshift® program is free for every couple. Start today and experience what it can do for your relationship!" />
      <div className="pricing-container">
        <div className="pricing-group">
          <div className="pricing-left">
            <div className="title">{loc.start_your_1 ?? 'Start Your'}<br /><span className="line">{loc.start_your_2 ?? 'Program Now'}</span></div>
            <div className="the-content">
              <p>{loc.paragraph_1}</p>
              <p>{loc.paragraph_2}</p>
            </div>
          </div>
          <div className="pricing-right">
            <div className="plan popular">
              <div className="price">The Relationshift® program</div>
              <ul>
                <li>{loc.day ?? 'Day'} 1<span className="free">{loc.free ?? 'Free'}</span><span className="day">Try the first exercise without an account</span></li>
                <li>{loc.week ?? 'Week'} 1<span className="free">{loc.free ?? 'Free'}</span><span className="day">{loc.day ?? 'Day'} 2 – 7</span></li>
                <li>{loc.week ?? 'Week'} 2<span className="free">{loc.free ?? 'Free'}</span><span className="day">{loc.day ?? 'Day'} 8 – 14</span></li>
                <li>{loc.week ?? 'Week'} 3<span className="free">{loc.free ?? 'Free'}</span><span className="day">{loc.day ?? 'Day'} 15 – 21</span></li>
              </ul>
              <div className="read-more">
                <Link href={joinHref} className="btn-gradient"><span>{user ? 'Go to my program' : loc.start_free_trial ?? 'Start for free'}</span><ArrowRight /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BookstoreFooter title={hc.shop_title} subtitle={hc.shop_subtitle} description={hc.shop_description} />
    </>
  );
}
