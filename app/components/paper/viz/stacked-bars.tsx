'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { delay, Figure, Switch } from './figure';

export type StackedTone = 'danger' | 'neutral' | 'safe' | 'idle' | 'warn';
export type StackedSegment = { label: string; tone: StackedTone };
export type StackedRow = { label: string; values: number[] };
export type StackedGroup = { label?: string; rows: StackedRow[] };
export type StackedView = { label: string; groups: StackedGroup[] };

export const TONE_FILL: Record<StackedTone, string> = {
  danger: 'bg-viz-danger text-viz-danger-ink',
  neutral: 'bg-viz-neutral text-viz-neutral-ink',
  safe: 'bg-viz-safe text-viz-safe-ink',
  idle: 'bg-viz-idle text-viz-idle-ink',
  warn: 'bg-viz-warn text-viz-warn-ink',
};

export function Swatch({ tone }: { tone: StackedTone }) {
  return <span aria-hidden className={clsx('inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]', TONE_FILL[tone])} />;
}

/**
 * Stacked horizontal bars with the count printed inside each segment, grouped under small headings: the
 * layout of Figure 1 in the paper. With several views (e.g. two annotators) a switch appears beside the title.
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
  const view = views[vi];
  let rowIndex = 0;

  return (
    <Figure
      title={title}
      caption={caption}
      controls={
        views.length > 1 ? (
          <Switch label={switchLabel} options={views.map((v) => v.label)} value={vi} onChange={setVi} />
        ) : null
      }
    >
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2" aria-label="Legend">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <Swatch tone={s.tone} />
            {s.label}
          </li>
        ))}
      </ul>

      {/* Remounting on view change replays the wipe. */}
      <div key={vi} className="mt-4 space-y-5">
        {view.groups.map((group, g) => (
          <div key={group.label ?? g}>
            {group.label ? <p className="mb-1.5 text-sm text-muted">{group.label}</p> : null}
            <ul className="space-y-1.5 [&:has(li:hover)>li:not(:hover)]:opacity-45">
              {group.rows.map((row) => {
                const total = row.values.reduce((a, b) => a + b, 0);
                const i = rowIndex++;
                return (
                  <li
                    key={row.label}
                    className="grid grid-cols-[6.5rem_1fr] items-center gap-3 text-sm transition-opacity duration-150 sm:grid-cols-[8rem_1fr]"
                  >
                    <span className="truncate text-right text-ink-2">{row.label}</span>
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
                            title={`${segments[k].label}: ${v} of ${total}`}
                            className={clsx(
                              'viz-seg tabular flex h-full items-center justify-center overflow-hidden text-[0.8125rem] font-semibold',
                              TONE_FILL[segments[k].tone]
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
