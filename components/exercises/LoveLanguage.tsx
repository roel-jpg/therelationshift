'use client';
import { useState } from 'react';
import { LOVE_LANGUAGES, type ExerciseProps, type LoveLanguageData } from './types';

type Saved = { choices: string[]; scores: Record<string, number>; result: string } | null;

export function scoreChoices(choices: string[]) {
  const scores: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const c of choices) if (c in scores) scores[c] += 1;
  const result = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return { scores, result };
}

// The 30-question love-language test (day 2).
export function LoveLanguage({ data, initial, onChange }: ExerciseProps) {
  const d = (data ?? { data: [] }) as LoveLanguageData;
  const saved = initial as Saved;
  const [choices, setChoices] = useState<string[]>(saved?.choices ?? []);
  const [index, setIndex] = useState<number>(saved?.choices?.length ? d.data.length : 0);

  const total = d.data.length;
  const finished = index >= total;

  function pick(value: string) {
    const next = [...choices];
    next[index] = value;
    setChoices(next);
    const ni = index + 1;
    setIndex(ni);
    if (ni >= total) {
      const { scores, result } = scoreChoices(next);
      onChange({ choices: next, scores, result });
    }
  }

  if (finished) {
    const { scores, result } = scoreChoices(choices);
    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return (
      <div>
        <div className="result-box">
          <h3>Your primary love language: {LOVE_LANGUAGES[result]}</h3>
          <ul>
            {ranked.map(([k, v]) => (
              <li key={k}>{LOVE_LANGUAGES[k]}: {v}</li>
            ))}
          </ul>
          <p className="small muted" style={{ marginBottom: 0 }}>
            Talk about the result with your partner: how do you each prefer to receive love, and how do you tend to give it?
          </p>
        </div>
        <button type="button" className="btn secondary small" onClick={() => { setChoices([]); setIndex(0); onChange(null); }}>
          Redo the test
        </button>
      </div>
    );
  }

  const q = d.data[index];
  return (
    <div>
      <div className="progress-line"><div style={{ width: `${(index / total) * 100}%` }} /></div>
      <p className="muted small">Question {index + 1} of {total} — pick the statement that fits you best right now.</p>
      <div className="choice">
        {q.options.map((o, i) => (
          <button type="button" key={i} onClick={() => pick(o.value)}>{o.text}</button>
        ))}
      </div>
      {index > 0 && (
        <button type="button" className="btn secondary small" onClick={() => setIndex(index - 1)}>Back</button>
      )}
    </div>
  );
}
