'use client';

import { useEffect, useRef, useState } from 'react';
import { DoctorLoveAvatar } from './DoctorLoveAvatar';

type Msg = { role: 'user' | 'assistant'; content: string };

const OPENER: Msg = {
  role: 'assistant',
  content: 'Hi, I am Doctor Love. Ask me anything about the 21-day programme — how it works, what a day involves, or doing it together with your partner.',
};

const SUGGESTIONS = ['How does the programme work?', 'Can I do it without my partner?', 'What does it cost?'];

// The chat bubble in the corner. The conversation lives in this component only:
// nothing is written to the database or to browser storage.
export function DoctorLove() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([OPENER]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, pending]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function send(text: string) {
    const question = text.trim();
    if (!question || pending) return;
    const next = [...messages, { role: 'user' as const, content: question }];
    setMessages(next);
    setDraft('');
    setPending(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next.filter((m) => m !== OPENER) }),
      });
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: String(data?.reply ?? '').trim() || 'Sorry, that did not work. Try the form on the support page.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'I cannot reach my brain right now. Please use the form on the support page — a real person will answer you.' }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`dl-launcher${open ? ' dl-hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Ask Doctor Love a question about the programme"
      >
        <DoctorLoveAvatar size={30} id="dl-launch" />
        <span>Ask Doctor Love</span>
      </button>

      {open && (
        <section className="dl-panel" role="dialog" aria-label="Doctor Love" aria-modal="false">
          <header className="dl-head">
            <DoctorLoveAvatar size={34} id="dl-head" />
            <div>
              <strong>Doctor Love</strong>
              <span>here for questions about the programme</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">×</button>
          </header>

          <div className="dl-log" ref={logRef} aria-live="polite">
            {messages.map((m, i) => (
              <p key={i} className={m.role === 'user' ? 'dl-you' : 'dl-her'}>{m.content}</p>
            ))}
            {pending && <p className="dl-her dl-typing"><span /><span /><span /></p>}
            {messages.length === 1 && !pending && (
              <div className="dl-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button type="button" key={s} onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
          </div>

          <form
            className="dl-form"
            onSubmit={(e) => { e.preventDefault(); send(draft); }}
          >
            <input
              ref={inputRef}
              type="text"
              value={draft}
              maxLength={1000}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Your question…"
              aria-label="Your question"
            />
            <button type="submit" disabled={pending || !draft.trim()}>Send</button>
          </form>

          <p className="dl-foot">
            Doctor Love is an automated helper, not a real doctor or therapist. Nothing you type here is stored.
            For anything personal, <a href="/support">write to Roel and Andrea</a>.
          </p>
        </section>
      )}
    </>
  );
}
