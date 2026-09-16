import type { Metadata } from 'next';
import { StaticPage } from '@/components/StaticPage';

export const metadata: Metadata = { title: 'About Us', description: 'The story of Andrea and Roel and how The Relationshift® came to be.' };

// Texts imported from the original site (2016). Edit content/pages.json to change them.
export default function AboutPage() {
  return <StaticPage pageKey="About US" title="About Us" image="/media/site/about.jpg" intro="Who we are and why we created The Relationshift®." />;
}
