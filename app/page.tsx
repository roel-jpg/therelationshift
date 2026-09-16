import Link from 'next/link';
import { Honeycomb } from '@/components/Honeycomb';
import { listExercises } from '@/lib/repo';
import { getCurrentUser } from '@/lib/session';
import texts from '@/content/site-texts.json';

type Hardcode = Record<string, string>;
type Testimonial = { name: string; images: string; url: string };

const site = texts as unknown as { hardcode: Record<string, unknown>; testimonial: Record<string, Testimonial> };
const hc = ((site.hardcode.en as Hardcode | undefined) ?? (site.hardcode as Hardcode));
const testimonials = Object.values(site.testimonial);

export default async function Home() {
  const user = await getCurrentUser();
  const days = await listExercises();

  return (
    <>
      {/* Hero — full-bleed sunset photo from the original site */}
      <section className="hero" style={{ backgroundImage: "url('/media/site/hero-1.jpg')" }}>
        <div className="container">
          <div>
            <h1>{hc.slider_title ?? 'Welcome to The Relationshift®'}</h1>
            <p className="lead">{hc.slider_text}</p>
            <div className="actions">
              <Link href={user ? '/program' : '/signup'} className="btn">{user ? 'Go to my program' : 'Join now — it’s free'} <span className="arrow">→</span></Link>
              <Link href="/program/day/1" className="btn ghost">Try day 1 first</Link>
            </div>
          </div>
          <div className="hero-comb">
            <Honeycomb days={days.slice(0, 8)} size="small" link={false} />
          </div>
        </div>
      </section>

      {/* How it works — five numbered hexagons, as on the original home page */}
      <section className="section how" style={{ backgroundImage: "url('/media/site/how-bg.jpg')" }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{hc.how_title ?? 'How it works'}</span>
            <h2>{hc.how_subtitle ?? 'Your 21 day relationship workout'}</h2>
          </div>
          <div className="how-intro">
            <p>{hc.how_left}</p>
            <p>{hc.how_right}</p>
          </div>
          <div className="steps">
            {[1, 2, 3, 4, 5].map((n) => (
              <div className="step" key={n}>
                <div className="step-hex">{n}</div>
                <div>
                  <h3>{hc[`how_${n}_title`]}</h3>
                  <div className="rich" dangerouslySetInnerHTML={{ __html: hc[`how_${n}_description`] ?? '' }} />
                </div>
              </div>
            ))}
          </div>
          <p className="center" style={{ marginTop: 40 }}>
            <Link href={user ? '/program' : '/signup'} className="btn">Join now <span className="arrow">→</span></Link>
          </p>
        </div>
      </section>

      {/* The 21 days as a honeycomb */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The program</span>
            <h2>21 days, one exercise a day</h2>
            <p>Communication, intimacy, gratitude, meditation and your shared story. 5 to 25 minutes a day, together.</p>
          </div>
          <Honeycomb days={days} lockedFrom={user ? null : 2} />
          {!user && <p className="center muted small" style={{ marginTop: 16 }}>Day 1 is open to everyone. Create a free account to unlock all 21 days and do the program with your partner.</p>}
        </div>
      </section>

      {/* Community */}
      <section className="section community">
        <div className="container">
          <h2>{hc.map_title ?? 'Join the global community & feel connected'}</h2>
          <p style={{ maxWidth: 640, margin: '0 auto' }}>{hc.map_nationality}</p>
          <div className="stats">
            <div><strong>29,000+</strong><span>{hc.map_column_1 ?? 'exercises completed'}</span></div>
            <div><strong>34+</strong><span>nationalities</span></div>
            <div><strong>21</strong><span>days · 5–25 minutes each</span></div>
          </div>
        </div>
      </section>

      {/* Testimonials on the dark photo, as on the original */}
      <section className="section testimonials" style={{ backgroundImage: "url('/media/site/testimonial-bg.jpg')" }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow" style={{ color: '#fbb022' }}>Couples say</span>
            <h2>What it did for them</h2>
          </div>
          <div className="quotes">
            {testimonials.filter((t) => t.images !== "nl").slice(0, 6).map((t, i) => (
              <div className="quote" key={i}>
                <p>“{t.url}”</p>
                <div className="who">{t.name}</div>
              </div>
            ))}
          </div>
          <p className="center" style={{ marginTop: 36 }}>
            <Link href={user ? '/program' : '/signup'} className="btn">Start your 21 days <span className="arrow">→</span></Link>
          </p>
        </div>
      </section>
    </>
  );
}
