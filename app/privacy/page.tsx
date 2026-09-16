import type { Metadata } from 'next';
import pages from '@/content/pages.json';

export const metadata: Metadata = { title: 'Disclaimer & privacy' };

// Imported from the original site; to be reviewed before launch.
export default function PrivacyPage() {
  const text = (pages as Record<string, string>)['Disclaimer & Privacy Policy'] ?? '';
  return (
    <div className="container narrow page">
      <h1>Disclaimer &amp; privacy policy</h1>
      <div className="rich" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}
