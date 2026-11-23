'use client';

import { useState } from 'react';
import { delay, Figure, Switch, tone } from './figure';

export type DumbbellMetric = {
  label: string;
  /** Which direction is good, e.g. "higher is better". */
  hint: string;
  max: number;
  /** One value per row for each of the two series. */
  a: number[];
  b: number[];
};

const TONES = ['q3', 'alt'] as const;

/**
 * Two values per row on a shared axis, joined by a line whose length is the gap between them. A switch
 * changes the metric and the dots slide to their new positions.
 */
export function Dumbbell({
  title,
  rows,
  series,
  metrics,
  caption,
}: {
  title: string;
  rows: string[];
  series: [string, string];
  metrics: DumbbellMetric[];
  caption?: string;
}) {
  const [mi, setMi] = useState(0);
  const metric = metrics[mi];
  const pct = (v: number) => (v / metric.max) * 100;
  const ticks = [0, metric.max / 2, metric.max];

  return (
    <Figure
      title={title}
      caption={caption}
      controls={<Switch label="Metric" options={metrics.map((m) => m.label)} value={mi} onChange={setMi} />}
    >
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2" aria-label="Legend">
        {series.map((label, k) => (
          <li key={label} className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tone(TONES[k]) }} />
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
              <span className="truncate text-right text-ink-2">{row}</span>
              <span
                role="img"
                aria-label={`${row}: ${series[0]} ${a}, ${series[1]} ${b}`}
                className="viz-in relative mx-8 block h-8 border-b border-rule/70"
                style={delay(i * 60)}
              >
                <span
                  className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-muted/50 transition-[left,width] duration-500 ease-out motion-reduce:transition-none"
                  style={{ left: `${pct(lo)}%`, width: `${pct(hi - lo)}%` }}
                />
                {[a, b].map((v, k) => (
                  <span
                    key={k}
                    className="absolute top-1/2 transition-[left] duration-500 ease-out motion-reduce:transition-none"
                    style={{ left: `${pct(v)}%` }}
                  >
                    <span
                      className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full ring-2 ring-page"
                      style={{ background: tone(TONES[k]) }}
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
