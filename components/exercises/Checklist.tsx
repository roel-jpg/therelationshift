'use client';
import { useState } from 'react';
import type { ChecklistData, ExerciseProps } from './types';

type Saved = { checked: string[]; own: string[] } | null;

export function Checklist({ data, initial, onChange }: ExerciseProps) {
  const items = (Array.isArray(data) ? data : []) as ChecklistData;
  const saved = initial as Saved;
  const [checked, setChecked] = useState<Set<string>>(new Set<string>(saved?.checked ?? []));
  const [own, setOwn] = useState<string[]>(saved?.own ?? []);
  const [draft, setDraft] = useState('');

  function emit(c: Set<string>, o: string[]) {
    onChange({ checked: Array.from(c), own: o });
  }
  function toggle(text: string) {
    const c = new Set<string>(checked);
    if (c.has(text)) c.delete(text); else c.add(text);
    setChecked(c);
    emit(c, own);
  }
  function addOwn() {
    const t = draft.trim();
    if (!t) return;
    const o = [...own, t];
    const c = new Set<string>(checked); c.add(t);
    setOwn(o); setChecked(c); setDraft('');
    emit(c, o);
  }

  return (
    <div>
      {[...items.map((i) => i.text), ...own].map((text) => (
        <label className="check-row" key={text}>
          <input type="checkbox" checked={checked.has(text)} onChange={() => toggle(text)} />
          <span>{text}</span>
        </label>
      ))}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add your own ritual..." />
        <button type="button" className="btn secondary" onClick={addOwn}>Add</button>
      </div>
      <p className="muted small" style={{ marginTop: 10 }}>{checked.size} selected</p>
    </div>
  );
}
