import type { MetadataRoute } from 'next';

// Makes the site installable on a phone: own icon, no browser bar, opens on the programme.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Relationshift',
    short_name: 'Relationshift',
    description: 'A 21-day relationship workout for couples. One exercise a day, 5 to 25 minutes, together.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#14152F',
    theme_color: '#F05F61',
    lang: 'en',
    categories: ['lifestyle', 'health'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'My programme', short_name: 'Programme', url: '/dashboard' },
      { name: 'Day 1', short_name: 'Day 1', url: '/program/day/1' },
    ],
  };
}
