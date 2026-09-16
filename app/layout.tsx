import type { Metadata } from 'next';
import './globals.css';
import './site.css';
import { getCurrentUser } from '@/lib/session';
import { logOut } from '@/lib/actions';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Wow } from '@/components/Wow';

export const metadata: Metadata = {
  title: { default: 'You want to improve your relationship? | The Relationshift', template: '%s | The Relationshift' },
  description: 'The Relationshift® offers a 21 day online relationship workout for love partners. Daily exercises of 5 to 25 minutes to strengthen your connection.',
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
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteHeader user={user ? { firstName: user.firstName } : null} logOut={logOut} />
        <main>{children}</main>
        <SiteFooter />
        <Wow />
      </body>
    </html>
  );
}
