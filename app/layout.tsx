import type { Metadata, Viewport } from 'next';
import './globals.css';
import './site.css';
import { getCurrentUser } from '@/lib/session';
import { logOut } from '@/lib/actions';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Wow } from '@/components/Wow';
import { PwaSetup } from '@/components/PwaSetup';
import { DoctorLove } from '@/components/DoctorLove';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F05F61',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://therelationshift.vercel.app'),
  applicationName: 'The Relationshift',
  appleWebApp: { capable: true, title: 'Relationshift', statusBarStyle: 'default' },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }, { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  title: { default: 'You want to improve your relationship? | The Relationshift', template: '%s | The Relationshift' },
  description: 'The Relationshift® offers a 21 day online relationship workout for love partners. Daily exercises of 5 to 25 minutes to strengthen your connection.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteHeader user={user ? { firstName: user.firstName } : null} logOut={logOut} />
        <main>{children}</main>
        <SiteFooter />
        <Wow />
        <PwaSetup />
        <DoctorLove />
      </body>
    </html>
  );
}
