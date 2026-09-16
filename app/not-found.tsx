import Link from 'next/link';
import { BookHead } from '@/components/BookHead';

export default function NotFound() {
  return (
    <>
      <BookHead image="/media/site/hero-1.jpg" title="Page not found" text="That page does not exist (or not anymore)." />
      <div className="container page center">
        <Link href="/" className="btn-gradient">Back to the start</Link>
      </div>
    </>
  );
}
