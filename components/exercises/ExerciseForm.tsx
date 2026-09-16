'use client';
import { useState } from 'react';
import { BasicMultiple } from './BasicMultiple';
import { LoveLanguage } from './LoveLanguage';
import { Checklist } from './Checklist';
import { TrueFalse } from './TrueFalse';
import { ListOrder } from './ListOrder';

type Props = {
  day: number;
  type: string;
  data: unknown;
  audioUrl: string | null;
  initial: { data: unknown; reflection: string | null; rating: number | null; shared: boolean } | null;
  loggedIn: boolean;
  partnerName?: string | null;
  action: (form: FormData) => void | Promise<void>;
};

// What the share choice actually hands over, per kind of exercise.
const WHAT: Record<string, string> = {
  'basic-multiple': 'my answers and notes',
  'multiple-match-category': 'my love language and notes',
  checklist: 'my list and notes',
  'true-false': 'my answers and notes',
  'list-order': 'my top five and notes',
  'single-picture': 'my notes',
  'single-audio': 'my notes',
  'noop-audio': 'my notes',
  noop: 'my notes',
};

const REFLECTION_PROMPT: Record<string, string> = {
  'single-picture': 'How did it go? You can also describe the picture, letter or moment you created.',
  'single-audio': 'What came up for you while listening or talking?',
  'noop-audio': 'How did the meditation feel? Anything you want to remember?',
  noop: 'How did it go? Write a few words for yourself (and your partner).',
};

export function ExerciseForm({ day, type, data, audioUrl, initial, loggedIn, partnerName, action }: Props) {
  const [answer, setAnswer] = useState<unknown>(initial?.data ?? null);
  const [rating, setRating] = useState<number | null>(initial?.rating ?? null);
  const [share, setShare] = useState<boolean>(initial?.shared ?? false);

  let widget: React.ReactNode = null;
  const props = { data, initial: initial?.data ?? null, onChange: setAnswer };
  switch (type) {
    case 'basic-multiple': widget = <BasicMultiple {...props} />; break;
    case 'multiple-match-category': widget = <LoveLanguage {...props} />; break;
    case 'checklist': widget = <Checklist {...props} />; break;
    case 'true-false': widget = <TrueFalse {...props} />; break;
    case 'list-order': widget = <ListOrder {...props} />; break;
    default: widget = null;
  }

  return (
    <form action={action} className="form">
      <input type="hidden" name="day" value={day} />
      <input type="hidden" name="data" value={answer == null ? '' : JSON.stringify(answer)} />
      <input type="hidden" name="rating" value={rating ?? ''} />

      {audioUrl && (
        <div className="block">
          <h2>Listen</h2>
          <audio controls preload="none" src={audioUrl}>Your browser does not support audio.</audio>
        </div>
      )}

      {widget && (
        <div className="block">
          <h2>Your turn</h2>
          {widget}
        </div>
      )}

      <div className="block">
        <h2>Notes</h2>
        <label>
          {REFLECTION_PROMPT[type] ?? 'Anything you want to remember from this exercise?'}
          <textarea name="reflection" defaultValue={initial?.reflection ?? ''} placeholder="Optional" />
        </label>
      </div>

      <div className="block">
        <h2>How helpful was this exercise?</h2>
        <div className="rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} className={rating === n ? 'selected' : ''} onClick={() => setRating(n)} aria-label={`${n} of 5`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {loggedIn && partnerName && (
        <div className="block share-choice">
          <label className="share-row">
            <input type="checkbox" name="share" checked={share} onChange={(e) => setShare(e.target.checked)} />
            <span>
              Show {WHAT[type] ?? 'my answer'} to {partnerName} once {partnerName} has done this day too.
              <span className="muted small"> You can turn this off again at any time.</span>
            </span>
          </label>
        </div>
      )}

      {loggedIn ? (
        <button className="btn" type="submit">{initial ? 'Save changes' : 'Mark day as done'}</button>
      ) : (
        <div>
          <p className="info">Create a free account to save your answers and do the program with your partner.</p>
          <button className="btn" type="submit">Create a free account to save</button>
        </div>
      )}
    </form>
  );
}
