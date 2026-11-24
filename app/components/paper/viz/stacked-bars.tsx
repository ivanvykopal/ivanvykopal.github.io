'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { delay, Figure, LEGEND_LIST, useIsolate, Switch } from './figure';

export type StackedTone = 'danger' | 'neutral' | 'safe' | 'idle' | 'warn';
export type StackedSegment = { label: string; tone: StackedTone };
export type StackedRow = { label: string; values: number[] };
export type StackedGroup = { label?: string; rows: StackedRow[] };
export type StackedView = { label: string; groups: StackedGroup[] };

/** Fill plus matching text colour; plain classes from global.css. */
export const TONE_FILL: Record<StackedTone, string> = {
  danger: 'viz-fill-danger',
  neutral: 'viz-fill-neutral',
  safe: 'viz-fill-safe',
  idle: 'viz-fill-idle',
  warn: 'viz-fill-warn',
};

export function Swatch({ tone }: { tone: StackedTone }) {
  return <span aria-hidden className={clsx('inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]', TONE_FILL[tone])} />;
}

/**
 * Stacked horizontal bars with the count printed inside each segment, grouped under small headings: the
 * layout of Figure 1 in the paper. Hovering a segment highlights it and reads out its share; hovering a legend
 * entry highlights that class in every row. With several views (e.g. two annotators) a switch appears beside
 * the title.
 */
export function StackedBars({
  title,
  segments,
  views,
  switchLabel = 'View',
  caption,
}: {
  title: string;
  segments: StackedSegment[];
  views: StackedView[];
  switchLabel?: string;
  caption?: string;
}) {
  const [vi, setVi] = useState(0);
  const iso = useIsolate();
  // Hovered mark: a segment (row and class), or a whole class when hovering the legend.
  const [hot, setHot] = useState<{ row: number | null; seg: number } | null>(null);
  const view = views[vi];
  const rows = view.groups.flatMap((g) => g.rows);
  let rowIndex = 0;

  const hotRow = hot && hot.row !== null ? rows[hot.row] : null;
  const hotTotal = hotRow ? hotRow.values.reduce((a, b) => a + b, 0) : 0;

  return (
    <Figure
      title={title}
      caption={caption}
      controls={
        views.length > 1 ? (
          <Switch
            label={switchLabel}
            options={views.map((v) => v.label)}
            value={vi}
            onChange={(i) => {
              setVi(i);
              setHot(null);
            }}
          />
        ) : null
      }
    >
      <ul className={LEGEND_LIST} aria-label="Legend">
        {segments.map((s, k) => (
          <li key={s.label} {...iso.legend(k)} className={clsx(iso.legend(k).className, hot && iso.active === null && hot.seg !== k && 'opacity-40 grayscale')}>
            <Swatch tone={s.tone} />
            {s.label}
          </li>
        ))}
      </ul>
      <p className="tabular mt-1.5 h-5 text-sm text-muted" aria-hidden>
        {hotRow && hot ? (
          <>
            <span className="font-semibold text-ink">{hotRow.label}</span>: {hotRow.values[hot.seg]} of {hotTotal}{' '}
            {segments[hot.seg].label.toLowerCase()} ({Math.round((hotRow.values[hot.seg] / hotTotal) * 100)}%)
          </>
        ) : (
          'Hover a bar for its share.'
        )}
      </p>

      {/* Remounting on view change replays the wipe. */}
      <div key={vi} className="mt-3 space-y-5" onMouseLeave={() => setHot(null)}>
        {view.groups.map((group, g) => (
          <div key={group.label ?? g}>
            {group.label ? <p className="mb-1.5 text-sm text-muted">{group.label}</p> : null}
            <ul className="space-y-1.5">
              {group.rows.map((row) => {
                const total = row.values.reduce((a, b) => a + b, 0);
                const i = rowIndex++;
                const otherRow = hot !== null && hot.row !== null && hot.row !== i;
                return (
                  <li
                    key={row.label}
                    className={clsx(
                      'grid grid-cols-[6.5rem_1fr] items-center gap-3 text-sm transition-opacity duration-150 sm:grid-cols-[8rem_1fr]',
                      otherRow && 'opacity-35'
                    )}
                  >
                    <span className={clsx('truncate text-right', hot?.row === i ? 'text-ink' : 'text-ink-2')}>{row.label}</span>
                    <span
                      role="img"
                      aria-label={`${row.label}: ${row.values.map((v, k) => `${v} ${segments[k].label.toLowerCase()}`).join(', ')}`}
                      className="viz-wipe flex h-7 overflow-hidden rounded-[2px]"
                      style={delay(i * 45)}
                    >
                      {row.values.map((v, k) =>
                        v > 0 ? (
                          <span
                            key={k}
                            onMouseEnter={() => setHot({ row: i, seg: k })}
                            className={clsx(
                              'viz-seg tabular flex h-full items-center justify-center overflow-hidden text-[0.8125rem] font-semibold transition-opacity duration-150',
                              TONE_FILL[segments[k].tone],
                              // Same row or legend hover: the other classes step back.
                              !otherRow && (hot ? hot.seg : iso.active) !== null && (hot ? hot.seg : iso.active) !== k && 'opacity-35 grayscale',
                              hot?.row === i && hot.seg === k && 'shadow-[inset_0_0_0_2px_rgb(var(--ink))]'
                            )}
                            style={{ width: `${(v / total) * 100}%` }}
                          >
                            <span>{v}</span>
                          </span>
                        ) : null
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Figure>
  );
}
