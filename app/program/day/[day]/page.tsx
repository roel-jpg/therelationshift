import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAnswer, getExercise } from '@/lib/repo';
import { getCurrentUser } from '@/lib/session';
import { saveAnswer } from '@/lib/actions';
import { ExerciseForm } from '@/components/exercises/ExerciseForm';
import { LOVE_LANGUAGES } from '@/components/exercises/types';

type Params = { day: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { day } = await params;
  const ex = await getExercise(Number(day));
  return { title: ex ? `Day ${day}: ${ex.title}` : 'Program' };
}

export default async function DayPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<{ done?: string }> }) {
  const { day: dayStr } = await params;
  const { done } = await searchParams;
  const day = Number(dayStr);
  if (!Number.isInteger(day) || day < 1 || day > 21) notFound();

  const user = await getCurrentUser();
  if (day > 1 && !user) redirect(`/signup?next=${encodeURIComponent(`/program/day/${day}`)}`);

  const ex = await getExercise(day);
  if (!ex) notFound();

  const partner = user?.partner ?? null;
  const [mine, partnerAnswer] = await Promise.all([
    user ? getAnswer(user.id, day) : null,
    partner ? getAnswer(partner.id, day) : null,
  ]);

  const articles = ex.articles;
  const products = ex.products;
  const partnerResult = (partnerAnswer?.data ?? null) as { result?: string } | null;

  return (
    <>
    <section className="exercise-hero" style={ex.imageUrl ? { backgroundImage: `url(${ex.imageUrl})` } : undefined}>
      <Link href={user ? '/dashboard' : '/'} className="back">← All days</Link>
      <div className="container narrow">
        <span className="eyebrow">Day {ex.day} · {ex.durationMin} min</span>
        <h1>{ex.title}</h1>
      </div>
    </section>
    <div className="container narrow page">

      {done && <p className="notice">Saved. Nice work — see you tomorrow for day {Math.min(day + 1, 21)}.</p>}

      <div className="block">
        <h2>Goal</h2>
        <div className="rich" dangerouslySetInnerHTML={{ __html: ex.goal }} />
      </div>

      <div className="block">
        <h2>How to</h2>
        <div className="rich" dangerouslySetInnerHTML={{ __html: ex.howTo }} />
      </div>

      <ExerciseForm
        day={day}
        type={ex.type}
        data={ex.data}
        audioUrl={ex.audioUrl}
        initial={mine ? { data: mine.data, reflection: mine.reflection, rating: mine.rating } : null}
        loggedIn={!!user}
        action={saveAnswer}
      />

      {partner && (
        <div className="block" style={{ marginTop: 28 }}>
          <div className="info">
            {partnerAnswer ? (
              <>
                {partner.firstName} has completed this day
                {ex.type === 'multiple-match-category' && partnerResult?.result
                  ? ` — primary love language: ${LOVE_LANGUAGES[partnerResult.result] ?? partnerResult.result}`
                  : ''}
                .
              </>
            ) : (
              <>{partner.firstName} has not done this day yet.</>
            )}
          </div>
        </div>
      )}

      {(ex.background || articles.length > 0) && (
        <div className="block">
          <h2>Background</h2>
          {ex.background && <div className="rich" dangerouslySetInnerHTML={{ __html: ex.background }} />}
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
        {day < 21 ? <Link href={`/program/day/${day + 1}`} className="btn secondary">Day {day + 1} →</Link> : <Link href="/dashboard" className="btn secondary">Overview</Link>}
      </div>
    </div>
    </>
  );
}
