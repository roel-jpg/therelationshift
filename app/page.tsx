import Link from 'next/link';
import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/session';
import texts from '@/content/site-texts.json';
import { HeroSlider } from '@/components/home/HeroSlider';
import { HowItWorks } from '@/components/home/HowItWorks';
import { MapSection } from '@/components/home/MapSection';
import { Testimonials } from '@/components/home/Testimonials';
import { BookstoreFooter } from '@/components/Books';
import { ArrowRight } from '@/components/Icons';

type Hardcode = Record<string, string>;
type TestimonialRow = { name: string; images: string; url: string };
type Marker = { name: string; x: number | null; y: number | null };

const site = texts as unknown as {
  hardcode: Record<string, unknown>;
  testimonial: Record<string, TestimonialRow>;
  markerList: Record<string, Marker>;
  hardcode_meta: Record<string, Record<string, string>>;
};
const hc = ((site.hardcode.en as Hardcode | undefined) ?? (site.hardcode as Hardcode));
const meta = site.hardcode_meta?.en ?? {};

export const metadata: Metadata = {
  title: { absolute: meta.home_meta_title ?? 'You want to improve your relationship? | The Relationshift' },
  description: meta.home_meta_description,
};

const testimonials = Object.values(site.testimonial)
  .filter((t) => t.images !== 'nl')
  .map((t) => ({ name: t.name, flag: t.images, text: t.url }));
const markers = Object.values(site.markerList ?? {});
const nationalityCount = new Set(markers.filter((m) => m.x != null && m.name !== 'Country ID').map((m) => m.name)).size;

export default async function Home() {
  const user = await getCurrentUser();
  const joinHref = user ? '/dashboard' : '/signup';
  const steps = [1, 2, 3, 4, 5].map((n) => ({ title: hc[`how_${n}_title`] ?? '', description: hc[`how_${n}_description`] ?? '' }));

  return (
    <>
      <HeroSlider images={['/media/site/hero-1.jpg', '/media/site/hero-2.jpg', '/media/site/hero-3.jpg']} />

      <div className="slider-content">
        <div className="slider-box">
          <div className="big-banner wow fadeInUp" data-wow-duration="1s" data-wow-delay=".6s">
            <img src="/media/site/app.png" alt="The Relationshift app" />
          </div>
          <div className="slider-main-content wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
            <div className="head wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s"><h1>{hc.slider_title}</h1></div>
            <div className="content wow fadeInUp" data-wow-duration="1s" data-wow-delay=".7s">{hc.slider_text}</div>
            <div className="read-more wow fadeInUp" data-wow-duration="1s" data-wow-delay=".9s">
              <div className="group-center">
                <Link href={joinHref} className="btn-gradient"><span>{user ? 'My program' : 'Join now'}</span><ArrowRight /></Link>
                <Link href="/program/day/1" className="btn-gradient"><span>Try day 1</span><ArrowRight /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content-home">
        {/* How it works */}
        <section className="home-description" style={{ backgroundImage: "url('/media/site/how-bg.jpg')" }}>
          <div className="home-description-container container">
            <div className="block-head">
              <div className="left wow fadeInUp" data-wow-duration=".8s" data-wow-delay=".6s">
                <div className="desc-head">{hc.how_title}</div>
                <div className="desc-slogan"><h2>{hc.how_subtitle}</h2></div>
                <div className="desc wow fadeInUp" data-wow-duration=".8s" data-wow-delay=".7s">
                  {hc.how_left}
                  <div className="read-more">
                    <Link href="/program" className="btn-gradient w200"><span>Learn more</span><ArrowRight /></Link>
                  </div>
                </div>
              </div>
              <div className="right wow fadeInUp" data-wow-duration="1s" data-wow-delay=".6s">
                {hc.how_right}
                <div className="read-more read-more-mobile">
                  <Link href="/program" className="btn-gradient w200"><span>Learn more</span><ArrowRight /></Link>
                </div>
              </div>
            </div>
            <HowItWorks steps={steps} joinHref={joinHref} />
          </div>
        </section>

        <MapSection
          title={hc.map_title}
          markers={markers}
          columns={{ c1: hc.map_column_1, c2: hc.map_column_2, c2items: [hc.map_column_2_content_1, hc.map_column_2_content_2, hc.map_column_2_content_3], c3: hc.map_column_3 }}
          exercisesCompleted="29.000+"
          nationalities={`${hc.map_nationality} Couples from ${nationalityCount}+ countries have joined so far.`}
        />

        <Testimonials items={testimonials} title={hc.testimonial_title} intro={hc.testimonial_description} joinHref={joinHref} joinLabel={hc.testimonial_button_join ?? 'Join Now'} />

        <BookstoreFooter title={hc.shop_title} subtitle={hc.shop_subtitle} description={hc.shop_description} />
      </div>
    </>
  );
}
