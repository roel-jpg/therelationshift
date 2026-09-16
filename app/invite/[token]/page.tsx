import Link from 'next/link';
import type { Metadata } from 'next';
import { findInvite, findUserById } from '@/lib/repo';
import { getCurrentUser } from '@/lib/session';
import { acceptInvite } from '@/lib/actions';

export const metadata: Metadata = { title: 'Invitation' };

const MESSAGES: Record<string, string> = {
  'not-found': 'This invitation link is no longer valid.',
  own: 'This is your own invitation link — send it to your partner instead.',
  'already-paired': 'You are already connected to a partner. Disconnect first in your account settings.',
  'sender-paired': 'The person who sent this link is already connected to a partner.',
};

export default async function InvitePage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ status?: string }> }) {
  const { token } = await params;
  const { status } = await searchParams;
  const invite = await findInvite(token);
  const sender = invite ? await findUserById(invite.senderId) : null;
  const user = await getCurrentUser();
  const accept = acceptInvite.bind(null, token);

  if (!invite || !sender || invite.acceptedAt) {
    return (
      <div className="container narrow page page-offset center">
        <h1>Invitation</h1>
        <p className="error">{MESSAGES['not-found']}</p>
        <Link href="/" className="btn secondary">Home</Link>
      </div>
    );
  }

  return (
    <div className="container page page-offset center" style={{ maxWidth: 520 }}>
      <h1>{sender.firstName} invited you</h1>
      <p className="muted">
        {sender.firstName} wants to do The Relationshift with you: 21 days of small exercises to strengthen your relationship. It is free.
      </p>
      {status && MESSAGES[status] && <p className="error">{MESSAGES[status]}</p>}
      {user ? (
        <form action={accept}>
          <p className="small muted">You are logged in as {user.firstName}.</p>
          <button className="btn" type="submit">Connect with {sender.firstName}</button>
        </form>
      ) : (
        <div style={{ padding: '12px 0' }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/signup?invite=${encodeURIComponent(token)}`} className="btn">Create a free account</Link>
            <Link href={`/login?invite=${encodeURIComponent(token)}`} className="btn secondary">I already have an account</Link>
          </div>
        </div>
      )}
    </div>
  );
}
