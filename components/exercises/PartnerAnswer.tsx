import type { BasicMultipleData, ChecklistData, ListOrderData, TrueFalseData } from './types';
import { LOVE_LANGUAGES } from './types';

// Shows what a partner answered, once they chose to share it and you have done the day yourself.
export function PartnerAnswer({ name, type, data, answer, reflection }: {
  name: string; type: string; data: unknown; answer: unknown; reflection: string | null;
}) {
  const body = render(type, data, answer);
  if (!body && !reflection) return null;

  return (
    <div className="block partner-answer">
      <h2>What {name} answered</h2>
      {body}
      {reflection && (
        <div className="partner-notes">
          <h4>{name}’s notes</h4>
          <p>{reflection}</p>
        </div>
      )}
    </div>
  );
}

function render(type: string, data: unknown, answer: unknown): React.ReactNode {
  if (answer == null) return null;

  if (type === 'basic-multiple') {
    const questions = ((data ?? { questions: [] }) as BasicMultipleData).questions ?? [];
    const given = answer as Record<string, string>;
    const rows = questions
      .map((q, i) => ({ q: q.question, a: (given[String(i)] ?? '').trim() }))
      .filter((r) => r.a.length > 0);
    if (!rows.length) return null;
    return (
      <>
        {rows.map((r, i) => (
          <div className="q-block" key={i}>
            <h4>{i + 1}. {r.q}</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{r.a}</p>
          </div>
        ))}
      </>
    );
  }

  if (type === 'multiple-match-category') {
    const res = (answer as { result?: string; scores?: Record<string, number> }) ?? {};
    if (!res.result) return null;
    const scores = res.scores ?? {};
    const order = Object.entries(scores).sort((a, b) => b[1] - a[1]).filter(([, n]) => n > 0);
    return (
      <>
        <p>Primary love language: <strong>{LOVE_LANGUAGES[res.result] ?? res.result}</strong></p>
        {order.length > 1 && (
          <ul>
            {order.map(([k, n]) => <li key={k}>{LOVE_LANGUAGES[k] ?? k} — {n}</li>)}
          </ul>
        )}
      </>
    );
  }

  if (type === 'checklist') {
    const saved = (answer as { checked?: string[]; own?: string[] }) ?? {};
    const items = [...(saved.checked ?? []), ...(saved.own ?? [])];
    if (!items.length) return null;
    const all = (Array.isArray(data) ? data : []) as ChecklistData;
    const known = new Set(all.map((i) => i.text));
    return (
      <ul>
        {items.map((t, i) => <li key={i}>{t}{known.has(t) ? '' : ' (added)'}</li>)}
      </ul>
    );
  }

  if (type === 'true-false') {
    const groups = ((data ?? { content: [] }) as TrueFalseData).content ?? [];
    const given = (answer as { answers?: Record<string, boolean> }).answers ?? {};
    const blocks = groups
      .map((g, gi) => ({
        group: g.group,
        items: g.list.map((item, ii) => ({ text: item.text, value: given[`${gi}-${ii}`] })).filter((x) => x.value !== undefined),
      }))
      .filter((g) => g.items.length > 0);
    if (!blocks.length) return null;
    return (
      <>
        {blocks.map((g, i) => (
          <div className="tf-group" key={i}>
            <h4>{g.group}</h4>
            {g.items.map((item, j) => (
              <div className="tf-row" key={j}>
                <span>{item.text}</span>
                <span className={item.value ? 'tf-yes' : 'tf-no'}>{item.value ? 'True' : 'False'}</span>
              </div>
            ))}
          </div>
        ))}
      </>
    );
  }

  if (type === 'list-order') {
    const top = (answer as { top?: string[] }).top ?? [];
    if (!top.length) return null;
    const all = (Array.isArray(data) ? data : []) as ListOrderData;
    const label = (title: string) => all.find((i) => i.title === title)?.title ?? title;
    return (
      <ol className="rank-list-plain">
        {top.map((t, i) => <li key={i}>{label(t)}</li>)}
      </ol>
    );
  }

  return null;
}
