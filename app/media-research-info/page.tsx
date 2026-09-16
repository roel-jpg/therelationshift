import type { Metadata } from 'next';
import { StaticPage } from '@/components/StaticPage';

export const metadata: Metadata = { title: 'Media, Research & Info' };

export default function MediaPage() {
  return <StaticPage pageKey="Media Research & Info" title="Media, Research & Info" image="/media/site/media.jpg" position="bottom" intro="Press, workshops and research about The Relationshift® program." />;
}
