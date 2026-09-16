'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookItem, CATEGORIES, type Product } from './Books';

const DESCRIPTIONS: Record<string, string> = {
  Books: 'We have selected some great books that will help you and your partner along the way. They are delivered to you by Amazon.',
  Movies: 'Movies about love and relationships to watch together on the couch.',
  Music: 'Music to set the mood for your exercises.',
  'Games, Apps & Toys': 'Games, apps and toys that bring some play into your relationship.',
};

export function ShopList({ products, initial = 'Books', joinHref }: { products: Product[]; initial?: string; joinHref: string }) {
  const [cat, setCat] = useState(initial);
  const [limit, setLimit] = useState(12);
  const list = products.filter((p) => p.category === cat);
  return (
    <>
      <div className="book-head" style={{ backgroundImage: "url('/media/site/shop.jpg')" }}>
        <div className="book-head-container container">
          <div className="book-head-content">
            <div className="main-content">
              <div className="head category-name"><h1>{cat}</h1></div>
              <div className="content category-desc"><p>{DESCRIPTIONS[cat]}</p></div>
            </div>
          </div>
          <div className="book-nav">
            <div className="book-navigation">
              {CATEGORIES.map((c) => (
                <button key={c} type="button" className={`nav${c === cat ? ' nav-active' : ''}`} style={{ background: 'none', border: 0, font: 'inherit', fontSize: 16 }} onClick={() => { setCat(c); setLimit(12); }}>{c}</button>
              ))}
              <Link href={joinHref} className="nav bg-red">Join now</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="books-list">
        <div className="group-book-item container">
          {list.slice(0, limit).map((p) => <BookItem key={p.id} p={p} />)}
          {list.length > limit && (
            <div className="load-more">
              <button type="button" className="btn-gradient" style={{ height: 38, width: 200 }} onClick={() => setLimit((l) => l + 12)}>Load More</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
