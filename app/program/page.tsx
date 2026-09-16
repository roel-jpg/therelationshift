import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Honeycomb } from '@/components/Honeycomb';
import { completedDays, listExercises, openInviteFor } from '@/lib/repo';
import { getCurrentUser } from '@/lib/session';
import { createInviteAction } from '@/lib/actions';

export const metadata: Metadata = { title: 'My program' };

export default async function ProgramPage({ searchParams }: { searchParams: Promise<{ paired?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/signup?next=/program');
  const { paired } = await searchParams;

  const partner = user.partner;
  const [days, done, invite, partnerDone] = await Promise.all([
    listExercises(),
    completedDays(user.id),
    openInviteFor(user.id),
    partner ? completedDays(partner.id) : Promise.resolve(new Set<number>()),
  ]);
  const nextDay = days.find((d) => !done.has(d.day))?.day ?? 21;
  const base = process.env.NEXT_PUBLIC_SITE_URL || '';

  return (
    <>
      <section className="program-top">
        <div className="container">
          <h1>Hi {user.firstName}</h1>
          <p>
            {partner
              ? `You and ${partner.firstName} have completed ${done.size} and ${partnerDone.size} of 21 days.`
              : `You have completed ${done.size} of 21 days.`}
          </p>
        </div>
      </section>

      <section className="container program-body">
        <div className="card partner-card">
          {paired && <p className="notice">You and {partner?.firstName ?? 'your partner'} are now connected. Enjoy the program together!</p>}
          {partner ? (
            <p className="muted">You are doing the program with <strong>{partner.firstName}</strong>. Days you both completed light up green.</p>
          ) : (
            <>
              <h3>Invite your partner</h3>
              <p className="muted">The program works best when you both do it. Send your partner this link; when they sign up, your accounts are connected.</p>
              {invite ? (
                <p className="invite-link">{base}/invite/{invite.token}</p>
              ) : (
                <form action={createInviteAction}>
                  <button className="btn secondary" type="submit">Create invite link</button>
                </form>
              )}
            </>
          )}
          <p style={{ marginTop: 16, marginBottom: 0 }}>
            <Link href={`/program/day/${nextDay}`} className="btn">
              {done.size === 0 ? 'Start with day 1' : done.size >= 21 ? 'Review the program' : `Continue with day ${nextDay}`} <span className="arrow">→</span>
            </Link>
          </p>
        </div>

        <Honeycomb days={days} done={done} />

        <div className="grid" style={{ marginTop: 40 }}>
          {days.map((d) => (
            <Link key={d.day} href={`/program/day/${d.day}`} className="card" style={{ padding: '14px 18px', color: 'inherit' }}>
              <span className="muted small">Day {d.day} · {d.durationMin} min{done.has(d.day) ? ' · ✓ done' : ''}{partner && partnerDone.has(d.day) ? ` · ${partner.firstName} ✓` : ''}</span>
              <div>{d.title}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
