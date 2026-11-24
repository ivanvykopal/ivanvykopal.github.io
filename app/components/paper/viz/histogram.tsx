'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { DIMMED, delay, Figure, LEGEND_LIST, tone, useIsolate, useWidth } from './figure';

export type HistogramSeries = { label: string; /** Data colour token from global.css, e.g. "q5". */ tone: string };
export type HistogramPanel = {
  label: string;
  /** One list of counts per series, one count per bin. */
  counts: number[][];
  /** Marked with a solid line (mean) and a dashed line (median), as x values. */
  mean: number;
  median: number;
};

const M = { l: 44, r: 12, t: 26, b: 40 };
const HEIGHT = 250;

/** Outline of a histogram as one closed path: bin heights joined by vertical steps. */
function stepPath(counts: number[], x: (v: number) => number, y: (v: number) => number, binWidth: number) {
  let d = `M${x(0)},${y(0)}`;
  counts.forEach((c, i) => {
    d += `L${x(i * binWidth)},${y(c)}L${x((i + 1) * binWidth)},${y(c)}`;
  });
  return `${d}L${x(counts.length * binWidth)},${y(0)}Z`;
}

function Panel({
  panel,
  series,
  yMax,
  yTicks,
  xLabel,
  iso,
  index,
}: {
  panel: HistogramPanel;
  series: HistogramSeries[];
  yMax: number;
  yTicks: number[];
  xLabel: string;
  iso: ReturnType<typeof useIsolate>;
  index: number;
}) {
  const [ref, measured] = useWidth<HTMLDivElement>(420);
  const [hot, setHot] = useState<number | null>(null);
  const width = Math.max(measured, 260);
  const plotW = width - M.l - M.r;
  const plotH = HEIGHT - M.t - M.b;
  const bins = panel.counts[0].length;
  const binWidth = 100 / bins;
  const x = (v: number) => M.l + (v / 100) * plotW;
  const y = (v: number) => M.t + (1 - v / yMax) * plotH;

  return (
    <div ref={ref} className="min-w-0">
      <p className="text-center text-sm font-semibold text-ink">{panel.label}</p>
      <div className="relative">
        <svg
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          className="block"
          role="img"
          aria-label={`${panel.label}: groundedness per conversation. ${series
            .map((s, k) => `${s.label} ${panel.counts[k].reduce((a, b) => a + b, 0)} conversations`)
            .join(', ')}. Mean ${panel.mean}, median ${panel.median}.`}
        >
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={M.l} x2={M.l + plotW} y1={y(t)} y2={y(t)} stroke="rgb(var(--rule))" strokeDasharray="3 3" />
              <text x={M.l - 6} y={y(t)} textAnchor="end" dominantBaseline="central" fontSize="11" fill="rgb(var(--muted))" className="tabular">
                {t}
              </text>
            </g>
          ))}
          {[0, 20, 40, 60, 80, 100].map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={M.t} y2={M.t + plotH} stroke="rgb(var(--rule))" strokeDasharray="3 3" />
              <text x={x(t)} y={M.t + plotH + 16} textAnchor="middle" fontSize="11" fill="rgb(var(--muted))" className="tabular">
                {t}
              </text>
            </g>
          ))}
          <rect x={M.l} y={M.t} width={plotW} height={plotH} fill="none" stroke="rgb(var(--ink-2))" strokeOpacity={0.6} />
          <text x={M.l + plotW / 2} y={HEIGHT - 6} textAnchor="middle" fontSize="12" fill="rgb(var(--ink-2))">
            {xLabel}
          </text>
          <text transform={`translate(12 ${M.t + plotH / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="rgb(var(--ink-2))">
            Count
          </text>

          {series.map((s, k) => (
            <g key={s.label} className={clsx('transition-[opacity,filter] duration-150', iso.dim(k) && DIMMED)}>
              <path
                d={stepPath(panel.counts[k], x, y, binWidth)}
                fill={tone(s.tone, 0.5)}
                stroke={tone(s.tone)}
                strokeWidth={1.25}
                className="viz-in"
                style={delay(index * 120 + k * 80)}
              />
            </g>
          ))}

          {[
            { v: panel.median, dash: '5 3', name: 'median' },
            { v: panel.mean, dash: undefined, name: 'mean' },
          ].map(({ v, dash, name }) => (
            <g key={name}>
              <line x1={x(v)} x2={x(v)} y1={M.t - 4} y2={M.t + plotH} stroke={tone(series[0].tone)} strokeWidth={1.5} strokeDasharray={dash} />
              <text x={x(v)} y={M.t - 8} textAnchor="middle" fontSize="11" fill={tone(series[0].tone)} className="tabular">
                {Math.round(v)}
              </text>
            </g>
          ))}
          <line x1={x(0)} x2={x(0)} y1={M.t - 4} y2={M.t + plotH} stroke={tone(series[series.length - 1].tone)} strokeWidth={1.5} strokeDasharray="5 3" />
          <text x={x(0)} y={M.t - 8} textAnchor="middle" fontSize="11" fill={tone(series[series.length - 1].tone)}>
            0
          </text>

          {Array.from({ length: bins }, (_, b) => (
            <rect
              key={b}
              x={x(b * binWidth)}
              y={M.t}
              width={plotW / bins}
              height={plotH}
              fill={hot === b ? 'rgb(var(--ink) / 0.06)' : 'transparent'}
              tabIndex={0}
              role="img"
              aria-label={`${b * binWidth} to ${(b + 1) * binWidth} percent: ${series.map((s, k) => `${panel.counts[k][b]} ${s.label}`).join(', ')}`}
              className="outline-none"
              onMouseEnter={() => setHot(b)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(b)}
              onBlur={() => setHot(null)}
            />
          ))}
        </svg>
        <p className="tabular h-5 text-center text-xs text-muted" aria-hidden>
          {hot !== null ? (
            <>
              {hot * binWidth} to {(hot + 1) * binWidth}%: {series.map((s, k) => `${panel.counts[k][hot]} ${s.label.toLowerCase()}`).join(', ')}
            </>
          ) : (
            ''
          )}
        </p>
      </div>
    </div>
  );
}

/**
 * Small multiples of histograms: for each panel the number of conversations at each level of groundedness, one
 * outline per series, with the mean as a solid and the median as a dashed vertical line. The layout of
 * Figure 3 in the paper. Hover a bin for its counts; hover or click a legend entry to isolate a series.
 */
export function Histogram({
  title,
  series,
  panels,
  yMax = 650,
  yTicks = [0, 100, 200, 300, 400, 500, 600],
  xLabel = 'Groundedness (%)',
  caption,
}: {
  title: string;
  series: HistogramSeries[];
  panels: HistogramPanel[];
  yMax?: number;
  yTicks?: number[];
  xLabel?: string;
  caption?: string;
}) {
  const iso = useIsolate();
  return (
    <Figure title={title} caption={caption}>
      <ul className={LEGEND_LIST} aria-label="Legend">
        {series.map((s, k) => (
          <li key={s.label} {...iso.legend(k)}>
            <span aria-hidden className="inline-block h-2.5 w-4 shrink-0 rounded-[2px]" style={{ background: tone(s.tone, 0.7) }} />
            {s.label}
          </li>
        ))}
        <li className="flex items-center gap-2 px-2 py-0.5">
          <svg width="20" height="10" aria-hidden>
            <line x1="0" x2="20" y1="5" y2="5" stroke="rgb(var(--ink-2))" strokeWidth="1.5" strokeDasharray="5 3" />
          </svg>
          Median
        </li>
        <li className="flex items-center gap-2 px-2 py-0.5">
          <svg width="20" height="10" aria-hidden>
            <line x1="0" x2="20" y1="5" y2="5" stroke="rgb(var(--ink-2))" strokeWidth="1.5" />
          </svg>
          Mean
        </li>
      </ul>
      <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {panels.map((p, i) => (
          <Panel key={p.label} panel={p} series={series} yMax={yMax} yTicks={yTicks} xLabel={xLabel} iso={iso} index={i} />
        ))}
      </div>
    </Figure>
  );
}
