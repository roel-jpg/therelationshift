import { FacebookIcon, MailIcon, TwitterIcon } from './Icons';

// Lets a visitor share an article. The Relationshift has no accounts of its own, so there is
// no "follow us" variant: without a shareUrl this renders nothing.
export function ShareGroup({ className = '', shareUrl, title }: { className?: string; shareUrl?: string; title?: string }) {
  if (shareUrl) {
    const u = encodeURIComponent(shareUrl);
    const t = encodeURIComponent(title ?? 'The Relationshift');
    return (
      <div className={`share-group ${className}`}>
        <a className="fb" href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener" aria-label="Share on Facebook"><FacebookIcon /></a>
        <a className="tw" href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`} target="_blank" rel="noopener" aria-label="Share on Twitter"><TwitterIcon /></a>
        <a className="email" href={`mailto:?subject=${t}&body=${u}`} aria-label="Share by e-mail"><MailIcon /></a>
      </div>
    );
  }
  return null;
}
