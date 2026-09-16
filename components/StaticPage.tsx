import { BookHead } from './BookHead';
import pages from '@/content/pages.json';
import { richHtml } from '@/lib/rich';

// Static text page from the original site: parallax banner + content column (".book-head" + ".register-form").
export function StaticPage({ pageKey, title, image, intro, position, children }: {
  pageKey: string; title: string; image: string; intro?: string; position?: string; children?: React.ReactNode;
}) {
  const html = (pages as Record<string, string>)[pageKey] ?? '';
  return (
    <>
      <BookHead image={image} title={title} text={intro} position={position} />
      <div className="register-form container dynamic-page">
        <div className="register-container custom-html-input">
          {children}
          <div dangerouslySetInnerHTML={{ __html: richHtml(html) }} />
        </div>
      </div>
    </>
  );
}
