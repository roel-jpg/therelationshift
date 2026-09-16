'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';

type Props = {
  user: { firstName: string } | null;
  logOut: () => Promise<void>;
};

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/program', label: 'Program' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/news', label: 'News' },
  { href: '/shop', label: 'Shop' },
  { href: '/support', label: 'Support' },
];

// Pages without a full-height banner behind the header get a solid header from the start.
const SOLID_PREFIXES = ['/dashboard', '/account', '/invite', '/news/', '/program/day'];

export function SiteHeader({ user, logOut }: Props) {
  const pathname = usePathname() || '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = SOLID_PREFIXES.some((p) => pathname.startsWith(p)) || pathname === '/not-found';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', open);
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  const items = (
    <>
      {NAV.map((n) => (
        <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
      ))}
      {user ? (
        <li className="no-underline has-child">
          <a href="/dashboard" className="btn-gradient">My account</a>
          <ul className="sub-menu">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/account">Settings</Link></li>
            <li><form action={logOut}><button type="submit">Logout</button></form></li>
          </ul>
        </li>
      ) : (
        <li className="no-underline"><Link href="/login" className="btn-gradient">Sign in / Sign up</Link></li>
      )}
    </>
  );

  return (
    <>
      <header className={`rs-header${scrolled ? ' header-scrolled' : ''}${solid ? ' header-solid' : ''}`}>
        <div className="head-foot-container">
          <div className="logo"><Link href="/" aria-label="The Relationshift home"><Logo /></Link></div>
          <ul className="navigation">{items}</ul>
          <button className={`hamburger${open ? ' is-active' : ''}`} type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span className="hamburger-box"><span className="hamburger-inner" /></span>
          </button>
        </div>
      </header>
      <div className={`mobile-nav${open ? ' active' : ''}`}>
        <ul className="navigation">
          {NAV.map((n) => <li key={n.href}><Link href={n.href}>{n.label}</Link></li>)}
          {user ? (
            <>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><form action={logOut}><button type="submit" style={{ background: 'none', border: 0, font: 'inherit', color: '#fff', textTransform: 'uppercase', cursor: 'pointer' }}>Logout</button></form></li>
            </>
          ) : (
            <li><Link href="/login">Sign in / Sign up</Link></li>
          )}
        </ul>
      </div>
    </>
  );
}
