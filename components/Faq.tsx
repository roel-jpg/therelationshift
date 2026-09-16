'use client';

import { useState } from 'react';
import { ChevronDown } from './Icons';

export type FaqItem = { title: string; description: string };

// FAQ accordion from the original support page: one item open at a time, question turns coral, chevron rotates.
export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div id="faq">
      {items.map((f, i) => (
        <div key={i} className={`accordion${open === i ? ' active' : ''}`}>
          <button type="button" className="question" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span>{f.title}</span>
            <ChevronDown />
          </button>
          <div className="answer">{f.description}</div>
        </div>
      ))}
    </div>
  );
}
