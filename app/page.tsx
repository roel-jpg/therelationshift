import Link from 'next/link';
import { Honeycomb } from '@/components/Logo';
import { listExercises } from '@/lib/repo';
import { getCurrentUser } from '@/lib/session';

export default async function Home() {
  const user = await getCurrentUser();
  const days = await listExercises();

  return (
    <>
      <section className="hero container">
        <div className="honeycomb"><Honeycomb size={72} /></div>
        <h1>You want to improve your relationship?</h1>
        <p className="lead">
          The Relationshift is a 21-day online relationship workout for love partners. One exercise a day,
          5 to 25 minutes, that you do together. Free, and no app to install.
        </p>
        <div className="actions">
          <Link href="/program/day/1" className="btn">Try day 1 now</Link>
          <Link href={user ? '/program' : '/signup'} className="btn secondary">{user ? 'Go to my program' : 'Create a free account'}</Link>
        </div>
        <div className="stats">
          <div><strong>21</strong>days</div>
          <div><strong>5–25</strong>minutes a day</div>
          <div><strong>34+</strong>nationalities so far</div>
        </div>
      </section>

      <section className="section container">
        <h2>How it works</h2>
        <div className="grid">
          <div className="card">
            <h3>1. Start together</h3>
            <p className="muted">Create an account, invite your partner with a link, and pick a day to start. You both do the same exercise, each from your own phone or laptop.</p>
          </div>
          <div className="card">
            <h3>2. One exercise a day</h3>
            <p className="muted">Communication, intimacy, gratitude, meditation, your shared story. Some days are a conversation, some a short test, some a guided audio.</p>
          </div>
          <div className="card">
            <h3>3. Discover each other again</h3>
            <p className="muted">Learn your love languages, map your values, and build small rituals. Your answers are saved so you can look back on them.</p>
          </div>
        </div>
      </section>

      <section className="section container narrow">
        <h2>The 21 days</h2>
        <div className="days">
          {days.map((d) => (
            <Link key={d.day} href={`/program/day/${d.day}`} className={`day-card${d.day > 1 && !user ? ' locked' : ''}`}>
              <div className="day-num">{d.day}</div>
              <div>
                <div className="title">{d.title}</div>
                <div className="meta">{d.durationMin} min{d.day > 1 && !user ? ' · account needed' : ''}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container narrow center">
        <h2>Made with care</h2>
        <p className="muted">
          The program was created in Amsterdam by a team of relationship therapists, psychologists, tantra experts
          and meditation teachers. It has been used by couples in more than 34 countries since 2016.
        </p>
        <Link href="/about">Read our story</Link>
      </section>
    </>
  );
}
