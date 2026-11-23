'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { delay, Figure, Switch, tone, Tooltip } from './figure';

type Point = [mean: number, ci: number] | null;

export type DotSeries = { label: string; /** Data colour token from global.css, e.g. "q3". */ tone: string };
export type DotRow = {
  label: string;
  /** Short muted text after the label, e.g. the number of pairs behind the row. */
  note?: string;
  /** One [mean, 95% confidence half-width] per series; null where the series has no value. */
  values: Point[];
};
export type DotGroup = { label?: string; rows: DotRow[] };
export type DotView = { label: string; groups: DotGroup[] };

const fmt = (v: number) => v.toFixed(2);

/**
 * Several methods scored on one row each: a dot per series with its confidence whisker, on a shared axis.
 * Hovering or focusing a row opens a tooltip with every value; hovering a legend entry isolates that series.
 * With several views a switch appears beside the title and the dots slide to their new positions.
 */
export function DotPlot({
  title,
  series,
  views,
  domain = [0, 1],
  ticks = [0, 0.25, 0.5, 0.75, 1],
  axisLabel,
  switchLabel = 'View',
  caption,
}: {
  title: string;
  series: DotSeries[];
  views: DotView[];
  domain?: [number, number];
  ticks?: number[];
  /** Name of the measure, shown under the axis. */
  axisLabel?: string;
  switchLabel?: string;
  caption?: string;
}) {
  const [vi, setVi] = useState(0);
  const [hotRow, setHotRow] = useState<string | null>(null);
  const [hotSeries, setHotSeries] = useState<number | null>(null);
  const view = views[vi];
  const pct = (v: number) => ((Math.min(Math.max(v, domain[0]), domain[1]) - domain[0]) / (domain[1] - domain[0])) * 100;
  const grid = 'grid grid-cols-[8.5rem_1fr] items-center gap-3 sm:grid-cols-[13rem_1fr]';
  /** Covers the track column of a row (label column, gap and the track's margin skipped), so tooltips share its x scale. */
  const trackOverlay = 'pointer-events-none absolute inset-y-0 left-[9.75rem] right-2 sm:left-[14.25rem]';
  let rowIndex = 0;
  const rowCount = view.groups.reduce((n, g) => n + g.rows.length, 0);

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
              setHotRow(null);
            }}
          />
        ) : null
      }
    >
      <ul className="-mx-2 flex flex-wrap gap-x-1 gap-y-0.5 text-sm text-ink-2" aria-label="Legend" onMouseLeave={() => setHotSeries(null)}>
        {series.map((s, k) => (
          <li
            key={s.label}
            onMouseEnter={() => setHotSeries(k)}
            className={clsx(
              'flex cursor-default items-center gap-2 rounded px-2 py-0.5 transition-opacity duration-150',
              hotSeries !== null && hotSeries !== k && 'opacity-40'
            )}
          >
            <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tone(s.tone) }} />
            {s.label}
          </li>
        ))}
      </ul>
      <p className="mt-1.5 text-sm text-muted" aria-hidden>
        Hover a row for exact values.
      </p>

      <div className="mt-3 space-y-5" onMouseLeave={() => setHotRow(null)}>
        {view.groups.map((group, g) => (
          <div key={group.label ?? g}>
            {group.label ? <p className="mb-1 text-sm text-muted">{group.label}</p> : null}
            <ul>
              {group.rows.map((row) => {
                const i = rowIndex++;
                const other = hotRow !== null && hotRow !== row.label;
                return (
                  <li
                    key={row.label}
                    tabIndex={0}
                    onMouseEnter={() => setHotRow(row.label)}
                    onFocus={() => setHotRow(row.label)}
                    onBlur={() => setHotRow(null)}
                    className={clsx(grid, 'relative rounded text-sm outline-none transition-opacity duration-150', other && 'opacity-35')}
                  >
                    <span className="min-w-0 truncate text-right text-ink-2" title={row.note ? `${row.label} (${row.note})` : row.label}>
                      {row.label}
                      {row.note ? <span className="tabular ml-1.5 hidden text-xs text-muted sm:inline">{row.note}</span> : null}
                    </span>
                    <span
                      role="img"
                      aria-label={`${row.label}: ${series
                        .map((s, k) => (row.values[k] ? `${s.label} ${fmt(row.values[k]![0])}` : null))
                        .filter(Boolean)
                        .join(', ')}`}
                      className="viz-in relative mx-2 block h-7 border-b border-rule/70"
                      style={delay(i * 25)}
                    >
                      {series.map((s, k) => {
                        const v = row.values[k];
                        if (!v) return null;
                        const dim = hotSeries !== null && hotSeries !== k;
                        return (
                          <span
                            key={s.label}
                            className={clsx('absolute inset-0 transition-opacity duration-150', dim && 'opacity-15')}
                            style={{ zIndex: hotSeries === k ? 2 : 1 }}
                          >
                            <span
                              className="absolute top-1/2 h-0.5 -translate-y-1/2 transition-[left,width] duration-500 ease-out motion-reduce:transition-none"
                              style={{
                                left: `${pct(v[0] - v[1])}%`,
                                width: `${pct(v[0] + v[1]) - pct(v[0] - v[1])}%`,
                                background: tone(s.tone, 0.55),
                              }}
                            />
                            <span
                              className="absolute top-1/2 -ml-[5px] -mt-[5px] h-2.5 w-2.5 rounded-full ring-2 ring-page transition-[left] duration-500 ease-out motion-reduce:transition-none"
                              style={{ left: `${pct(v[0])}%`, background: tone(s.tone) }}
                            />
                          </span>
                        );
                      })}
                    </span>
                    {hotRow === row.label ? (
                      <RowTooltip
                        row={row}
                        series={series}
                        hotSeries={hotSeries}
                        pct={pct}
                        overlay={trackOverlay}
                        above={rowCount > 4 && i >= rowCount - 3}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div aria-hidden className={grid}>
          <span className="text-right text-xs text-muted">{axisLabel}</span>
          <span className="tabular relative mx-2 block h-5 text-xs text-muted">
            {ticks.map((t) => (
              <span key={t} className={clsx('absolute top-1', pct(t) >= 100 ? '-translate-x-full' : '-translate-x-1/2')} style={{ left: `${pct(t)}%` }}>
                {t}
              </span>
            ))}
          </span>
        </div>
      </div>
    </Figure>
  );
}

/**
 * Values of one row sorted from highest to lowest, opening under the row (above it for the last rows, so it
 * stays inside the chart) and never over the row's own dots.
 */
function RowTooltip({
  row,
  series,
  hotSeries,
  pct,
  overlay,
  above,
}: {
  row: DotRow;
  series: DotSeries[];
  hotSeries: number | null;
  pct: (v: number) => number;
  overlay: string;
  above: boolean;
}) {
  const entries = series
    .map((s, k) => ({ s, k, v: row.values[k] }))
    .filter((e): e is { s: DotSeries; k: number; v: [number, number] } => e.v !== null)
    .sort((a, b) => b.v[0] - a.v[0]);
  if (entries.length === 0) return null;
  // Rightwards from the leftmost whisker, or leftwards when that whisker sits in the right half.
  const x = pct(Math.min(...entries.map((e) => e.v[0] - e.v[1])));
  return (
    <span aria-hidden className={overlay}>
      <Tooltip x={x} {...(above ? { bottom: 30 } : { top: 30 })} flip={x > 50} wide>
        <p className="mb-1 font-semibold text-ink">
          {row.label}
          {row.note ? <span className="ml-1.5 font-normal text-muted">{row.note}</span> : null}
        </p>
        <ul className="space-y-0.5">
          {entries.map(({ s, k, v }) => (
            <li
              key={s.label}
              className={clsx('tabular flex items-center justify-between gap-4', hotSeries !== null && hotSeries !== k && 'opacity-40')}
            >
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: tone(s.tone) }} />
                {s.label}
              </span>
              <span className="whitespace-nowrap">
                {fmt(v[0])}
                {v[1] ? <span className="text-muted"> ± {fmt(v[1])}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      </Tooltip>
    </span>
  );
}
