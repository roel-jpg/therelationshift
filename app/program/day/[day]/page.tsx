import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAnswer, getExercise } from '@/lib/repo';
import { getCurrentUser } from '@/lib/session';
import { saveAnswer } from '@/lib/actions';
import { ExerciseForm } from '@/components/exercises/ExerciseForm';
import { PartnerAnswer } from '@/components/exercises/PartnerAnswer';
import { richHtml } from '@/lib/rich';

type Params = { day: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { day } = await params;
  const ex = await getExercise(Number(day));
  return { title: ex ? `Day ${day}: ${ex.title}` : 'Program' };
}

// Temporarily open so the whole programme can be tried without an account.
// Set to false to require an account again from day 2 onwards.
const OPEN_PROGRAM = true;

export default async function DayPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<{ done?: string }> }) {
  const { day: dayStr } = await params;
  const { done } = await searchParams;
  const day = Number(dayStr);
  if (!Number.isInteger(day) || day < 1 || day > 21) notFound();

  const user = await getCurrentUser();
  if (!OPEN_PROGRAM && day > 1 && !user) redirect(`/signup?next=${encodeURIComponent(`/program/day/${day}`)}`);

  const ex = await getExercise(day);
  if (!ex) notFound();

  const partner = user?.partner ?? null;
  const [mine, partnerAnswer] = await Promise.all([
    user ? getAnswer(user.id, day) : null,
    partner ? getAnswer(partner.id, day) : null,
  ]);

  const narrationUrl = `/media/audio/day-${day}.mp3`;
  const articles = ex.articles;
  const products = ex.products;
  // Their answer appears only when they chose to share it and you have done the day yourself.
  const seePartnerAnswer = Boolean(mine && partnerAnswer?.shared);

  return (
    <>
    <section className="exercise-hero" style={ex.imageUrl ? { backgroundImage: `url(${ex.imageUrl})` } : undefined}>
      <Link href={user ? '/dashboard' : '/program/days'} className="back">← All days</Link>
      <div className="container narrow">
        <span className="eyebrow">Day {ex.day} · {ex.durationMin} min</span>
        <h1>{ex.title}</h1>
      </div>
    </section>
    <div className="container narrow page">
      <div className="block narration">
        <h2>Listen</h2>
        <p className="muted small">The exercise read out for you, so you can do it together without staring at a screen.</p>
        <audio controls preload="none" src={narrationUrl}>Your browser cannot play audio.</audio>
      </div>

      {done && <p className="notice">Saved. Nice work — see you tomorrow for day {Math.min(day + 1, 21)}.</p>}

      <div className="block">
        <h2>Goal</h2>
        <div className="rich" dangerouslySetInnerHTML={{ __html: richHtml(ex.goal) }} />
      </div>

      <div className="block">
        <h2>How to</h2>
        <div className="rich" dangerouslySetInnerHTML={{ __html: richHtml(ex.howTo) }} />
      </div>

      <ExerciseForm
        day={day}
        type={ex.type}
        data={ex.data}
        audioUrl={ex.audioUrl}
        initial={mine ? { data: mine.data, reflection: mine.reflection, rating: mine.rating, shared: mine.shared } : null}
        loggedIn={!!user}
        partnerName={partner?.firstName ?? null}
        action={saveAnswer}
      />

      {partner && (
        <>
          <div className="block" style={{ marginTop: 28 }}>
            <div className="info">
              {!partnerAnswer && <>{partner.firstName} has not done this day yet.</>}
              {partnerAnswer && !partnerAnswer.shared && <>{partner.firstName} has completed this day.</>}
              {partnerAnswer && partnerAnswer.shared && !mine && (
                <>{partner.firstName} has done this day and wants to show you the answer — it appears here as soon as you have done it too.</>
              )}
              {seePartnerAnswer && <>{partner.firstName} has completed this day and shared the answer with you.</>}
            </div>
          </div>
          {seePartnerAnswer && partnerAnswer && (
            <PartnerAnswer
              name={partner.firstName}
              type={ex.type}
              data={ex.data}
              answer={partnerAnswer.data}
              reflection={partnerAnswer.reflection}
            />
          )}
        </>
      )}

      {(ex.background || articles.length > 0) && (
        <div className="block">
          <h2>Background</h2>
          {ex.background && <div className="rich" dangerouslySetInnerHTML={{ __html: richHtml(ex.background) }} />}
          {articles.length > 0 && (
            <div className="articles" style={{ marginTop: 12 }}>
              {articles.map((a, i) => (
                <a key={i} href={a.url} target="_blank" rel="noopener noreferrer">{a.title} ↗</a>
              ))}
            </div>
          )}
        </div>
      )}

      {products.length > 0 && (
        <div className="block">
          <h2>Recommended reading &amp; watching</h2>
          <ul className="muted">
            {products.map((p, i) => (
              <li key={i}>{p.name}{p.author ? ` — ${p.author}` : ''}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="pager">
        {day > 1 ? <Link href={`/program/day/${day - 1}`} className="btn secondary">← Day {day - 1}</Link> : <span />}
        {day < 21 ? <Link href={`/program/day/${day + 1}`} className="btn secondary">Day {day + 1} →</Link> : <Link href={user ? '/dashboard' : '/program/days'} className="btn secondary">Overview</Link>}
      </div>
    </div>
    </>
  );
}
