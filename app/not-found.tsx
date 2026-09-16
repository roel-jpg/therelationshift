import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container narrow section center">
      <h1>Page not found</h1>
      <p className="muted">That page does not exist (or not anymore).</p>
      <Link href="/" className="btn secondary">Back to the start</Link>
    </div>
  );
}
