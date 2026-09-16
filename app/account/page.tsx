import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { leaveCouple } from '@/lib/actions';

export const metadata: Metadata = { title: 'Account' };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/account');
  const partner = user.partner;

  return (
    <div className="container narrow section">
      <h1>Your account</h1>
      <div className="card block">
        <p><strong>Name</strong><br />{user.firstName}</p>
        <p><strong>Email</strong><br />{user.email}</p>
        <p style={{ marginBottom: 0 }}><strong>Plan</strong><br />{user.entitlement === 'FREE' ? 'Free' : 'Premium'}</p>
      </div>
      <div className="card block">
        <h3>Partner</h3>
        {partner ? (
          <>
            <p>You are connected with <strong>{partner.firstName}</strong>.</p>
            <form action={leaveCouple}>
              <button className="btn secondary small" type="submit">Disconnect</button>
            </form>
          </>
        ) : (
          <p className="muted" style={{ marginBottom: 0 }}>Not connected yet. Create an invite link on your program page.</p>
        )}
      </div>
      <p className="small muted">To change your password or delete your account, email <a href="mailto:info@therelationshift.com">info@therelationshift.com</a> for now.</p>
    </div>
  );
}
