'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Re-implementation of wow.js: elements with class "wow fadeInUp|fadeInRight|fadeInLeft" become visible
// (class "animated") once they scroll into view; data-wow-duration / data-wow-delay set the timing.
export function Wow() {
  const pathname = usePathname();
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.wow:not(.animated)'));
    if (reduce) { els.forEach((el) => el.classList.add('animated')); return; }
    const show = (el: HTMLElement) => {
      const d = el.dataset.wowDuration; const dl = el.dataset.wowDelay;
      if (d) el.style.animationDuration = d;
      if (dl) el.style.animationDelay = dl;
      el.classList.add('animated');
    };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { show(e.target as HTMLElement); io.unobserve(e.target); }
    }, { threshold: 0.05 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
