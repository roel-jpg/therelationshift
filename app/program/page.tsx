import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/session';
import texts from '@/content/site-texts.json';
import { OnePage } from '@/components/OnePage';
import { BookstoreFooter } from '@/components/Books';

type Hardcode = Record<string, string>;
const site = texts as unknown as { hardcode: Record<string, unknown>; hardcode_meta: Record<string, Record<string, string>> };
const hc = ((site.hardcode.en as Hardcode | undefined) ?? (site.hardcode as Hardcode));
const meta = site.hardcode_meta?.en ?? {};

export const metadata: Metadata = {
  title: { absolute: meta.program_meta_title ?? 'How to start the program? | The Relationshift' },
  description: meta.program_meta_description,
};

export default async function ProgramPage() {
  const user = await getCurrentUser();
  const sections = [1, 2, 3, 4, 5].map((n) => ({
    title: hc[`program_${n}_title`] ?? '',
    description: hc[`program_${n}_description`] ?? '',
    image: `/media/site/program-${n}.jpg`,
    darker: [1, 4, 5].includes(n),
  }));
  return (
    <>
      <OnePage sections={sections} joinHref={user ? '/dashboard' : '/program/days'} joinLabel={user ? 'Go to my program' : 'See the 21 days'} />
      <BookstoreFooter title={hc.shop_title} subtitle={hc.shop_subtitle} description={hc.shop_description} />
    </>
  );
}
