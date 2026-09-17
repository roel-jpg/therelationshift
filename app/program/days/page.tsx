import type { Metadata } from 'next';
import Link from 'next/link';
import { Honeycomb } from '@/components/Honeycomb';
import { completedDays, listExercises } from '@/lib/repo';
import { getCurrentUser } from '@/lib/session';
import { BookHead } from '@/components/BookHead';

export const metadata: Metadata = {
  title: 'The 21 days',
  description: 'All 21 exercises of The Relationshift® programme at a glance — pick a day and start.',
};

// The honeycomb of all 21 days, open to everyone: the overview of the whole programme.
export default async function DaysPage() {
  const user = await getCurrentUser();
  const [days, done] = await Promise.all([
    listExercises(),
    user ? completedDays(user.id) : Promise.resolve(new Set<number>()),
  ]);

  return (
    <>
      <BookHead
        image="/media/site/how-bg.jpg"
        title="The 21 days"
        text="One exercise a day, five to twenty-five minutes, together. Pick a day to see what it holds — every exercise is read out loud for you."
      />
      <div className="container page">
        <Honeycomb days={days} done={done} />
        <p className="center muted" style={{ marginTop: 28 }}>
          {user
            ? <>Your progress lights up green. <Link href="/dashboard">Go to my programme</Link>.</>
            : <>Create a free account to save your answers and do the programme with your partner. <Link href="/signup">Start for free</Link>.</>}
        </p>
      </div>
    </>
  );
}
