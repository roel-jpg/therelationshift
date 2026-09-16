import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { BookHead } from '@/components/BookHead';
import { logIn } from '@/lib/actions';
import { getCurrentUser } from '@/lib/session';

export const metadata: Metadata = { title: 'Sign In' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ invite?: string; next?: string }> }) {
  const { invite, next } = await searchParams;
  const user = await getCurrentUser();
  if (user && !invite) redirect(next || '/dashboard');

  return (
    <>
      <BookHead image="/media/site/register.png" title="Sign In" text="Welcome back. Sign in to continue your 21-day program." />
      <div className="register-form container auth-page">
        <div className="register-container">
          <AuthForm mode="login" action={logIn} invite={invite} next={next} />
        </div>
      </div>
    </>
  );
}
