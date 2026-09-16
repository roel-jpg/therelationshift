import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { signUp } from '@/lib/actions';
import { getCurrentUser } from '@/lib/session';

export const metadata: Metadata = { title: 'Create account' };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ invite?: string; next?: string }> }) {
  const { invite, next } = await searchParams;
  const user = await getCurrentUser();
  if (user && !invite) redirect(next || '/program');

  return (
    <div className="container section" style={{ maxWidth: 480 }}>
      <h1 className="center">Start for free</h1>
      <p className="muted center">
        {invite ? 'Your partner invited you to do The Relationshift together. Create an account to connect.' : 'Create an account to save your progress and invite your partner.'}
      </p>
      <AuthForm mode="signup" action={signUp} invite={invite} next={next} />
    </div>
  );
}
