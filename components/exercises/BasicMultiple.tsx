'use client';
import { useState } from 'react';
import type { BasicMultipleData, ExerciseProps } from './types';

// A few open questions; each gets a text answer.
export function BasicMultiple({ data, initial, onChange }: ExerciseProps) {
  const d = (data ?? { questions: [] }) as BasicMultipleData;
  const init = (initial as Record<string, string> | null) ?? {};
  const [answers, setAnswers] = useState<Record<string, string>>(init);

  function set(i: number, v: string) {
    const next = { ...answers, [String(i)]: v };
    setAnswers(next);
    onChange(next);
  }

  return (
    <div>
      {d.questions.map((q, i) => (
        <div className="q-block" key={i}>
          <h4>{i + 1}. {q.question}</h4>
          {q.description && <p className="muted small">{q.description}</p>}
          <textarea
            value={answers[String(i)] ?? ''}
            onChange={(e) => set(i, e.target.value)}
            placeholder="Write your answer here..."
          />
        </div>
      ))}
      {d.outro && <p className="info">{d.outro}</p>}
    </div>
  );
}
