import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import Link from 'next/link';
import { deleteAccount, leaveCouple } from '@/lib/actions';

export const metadata: Metadata = { title: 'Account' };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ delete?: string }> }) {
  const { delete: del } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/account');
  const partner = user.partner;

  return (
    <div className="container narrow page page-offset">
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
      <div className="card block">
        <h3>Your data</h3>
        <p className="muted">
          Everything you wrote belongs to you. Download it whenever you like, or remove it for good — that also
          withdraws your consent for storing it.
        </p>
        <p style={{ marginBottom: 18 }}>
          <a className="btn secondary small" href="/api/account/export">Download my data</a>
        </p>
        <details className="danger-zone">
          <summary>Delete my account and all my answers</summary>
          <p className="muted small">
            This removes your account, every answer and note you wrote, and your link with your partner. It cannot be
            undone, and your partner will no longer see anything you shared. Type DELETE to confirm.
          </p>
          {del === 'confirm' && <p className="rs-error">Type DELETE (in capitals) to confirm.</p>}
          <form action={deleteAccount} className="delete-form">
            <input type="text" name="confirm" aria-label="Type DELETE to confirm" placeholder="DELETE" autoComplete="off" />
            <button className="btn danger small" type="submit">Delete everything</button>
          </form>
        </details>
      </div>
      <p className="small muted">
        To change your password, write to us via the <Link href="/support">support page</Link> for now.
        How we handle your data is described in the <Link href="/privacy">privacy statement</Link>.
      </p>
    </div>
  );
}
