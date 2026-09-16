'use client';

import { useEffect, useState } from 'react';

// Full-screen crossfading background slider, fixed behind the page (original Owl carousel "fade" slider).
export function HeroSlider({ images, interval = 5000 }: { images: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);
  return (
    <div className="slider" aria-hidden="true">
      {images.map((src, k) => (
        <div key={src} className={`slider-item${k === i ? ' active' : ''}`} style={{ backgroundImage: `url(${src})` }} />
      ))}
      <div className="owl-controls">
        <div className="owl-pagination">
          {images.map((src, k) => (
            <button key={src} type="button" className={`owl-page${k === i ? ' active' : ''}`} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
