import Link from 'next/link';
import { Logo } from './Logo';

export function SiteFooter() {
  return (
    <footer className="rs-footer">
      <div className="head-foot-container">
        <div className="footer-left">
          <div className="logo"><Link href="/" aria-label="The Relationshift"><Logo height={90} /></Link></div>
        </div>
        <div className="footer-right">
          <div className="widget-footer">
            <div className="widget-head">Company</div>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/our-beliefs">Our Beliefs</Link></li>
              <li><Link href="/support">Contact</Link></li>
            </ul>
          </div>
          <div className="widget-footer">
            <div className="widget-head">Info</div>
            <ul>
              <li><Link href="/media-research-info">Media, Research &amp; Info</Link></li>
              <li><Link href="/disclaimer">Disclaimer &amp; Privacy</Link></li>
              <li><Link href="/support#faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="widget-footer">
            <div className="widget-head">Program</div>
            <ul>
              <li><Link href="/program">How it works</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/program/day/1">Try day 1</Link></li>
            </ul>
          </div>
          <div className="widget-footer widget-bigger">
            <div className="copyright">
              <p>© 2016 - {new Date().getFullYear()} The Relationshift®</p>
              <p>Amsterdam, The Netherlands</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
