'use client';

import { useActionState } from 'react';
import { sendMessage, type ContactState } from '@/lib/actions';
import { ArrowRight } from './Icons';

export function ContactForm({ labels }: { labels: { name: string; email: string; question: string; submit: string; thanks: string } }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, undefined);
  return (
    <form className="rs-form form-input" action={action}>
      <input type="text" name="name" placeholder={labels.name} required autoComplete="name" />
      <input type="email" name="email" placeholder={labels.email} required autoComplete="email" />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} aria-hidden="true" />
      <div className="group-form">
        <label htmlFor="message">{labels.question}</label>
        <textarea id="message" name="message" rows={6} required />
      </div>
      {state?.error && <div className="rs-error">{state.error}</div>}
      {state?.ok ? (
        <p className="rs-sent"><span aria-hidden="true">✓</span>{labels.thanks}</p>
      ) : (
        <div className="read-more submit-contact save-button">
          <button className="btn-gradient" type="submit" disabled={pending}><span>{pending ? 'Sending…' : labels.submit}</span><ArrowRight /></button>
        </div>
      )}
    </form>
  );
}
