'use client';
import { useState } from 'react';
import type { ExerciseProps, TrueFalseData } from './types';

type Saved = { answers: Record<string, boolean> } | null;

// Day 17 "Where do we stand?" — grouped statements, answer true or false.
export function TrueFalse({ data, initial, onChange }: ExerciseProps) {
  const d = (data ?? { content: [] }) as TrueFalseData;
  const saved = initial as Saved;
  const [answers, setAnswers] = useState<Record<string, boolean>>(saved?.answers ?? {});

  function set(key: string, v: boolean) {
    const next = { ...answers, [key]: v };
    setAnswers(next);
    onChange({ answers: next });
  }

  const total = d.content.reduce((n, g) => n + g.list.length, 0);
  const answered = Object.keys(answers).length;

  return (
    <div>
      {d.content.map((g, gi) => {
        const trues = g.list.filter((item, ii) => answers[`${gi}-${ii}`] === true).length;
        return (
          <div className="tf-group" key={gi}>
            <h4 style={{ marginBottom: 2 }}>{g.group}</h4>
            {g.subtitle && <p className="muted small">{g.subtitle}</p>}
            {g.list.map((item, ii) => {
              const key = `${gi}-${ii}`;
              return (
                <div className="tf-row" key={key}>
                  <span>{item.text}</span>
                  <span className="opts">
                    <button type="button" className={answers[key] === true ? 'selected' : ''} onClick={() => set(key, true)}>True</button>
                    <button type="button" className={answers[key] === false ? 'selected' : ''} onClick={() => set(key, false)}>False</button>
                  </span>
                </div>
              );
            })}
            <p className="small muted" style={{ marginTop: 6 }}>{trues} of {g.list.length} true</p>
          </div>
        );
      })}
      {answered >= total && total > 0 && (
        <div className="result-box">
          <p style={{ marginBottom: 0 }}>
            Done. Compare your answers with your partner&apos;s: where do you agree, and where do you see it differently? Those are the places worth talking about.
          </p>
        </div>
      )}
    </div>
  );
}
