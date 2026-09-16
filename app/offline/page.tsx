import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Offline' };

// Shown by the service worker when a page is opened without a connection.
export default function OfflinePage() {
  return (
    <div className="container narrow page page-offset center">
      <h1>You are offline</h1>
      <p className="muted">
        This page needs a connection. Exercises you already opened stay available, and everything you
        wrote is saved as soon as you are back online.
      </p>
      <Link href="/dashboard" className="btn-gradient">Try again</Link>
    </div>
  );
}
