import type { Metadata } from 'next';
import { StaticPage } from '@/components/StaticPage';

export const metadata: Metadata = { title: 'Our Beliefs' };

export default function BeliefsPage() {
  return <StaticPage pageKey="Our Beliefs" title="Our Beliefs" image="/media/site/beliefs.jpg" intro="What we believe about love, relationships and a little bit of maintenance." />;
}
