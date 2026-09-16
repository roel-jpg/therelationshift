import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { BookHead } from '@/components/BookHead';
import { signUp } from '@/lib/actions';
import { getCurrentUser } from '@/lib/session';
import texts from '@/content/site-texts.json';

export const metadata: Metadata = { title: 'Sign Up' };
const hc = ((texts as unknown as { hardcode: Record<string, unknown> }).hardcode.en as Record<string, string>) ?? {};

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ invite?: string; next?: string }> }) {
  const { invite, next } = await searchParams;
  const user = await getCurrentUser();
  if (user && !invite) redirect(next || '/dashboard');

  return (
    <>
      <BookHead image="/media/site/register.png" title="Sign Up" text={invite ? 'Your partner invited you to do The Relationshift together. Create an account to connect.' : hc.register_text} />
      <div className="register-form container auth-page">
        <div className="register-container">
          <AuthForm mode="signup" action={signUp} invite={invite} next={next} />
        </div>
      </div>
    </>
  );
}
