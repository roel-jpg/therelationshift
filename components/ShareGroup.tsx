import { FacebookIcon, InstagramIcon, MailIcon, TwitterIcon } from './Icons';

const SOCIAL = {
  facebook: 'https://www.facebook.com/therelationshift',
  twitter: 'https://twitter.com/relationshift',
  instagram: 'https://www.instagram.com/therelationshift',
};

// Circles with social icons (original ".share-group"). With `shareUrl` it becomes a share widget for an article.
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
  return (
    <div className={`share-group ${className}`}>
      <a className="fb" href={SOCIAL.facebook} target="_blank" rel="noopener" aria-label="Facebook"><FacebookIcon /></a>
      <a className="tw" href={SOCIAL.twitter} target="_blank" rel="noopener" aria-label="Twitter"><TwitterIcon /></a>
      <a className="ig" href={SOCIAL.instagram} target="_blank" rel="noopener" aria-label="Instagram"><InstagramIcon /></a>
    </div>
  );
}
