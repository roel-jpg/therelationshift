'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown } from './Icons';

export type OnePageSection = { title: string; description: string; image: string; darker?: boolean };
const ANCHORS = ['one', 'two', 'three', 'four', 'five'];

// The original "one-page" program page: five full-screen sections with fixed dot pagination (fullPage.js look-alike).
export function OnePage({ sections, joinHref, joinLabel }: { sections: OnePageSection[]; joinHref: string; joinLabel: string }) {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true);
    img.src = sections[0]?.image ?? '';
    const t = setTimeout(() => setLoaded(true), 1500);
    return () => clearTimeout(t);
  }, [sections]);

  useEffect(() => {
    const els = ANCHORS.map((a) => document.getElementById(a)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (best) setActive(ANCHORS.indexOf(best.target.id));
    }, { threshold: [0.5] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(ANCHORS[i])?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="pagination" id="pagination" aria-label="Sections">
        {sections.map((_, i) => (
          <a key={i} href={`#${ANCHORS[i]}`} onClick={go(i)} aria-label={`Section ${i + 1}`}><span className={`page${i === active ? ' active' : ''}`} /></a>
        ))}
      </div>
      <div className="onepage" id="fullpage" style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(50px)', transition: 'all .5s ease' }}>
        {sections.map((s, i) => (
          <section key={i} id={ANCHORS[i]} className={`page-item${s.darker ? ' background-darker' : ''}`} style={{ backgroundImage: `url(${s.image})` }}>
            <div className="group-content">
              <div className="head wow fadeInUp" data-wow-duration=".8s" data-wow-delay=".3s">{i === 0 ? <h1>{s.title}</h1> : <h2>{s.title}</h2>}</div>
              <div className="content">
                <div className="content-center wow fadeInUp" data-wow-duration=".8s" data-wow-delay=".3s" dangerouslySetInnerHTML={{ __html: s.description }} />
                {i === sections.length - 1 ? (
                  <div className="read-more group-center wow fadeInUp" data-wow-duration=".8s" data-wow-delay=".5s">
                    <Link href={joinHref} className="btn-gradient"><span>{joinLabel}</span><ArrowRight /></Link>
                  </div>
                ) : (
                  <div className="group-center no-btn" />
                )}
              </div>
            </div>
            {i < sections.length - 1 && (
              <div className="pagination-mobile">
                <a className="bounce page-mobile" href={`#${ANCHORS[i + 1]}`} onClick={go(i + 1)} aria-label="Next section"><ChevronDown /></a>
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
