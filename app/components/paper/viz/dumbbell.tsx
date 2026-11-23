'use client';

import { useState } from 'react';
import { delay, Figure, Hint, Switch, tone } from './figure';

export type DumbbellMetric = {
  label: string;
  /** Which direction is good, e.g. "higher is better". */
  hint: string;
  /** Axis range; `min` defaults to 0. */
  min?: number;
  max: number;
  /** One value per row for each of the two series. */
  a: number[];
  b: number[];
};

/**
 * Two values per row on a shared axis, joined by a line whose length is the gap between them. A switch
 * changes the metric and the dots slide to their new positions.
 */
export function Dumbbell({
  title,
  rows,
  rowDescriptions,
  series,
  tones = ['q3', 'alt'],
  metrics,
  switchLabel = 'Metric',
  caption,
}: {
  title: string;
  rows: string[];
  /** Full wording behind each row label, shown when the label is hovered. */
  rowDescriptions?: string[];
  series: [string, string];
  /** Data colour tokens of the two series. */
  tones?: [string, string];
  metrics: DumbbellMetric[];
  switchLabel?: string;
  caption?: string;
}) {
  const [mi, setMi] = useState(0);
  const metric = metrics[mi];
  const min = metric.min ?? 0;
  const pct = (v: number) => ((v - min) / (metric.max - min)) * 100;
  const ticks = [min, (min + metric.max) / 2, metric.max];

  return (
    <Figure
      title={title}
      caption={caption}
      controls={<Switch label={switchLabel} options={metrics.map((m) => m.label)} value={mi} onChange={setMi} />}
    >
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2" aria-label="Legend">
        {series.map((label, k) => (
          <li key={label} className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tone(tones[k]) }} />
            {label}
          </li>
        ))}
        <li className="text-muted">{metric.hint}</li>
      </ul>

      <ul className="mt-4">
        {rows.map((row, i) => {
          const a = metric.a[i];
          const b = metric.b[i];
          const [lo, hi] = a < b ? [a, b] : [b, a];
          return (
            <li key={row} className="grid grid-cols-[7.5rem_1fr] items-center gap-3 text-sm sm:grid-cols-[9.5rem_1fr]">
              <span tabIndex={rowDescriptions ? 0 : undefined} className="group relative rounded text-right text-ink-2">
                {row}
                {rowDescriptions?.[i] ? <Hint>{rowDescriptions[i]}</Hint> : null}
              </span>
              <span
                role="img"
                aria-label={`${row}: ${series[0]} ${a}, ${series[1]} ${b}`}
                className="viz-in relative mx-8 block h-8 border-b border-rule/70"
                style={delay(i * 60)}
              >
                <span
                  className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-muted/50 transition-[left,width] duration-500 ease-out motion-reduce:transition-none"
                  style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
                />
                {[a, b].map((v, k) => (
                  <span
                    key={k}
                    className="absolute top-1/2 transition-[left] duration-500 ease-out motion-reduce:transition-none"
                    style={{ left: `${pct(v)}%` }}
                  >
                    <span
                      className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full ring-2 ring-page"
                      style={{ background: tone(tones[k]) }}
                    />
                    <span
                      className="tabular absolute top-1/2 -translate-y-1/2 text-xs text-ink-2"
                      style={v === hi && a !== b ? { left: 11 } : { right: 11 }}
                    >
                      {v.toFixed(2)}
                    </span>
                  </span>
                ))}
              </span>
            </li>
          );
        })}
        <li aria-hidden className="grid grid-cols-[7.5rem_1fr] gap-3 sm:grid-cols-[9.5rem_1fr]">
          <span />
          <span className="tabular relative mx-8 block h-6 text-xs text-muted">
            {ticks.map((t) => (
              <span key={t} className="absolute top-1.5 -translate-x-1/2" style={{ left: `${pct(t)}%` }}>
                {t}
              </span>
            ))}
          </span>
        </li>
      </ul>
    </Figure>
  );
}
