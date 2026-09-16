'use client';
import { useActionState } from 'react';
import Link from 'next/link';
import type { ActionState } from '@/lib/actions';

type Props = {
  mode: 'signup' | 'login';
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  invite?: string;
  next?: string;
};

export function AuthForm({ mode, action, invite, next }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const isSignup = mode === 'signup';
  const qs = new URLSearchParams();
  if (invite) qs.set('invite', invite);
  if (next) qs.set('next', next);
  const q = qs.toString() ? `?${qs.toString()}` : '';

  return (
    <form action={formAction} className="form card">
      {invite && <input type="hidden" name="invite" value={invite} />}
      {next && <input type="hidden" name="next" value={next} />}
      {state?.error && <p className="error">{state.error}</p>}
      {isSignup && (
        <label>
          First name
          <input type="text" name="firstName" required autoComplete="given-name" />
        </label>
      )}
      <label>
        Email
        <input type="email" name="email" required autoComplete="email" />
      </label>
      <label>
        Password
        <input type="password" name="password" required minLength={isSignup ? 8 : 1} autoComplete={isSignup ? 'new-password' : 'current-password'} />
      </label>
      <button className="btn block" type="submit" disabled={pending}>
        {pending ? 'One moment...' : isSignup ? 'Create free account' : 'Log in'}
      </button>
      <p className="small muted center" style={{ margin: 0 }}>
        {isSignup ? (
          <>Already have an account? <Link href={`/login${q}`}>Log in</Link></>
        ) : (
          <>New here? <Link href={`/signup${q}`}>Create a free account</Link></>
        )}
      </p>
    </form>
  );
}
