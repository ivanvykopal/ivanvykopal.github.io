'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { delay, Figure, Switch, tone } from './figure';

export type PairedSide = { label: string; /** Data colour token from global.css, e.g. "q3". */ tone: string };
export type PairedRow = { label: string; /** Short muted tag after the label, e.g. a language code. */ code?: string; left: number; right: number };

const num = (v: number) => v.toLocaleString('en-US');

/**
 * Two counts per row drawn back to back: the left bar grows leftwards from the label, the right bar
 * rightwards. Each side has its own scale. A switch sorts the rows by either side; hovering a row reads out
 * both counts.
 */
export function PairedBars({
  title,
  left,
  right,
  rows,
  caption,
}: {
  title: string;
  left: PairedSide;
  right: PairedSide;
  rows: PairedRow[];
  caption?: string;
}) {
  const [by, setBy] = useState(1);
  const [hot, setHot] = useState<string | null>(null);
  const sorted = [...rows].sort((a, b) => (by === 0 ? b.left - a.left : b.right - a.right));
  const maxL = Math.max(...rows.map((r) => r.left));
  const maxR = Math.max(...rows.map((r) => r.right));
  const hotRow = rows.find((r) => r.label === hot);
  const grid = 'grid grid-cols-[1fr_7rem_1fr] items-center gap-2 sm:grid-cols-[1fr_9rem_1fr]';

  return (
    <Figure
      title={title}
      caption={caption}
      controls={<Switch label="Sort by" options={[`Most ${left.label.toLowerCase()}`, `Most ${right.label.toLowerCase()}`]} value={by} onChange={setBy} />}
    >
      <p className="tabular h-5 text-sm text-muted" aria-hidden>
        {hotRow ? (
          <>
            <span className="font-semibold text-ink">{hotRow.label}</span>: {num(hotRow.left)} {left.label.toLowerCase()},{' '}
            {num(hotRow.right)} {right.label.toLowerCase()}
          </>
        ) : (
          'Hover a language for its counts.'
        )}
      </p>
      <div className={clsx(grid, 'mt-3 text-sm text-ink-2')}>
        <span className="flex items-center justify-end gap-2">
          {left.label}
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: tone(left.tone) }} />
        </span>
        <span />
        <span className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: tone(right.tone) }} />
          {right.label}
        </span>
      </div>
      {/* Remounting on sort replays the wipe in the new order. */}
      <ul key={by} className="mt-2 space-y-[3px]" onMouseLeave={() => setHot(null)}>
        {sorted.map((r, i) => (
          <li
            key={r.label}
            role="img"
            aria-label={`${r.label}: ${num(r.left)} ${left.label.toLowerCase()}, ${num(r.right)} ${right.label.toLowerCase()}`}
            onMouseEnter={() => setHot(r.label)}
            className={clsx(grid, 'text-[0.8125rem] transition-opacity duration-150', hot !== null && hot !== r.label && 'opacity-35')}
          >
            <span className="flex items-center justify-end gap-1.5">
              <span className="tabular viz-in text-xs text-muted" style={delay(i * 20 + 300)}>
                {num(r.left)}
              </span>
              <span
                className="viz-in h-3.5 rounded-l-[2px]"
                style={{ width: `${(r.left / maxL) * 80}%`, minWidth: r.left ? 1 : 0, background: tone(left.tone), ...delay(i * 20) }}
              />
            </span>
            <span className="truncate text-center text-ink-2">
              {r.label}
              {r.code ? <span className="ml-1 text-xs text-muted">{r.code}</span> : null}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="viz-in h-3.5 rounded-r-[2px]"
                style={{ width: `${(r.right / maxR) * 80}%`, minWidth: r.right ? 1 : 0, background: tone(right.tone), ...delay(i * 20) }}
              />
              <span className="tabular viz-in text-xs text-muted" style={delay(i * 20 + 300)}>
                {num(r.right)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
