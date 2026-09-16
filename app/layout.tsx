import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { getCurrentUser } from '@/lib/session';
import { logOut } from '@/lib/actions';

export const metadata: Metadata = {
  title: { default: 'The Relationshift', template: '%s · The Relationshift' },
  description: 'A 21-day online relationship workout for love partners. Daily exercises of 5 to 25 minutes to strengthen your connection.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="brand" aria-label="The Relationshift home">
              <img src="/media/site/logo-white.svg" alt="Relationshift" width={160} height={30} />
            </Link>
            <nav className="nav">
              <Link href="/program">Program</Link>
              <Link href="/about" className="hide-sm">About</Link>
              {user ? (
                <>
                  <Link href="/account" className="hide-sm">{user.firstName}</Link>
                  <form action={logOut}>
                    <button className="btn ghost small" type="submit">Log out</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="hide-sm">Log in</Link>
                  <Link href="/signup" className="btn small">Join now</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <span>© 2016–{new Date().getFullYear()} The Relationshift® · Amsterdam</span>
            <span>
              <Link href="/about">About</Link> · <Link href="/privacy">Privacy</Link> · <a href="mailto:info@therelationshift.com">Contact</a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
