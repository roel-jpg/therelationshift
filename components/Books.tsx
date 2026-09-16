import Link from 'next/link';
import { ArrowRight, CartIcon } from './Icons';
import productsJson from '@/content/products.json';

export type Product = { id: number; name: string; url: string; author: string; for: string; cover: string; category: string };
export const products = productsJson as Product[];
export const CATEGORIES = ['Books', 'Movies', 'Music', 'Games, Apps & Toys'];

export function BookItem({ p }: { p: Product }) {
  return (
    <a className="book-item" href={p.url} target="_blank" rel="noopener nofollow">
      <div className="book-images">
        <div className="images" style={{ backgroundImage: `url(${p.cover})` }} />
        <div className="buy-btn"><CartIcon /></div>
      </div>
      <div className="book-title">{p.name}</div>
      <div className="book-author">{p.author}</div>
    </a>
  );
}

// Grey "visit our shop" band shown above the footer on home, program and pricing (original .bookstore-footer).
export function BookstoreFooter({ title, subtitle, description }: { title: string; subtitle: string; description: string }) {
  const picks = products.filter((p) => p.category === 'Books').slice(0, 4);
  return (
    <section className="bookstore-footer">
      <div className="bookstore-group container">
        <div className="action-book">
          <div className="small-head">{subtitle}</div>
          <div className="big-head">{title}</div>
          <div className="desc" dangerouslySetInnerHTML={{ __html: description }} />
          <div className="read-more">
            <Link href="/shop" className="btn-gradient w200"><span>Visit Shop</span><ArrowRight /></Link>
          </div>
        </div>
        <div className="books-list-band">
          <div className="group-book-item">
            {picks.map((p) => <BookItem key={p.id} p={p} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
