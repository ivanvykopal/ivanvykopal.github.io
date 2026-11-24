'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { delay, Figure, Switch, tone } from './figure';

export type ClaimKind = 'claim' | 'noise';
export type RankedClaim = { text: string; kind: ClaimKind; /** Number of posts it was retrieved for. */ count: number; similarity: number };
export type ClaimView = { label: string; /** What `count` counts in this view, shown as the column heading. */ countLabel: string; rows: RankedClaim[] };

const KINDS: { kind: ClaimKind; label: string; tone: string }[] = [
  { kind: 'claim', label: 'Fact-checked claim', tone: 'q3' },
  { kind: 'noise', label: 'Not a claim: code or a bare link', tone: 'danger' },
];
const toneOf = (kind: ClaimKind) => KINDS.find((k) => k.kind === kind)!.tone;

/**
 * The entries a retriever returns most often, one row each: the (truncated) text, a bar for the number of posts
 * it came back for, and a dot for its mean cosine similarity. Entries that are not claims are drawn in red, so
 * a frequent entry with a low similarity stands out. A switch changes the ranking, e.g. rank 1 or top 20.
 */
export function ClaimRanking({
  title,
  views,
  similarity,
  switchLabel = 'Ranking',
  caption,
}: {
  title: string;
  views: ClaimView[];
  /** Range and ticks of the similarity axis. */
  similarity: { min: number; max: number; ticks: number[] };
  switchLabel?: string;
  caption?: string;
}) {
  const [vi, setVi] = useState(0);
  const view = views[vi];
  const top = Math.max(...view.rows.map((r) => r.count));
  const sim = (v: number) => ((v - similarity.min) / (similarity.max - similarity.min)) * 100;
  // On narrow screens the entry text takes its own line above the bar and the similarity.
  const grid =
    'grid grid-cols-[minmax(0,1fr)_7rem_2.5rem] items-center gap-x-3 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_9rem_2.75rem] sm:gap-x-4';

  return (
    <Figure
      title={title}
      caption={caption}
      controls={views.length > 1 ? <Switch label={switchLabel} options={views.map((v) => v.label)} value={vi} onChange={setVi} /> : null}
    >
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2" aria-label="Legend">
        {KINDS.map((k) => (
          <li key={k.kind} className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: tone(k.tone) }} />
            {k.label}
            <span className="tabular text-muted">
              {view.rows.filter((r) => r.kind === k.kind).length} of {view.rows.length}
            </span>
          </li>
        ))}
      </ul>

      <div className={clsx(grid, 'mt-4 border-b border-rule pb-1.5 text-xs text-muted')} aria-hidden>
        <span className="hidden sm:block">Entry, truncated as in the paper</span>
        <span>{view.countLabel}</span>
        <span className="col-span-2">Mean cosine similarity</span>
      </div>
      <ol className="[&:has(li:hover)>li:not(:hover)]:opacity-45" aria-label={view.label}>
        {view.rows.map((row, i) => (
          <li
            key={`${vi}-${row.text}`}
            className={clsx(grid, 'border-b border-rule/70 py-1.5 text-sm transition-opacity duration-150')}
            aria-label={`${row.text}: ${row.count} posts, similarity ${row.similarity.toFixed(3)}`}
          >
            <span
              className={clsx(
                'viz-in col-span-3 min-w-0 truncate sm:col-span-1',
                row.kind === 'noise' ? 'font-mono text-[0.8125rem] text-ink' : 'text-ink-2'
              )}
              title={row.text}
              style={delay(i * 40)}
            >
              {row.text}
            </span>
            <span className="flex items-center gap-2">
              <span
                className="viz-wipe h-4 shrink-0 rounded-r-[2px]"
                style={{ width: `${(row.count / top) * 85}%`, minWidth: 2, background: tone(toneOf(row.kind), row.kind === 'noise' ? 0.85 : 0.6), ...delay(i * 40) }}
              />
              <span className="tabular text-ink-2">{row.count}</span>
            </span>
            <span className="relative mx-1.5 block h-5" aria-hidden>
              <span className="absolute inset-x-0 top-1/2 h-px bg-rule" />
              <span
                className="viz-in absolute top-1/2 -ml-[5px] -mt-[5px] h-2.5 w-2.5 rounded-full ring-2 ring-page"
                style={{ left: `${sim(row.similarity)}%`, background: tone(toneOf(row.kind)), ...delay(i * 40 + 200) }}
              />
            </span>
            <span className="tabular text-right text-ink-2">{row.similarity.toFixed(3)}</span>
          </li>
        ))}
      </ol>
      <div className={clsx(grid, 'pt-1 text-xs text-muted')} aria-hidden>
        <span className="hidden sm:block" />
        <span />
        <span className="tabular relative mx-1.5 block h-4">
          {similarity.ticks.map((t) => (
            <span key={t} className="absolute -translate-x-1/2" style={{ left: `${sim(t)}%` }}>
              {t.toFixed(2)}
            </span>
          ))}
        </span>
        <span />
      </div>
    </Figure>
  );
}
