import Link from 'next/link';

export type CombDay = { day: number; title: string; imageUrl?: string | null };

type Props = {
  days: CombDay[];
  done?: Set<number>;
  lockedFrom?: number | null; // days >= this are locked (no account)
  size?: 'normal' | 'small' | 'mini';
  link?: boolean;
};

// Honeycomb grid of the 21 days, the signature layout of the original Relationshift app.
// Rows of 3 / 2 / 3 / 2 ... are produced purely by flex-wrap + negative margins; the row pattern
// is forced with explicit line breaks so it looks the same on every screen width.
export function Honeycomb({ days, done, lockedFrom = null, size = 'normal', link = true }: Props) {
  const rows: CombDay[][] = [];
  let i = 0;
  let width = 3;
  while (i < days.length) {
    rows.push(days.slice(i, i + width));
    i += width;
    width = width === 3 ? 2 : 3;
  }
  return (
    <div className={`comb ${size !== 'normal' ? size : ''}`} aria-label="The 21 days">
      {rows.map((row, r) => (
        <div key={r} className="row">
          {row.map((d) => {
            const isDone = done?.has(d.day) ?? false;
            const locked = lockedFrom != null && d.day >= lockedFrom;
            const cls = `hex${isDone ? ' done' : ''}${locked ? ' locked' : ''}`;
            const style = d.imageUrl ? { backgroundImage: `url(${d.imageUrl})` } : undefined;
            const inner = (
              <>
                <span className="num">{d.day}</span>
                <span className="lbl">{d.title}</span>
                {isDone && <span className="dot" aria-label="done" />}
                {locked && <span className="lock">🔒</span>}
              </>
            );
            return link ? (
              <Link key={d.day} href={`/program/day/${d.day}`} className={cls} style={style} title={`Day ${d.day}: ${d.title}`}>
                {inner}
              </Link>
            ) : (
              <div key={d.day} className={cls} style={style}>{inner}</div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
