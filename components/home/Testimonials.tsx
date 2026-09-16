'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HEX_PATH } from '../Logo';
import { ArrowRight } from '../Icons';

export type Testimonial = { name: string; flag: string; text: string };

function FlagHex({ t, idx, active, onClick }: { t: Testimonial; idx: number; active: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`hexagon${active ? ' hexagon-active' : ''}`} onClick={onClick} aria-pressed={active} aria-label={`Testimonial by ${t.name}`}>
      <svg className="border" viewBox="0 -1 93 108" aria-hidden="true"><path d={HEX_PATH} fill="#f05f61" /></svg>
      <svg viewBox="0 -1 93 108" aria-hidden="true">
        <defs>
          <pattern id={`flag-${idx}`} patternUnits="userSpaceOnUse" width="93" height="108">
            <image href={`/media/site/flag-${t.flag}.png`} x="-54" y="-21" width="200" height="150" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        </defs>
        <path d={HEX_PATH} fill="#38375F" />
        <path d={HEX_PATH} fill={`url(#flag-${idx})`} />
      </svg>
      <svg className="overlay" viewBox="0 -1 93 108" aria-hidden="true"><path d={HEX_PATH} fill="#000" /></svg>
      <span className="name-testi">{t.name.length > 14 ? t.name.split(' ')[0] : t.name}</span>
    </button>
  );
}

// Testimonials section: flag hexagons in rows of 2 / 3 / 2, click swaps the quote (original behaviour).
export function Testimonials({ items, title, intro, joinHref, joinLabel }: { items: Testimonial[]; title: string; intro: string; joinHref: string; joinLabel: string }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const pick = (i: number) => {
    if (i === active) return;
    setVisible(false);
    setTimeout(() => { setActive(i); setVisible(true); }, 300);
  };
  const rows = [items.slice(0, 2), items.slice(2, 5), items.slice(5, 7)];
  const names = ['testimonial-one', 'testimonial-two', 'testimonial-three'];
  const cur = items[active];
  return (
    <section className="testimonial" style={{ backgroundImage: "url('/media/site/testimonial-bg.jpg')" }}>
      <div className="testi-container container">
        <div className="hexagon-list">
          <div className="hexagon-group">
            {rows.map((row, r) => (
              <div key={r} className={names[r]}>
                {row.map((t) => {
                  const idx = items.indexOf(t);
                  return <FlagHex key={idx} t={t} idx={idx} active={idx === active} onClick={() => pick(idx)} />;
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="testimonial-main-content">
          <div className="testimonial-head"><span>{title}</span></div>
          <div className="testimonial-intro">{intro}</div>
          <div className={`testimonial-content${visible ? ' testimonial-content-active' : ''}`}>{cur?.text}</div>
          <div className="author" style={{ opacity: visible ? 1 : 0 }}>
            <div className="border" />
            <div className="name">{cur?.name}</div>
          </div>
          <div className="read-more">
            <Link href={joinHref} className="btn-gradient"><span>{joinLabel}</span><ArrowRight /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
