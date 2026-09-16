import type { Metadata } from 'next';
import { StaticPage } from '@/components/StaticPage';

export const metadata: Metadata = { title: 'Disclaimer & Privacy Policy' };

// Imported from the original site; to be reviewed before launch.
export default function DisclaimerPage() {
  return <StaticPage pageKey="Disclaimer & Privacy Policy" title="Disclaimer & Privacy Policy" image="/media/site/single1.png" />;
}
