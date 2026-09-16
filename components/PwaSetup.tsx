'use client';

import { useEffect, useState } from 'react';

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const DISMISSED = 'rs-install-dismissed';
const DISMISS_DAYS = 60;

function dismissedRecently() {
  try {
    const raw = localStorage.getItem(DISMISSED);
    if (!raw) return false;
    return Date.now() - Number(raw) < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch { return false; }
}

// Registers the service worker and, on a phone, offers to put the site on the home screen.
export function PwaSetup() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }

    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone || dismissedRecently() || window.innerWidth > 900) return;

    const onPrompt = (e: Event) => { e.preventDefault(); setPrompt(e as InstallPrompt); };
    window.addEventListener('beforeinstallprompt', onPrompt);

    // iOS never fires that event: it needs Share → Add to Home Screen.
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const timer = window.setTimeout(() => { if (isIos) setIosHint(true); }, 4000);

    return () => { window.removeEventListener('beforeinstallprompt', onPrompt); window.clearTimeout(timer); };
  }, []);

  if (!prompt && !iosHint) return null;

  const close = () => {
    try { localStorage.setItem(DISMISSED, String(Date.now())); } catch { /* private mode */ }
    setPrompt(null); setIosHint(false);
  };

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice.catch(() => undefined);
    close();
  };

  return (
    <div className="install-bar" role="complementary">
      <img src="/icons/icon-192.png" alt="" width={34} height={34} />
      <p>
        {prompt
          ? 'Add The Relationshift to your home screen and open it like an app.'
          : 'Tap the share button below, then “Add to Home Screen”, to open this like an app.'}
      </p>
      {prompt && <button type="button" className="install-go" onClick={install}>Add</button>}
      <button type="button" className="install-close" onClick={close} aria-label="Close">×</button>
    </div>
  );
}
