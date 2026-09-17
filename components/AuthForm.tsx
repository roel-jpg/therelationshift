'use client';
import { useActionState } from 'react';
import Link from 'next/link';
import type { ActionState } from '@/lib/actions';
import { ArrowRight } from './Icons';

type Props = {
  mode: 'signup' | 'login';
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  invite?: string;
  next?: string;
};

// Sign up / sign in form in the style of the original register page (hairline inputs, gradient pill button with arrow).
export function AuthForm({ mode, action, invite, next }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const isSignup = mode === 'signup';
  const qs = new URLSearchParams();
  if (invite) qs.set('invite', invite);
  if (next) qs.set('next', next);
  const q = qs.toString() ? `?${qs.toString()}` : '';

  return (
    <div className="auth-box">
      <form action={formAction} className="rs-form form-input">
        <div className="form-head">{isSignup ? 'Sign up' : 'Sign in'}</div>
        {invite && <input type="hidden" name="invite" value={invite} />}
        {next && <input type="hidden" name="next" value={next} />}
        {isSignup && <input type="text" name="firstName" placeholder="First name" required autoComplete="given-name" />}
        <input type="email" name="email" placeholder="Email" required autoComplete="email" />
        <input type="password" name="password" placeholder={isSignup ? 'Password (at least 8 characters)' : 'Password'} required minLength={isSignup ? 8 : 1} autoComplete={isSignup ? 'new-password' : 'current-password'} />
        {isSignup && (
          <label className="consent-row">
            <input type="checkbox" name="consent" required />
            <span>
              I agree that The Relationshift stores the answers and notes I write in the exercises, so that I can
              come back to them and — only when I choose to per exercise — share them with my partner. These answers
              can say something about my relationship and my sex life. I can withdraw this at any time by deleting my
              answers or my account. See the <Link href="/privacy">privacy statement</Link>.
            </span>
          </label>
        )}
        {state?.error && <div className="rs-error">{state.error}</div>}
        <div className="save-button">
          <button type="submit" disabled={pending}>{pending ? 'One moment…' : isSignup ? 'Sign Up' : 'Sign In'}<ArrowRight /></button>
        </div>
        <p className="small-content">
          {isSignup ? (
            <>Already have an account? <Link href={`/login${q}`}>Sign in</Link></>
          ) : (
            <>New here? <Link href={`/signup${q}`}>Create a free account</Link></>
          )}
        </p>
      </form>
    </div>
  );
}
