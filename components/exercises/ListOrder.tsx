'use client';
import { useState } from 'react';
import type { ExerciseProps, ListOrderData } from './types';

type Saved = { top: string[] } | null;
const MAX = 5;

// Day 18 "Values of life" — choose your top 5 values and put them in order.
export function ListOrder({ data, initial, onChange }: ExerciseProps) {
  const items = (Array.isArray(data) ? data : []) as ListOrderData;
  const saved = initial as Saved;
  const [top, setTop] = useState<string[]>(saved?.top ?? []);

  function update(next: string[]) { setTop(next); onChange({ top: next }); }
  function toggle(title: string) {
    if (top.includes(title)) update(top.filter((t) => t !== title));
    else if (top.length < MAX) update([...top, title]);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= top.length) return;
    const next = [...top];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  }

  return (
    <div>
      <p className="muted small">Pick the {MAX} values that matter most to you ({top.length}/{MAX} chosen), then put them in order.</p>
      {top.length > 0 && (
        <ol className="rank-list" style={{ marginBottom: 20 }}>
          {top.map((t, i) => (
            <li key={t}>
              <span className="num">{i + 1}</span>
              <span>{t}</span>
              <span className="ctrl">
                <button type="button" onClick={() => move(i, -1)} aria-label="Move up">↑</button>
                <button type="button" onClick={() => move(i, 1)} aria-label="Move down">↓</button>
                <button type="button" onClick={() => toggle(t)} aria-label="Remove">×</button>
              </span>
            </li>
          ))}
        </ol>
      )}
      <div className="choice">
        {items.map((it) => (
          <button
            type="button"
            key={it.title}
            className={top.includes(it.title) ? 'selected' : ''}
            onClick={() => toggle(it.title)}
            disabled={!top.includes(it.title) && top.length >= MAX}
          >
            <strong style={{ fontWeight: 400 }}>{it.title}</strong>
            <span className="muted small" style={{ display: 'block' }}>{it.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
