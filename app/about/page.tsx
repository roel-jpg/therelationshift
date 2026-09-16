import type { Metadata } from 'next';
import pages from '@/content/pages.json';

export const metadata: Metadata = { title: 'About' };

// Texts imported from the original site (2016). Edit content/pages.json to change them.
export default function AboutPage() {
  const about = (pages as Record<string, string>)['About US'] ?? '';
  const beliefs = (pages as Record<string, string>)['Our Beliefs'] ?? '';
  return (
    <div className="container narrow section">
      <h1>Our story</h1>
      <div className="rich block" dangerouslySetInnerHTML={{ __html: about }} />
      <h2>Our beliefs</h2>
      <div className="rich block" dangerouslySetInnerHTML={{ __html: beliefs }} />
    </div>
  );
}
