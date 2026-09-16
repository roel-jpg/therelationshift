import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { logIn } from '@/lib/actions';
import { getCurrentUser } from '@/lib/session';

export const metadata: Metadata = { title: 'Log in' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ invite?: string; next?: string }> }) {
  const { invite, next } = await searchParams;
  const user = await getCurrentUser();
  if (user && !invite) redirect(next || '/program');

  return (
    <div className="container page auth">
      <h1 className="center">Welcome back</h1>
      <AuthForm mode="login" action={logIn} invite={invite} next={next} />
    </div>
  );
}
