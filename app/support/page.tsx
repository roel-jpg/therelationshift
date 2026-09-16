import type { Metadata } from 'next';
import texts from '@/content/site-texts.json';
import { BookHead } from '@/components/BookHead';
import { Faq, type FaqItem } from '@/components/Faq';
import { ContactForm } from '@/components/ContactForm';
import { ShareGroup } from '@/components/ShareGroup';

type Hardcode = Record<string, unknown>;
const site = texts as unknown as { hardcode: Record<string, unknown>; locale: Record<string, Record<string, string>>; hardcode_meta: Record<string, Record<string, string>> };
const hc = ((site.hardcode.en as Hardcode | undefined) ?? (site.hardcode as Hardcode));
const loc = site.locale?.en ?? {};
const meta = site.hardcode_meta?.en ?? {};
const faq = Object.values((hc.faq as Record<string, FaqItem>) ?? {});

export const metadata: Metadata = { title: { absolute: meta.support_meta_title ?? 'Support | The Relationshift' }, description: meta.support_meta_description };

export default function SupportPage() {
  return (
    <>
      <BookHead image="/media/site/support.jpg" title={String(hc.support_title)} text={String(hc.support_description)} />
      <div className="register-form container support-only">
        <div className="register-container">
          <div className="left">
            <div className="head">{String(hc.faq_sec_header)}</div>
            <Faq items={faq} />
          </div>
          <div className="right">
            <ContactForm labels={{
              name: String(hc.contact_lbl_first_name ?? 'Name'),
              email: String(hc.contact_lbl_email ?? 'E-mail'),
              question: String(hc.contact_lbl_question ?? 'Your question or feedback'),
              submit: loc.submit ?? 'Submit',
              thanks: 'Thank you! We will come back to you as soon as possible.',
            }} />
            <ShareGroup className="support" />
          </div>
        </div>
      </div>
    </>
  );
}
