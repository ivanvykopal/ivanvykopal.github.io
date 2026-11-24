'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { DIMMED, delay, Figure, LEGEND_LIST, tone, useIsolate, useWidth } from './figure';

export type ColumnBar = { label: string; /** Share of the whole in percent. */ value: number; /** Part of `value` drawn in the second colour. */ part: number };
export type ColumnPanel = { label: string; bars: ColumnBar[] };
export type ColumnSeries = { label: string; tone: string };

const M = { l: 48, r: 10, t: 22, b: 112 };
const HEIGHT = 330;

/** A round axis maximum and tick step for the tallest bar. */
function axis(max: number) {
  const step = max > 30 ? 5 : max > 15 ? 5 : 5;
  const top = Math.ceil((max * 1.08) / step) * step;
  return { top, ticks: Array.from({ length: top / step + 1 }, (_, k) => k * step) };
}

function Panel({ panel, whole, part, yLabel, iso, index }: { panel: ColumnPanel; whole: ColumnSeries; part: ColumnSeries; yLabel: string; iso: ReturnType<typeof useIsolate>; index: number }) {
  const [ref, measured] = useWidth<HTMLDivElement>(800);
  const [hot, setHot] = useState<number | null>(null);
  const width = Math.max(measured, 420);
  const plotW = width - M.l - M.r;
  const plotH = HEIGHT - M.t - M.b;
  const n = panel.bars.length;
  const slot = plotW / n;
  const barW = Math.min(slot * 0.82, 30);
  const { top, ticks } = axis(Math.max(...panel.bars.map((b) => b.value)));
  const y = (v: number) => M.t + (1 - v / top) * plotH;
  const fmt = (v: number) => v.toFixed(1);

  return (
    <div ref={ref} className="min-w-0">
      <p className="text-center text-sm font-semibold text-ink">{panel.label}</p>
      <p className="tabular h-5 text-center text-xs text-muted" aria-hidden>
        {hot !== null
          ? `${panel.bars[hot].label}: ${fmt(panel.bars[hot].value)}% of all domains, ${fmt(panel.bars[hot].part)}% of them disinformation`
          : ''}
      </p>
      <div className="overflow-x-auto overflow-y-hidden">
        <svg
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          className="block"
          role="img"
          aria-label={`${panel.label}: ${panel.bars.map((b) => `${b.label} ${fmt(b.value)}%, of which disinformation ${fmt(b.part)}%`).join('; ')}`}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={M.l} x2={M.l + plotW} y1={y(t)} y2={y(t)} stroke="rgb(var(--rule))" strokeDasharray="3 3" />
              <text x={M.l - 6} y={y(t)} textAnchor="end" dominantBaseline="central" fontSize="11" fill="rgb(var(--muted))" className="tabular">
                {t}
              </text>
            </g>
          ))}
          <line x1={M.l} x2={M.l + plotW} y1={y(0)} y2={y(0)} stroke="rgb(var(--muted))" />
          <text transform={`translate(12 ${M.t + plotH / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="rgb(var(--ink-2))">
            {yLabel}
          </text>
          <text x={M.l + plotW / 2} y={HEIGHT - 4} textAnchor="middle" fontSize="12" fill="rgb(var(--ink-2))">
            Domain category
          </text>

          {panel.bars.map((b, i) => {
            const cx = M.l + (i + 0.5) * slot;
            const h = y(0) - y(b.value);
            const ph = y(0) - y(b.part);
            return (
              <g key={b.label} className={clsx(hot !== null && hot !== i && 'opacity-50', 'transition-opacity duration-150')}>
                <g className="viz-rise" style={delay(index * 100 + i * 15)}>
                  <rect x={cx - barW / 2} y={y(b.value)} width={barW} height={h} fill={tone(whole.tone)} className={clsx('transition-[opacity,filter] duration-150', iso.dim(0) && DIMMED)} />
                  {b.part > 0 ? <rect x={cx - barW / 2} y={y(b.part)} width={barW} height={ph} fill={tone(part.tone)} className={clsx('transition-[opacity,filter] duration-150', iso.dim(1) && DIMMED)} /> : null}
                </g>
                <text x={cx} y={y(b.value) - 4} textAnchor="middle" fontSize="10" fontWeight={i === 0 ? 600 : undefined} fill="rgb(var(--ink-2))" className="tabular">
                  {fmt(b.value)}
                </text>
                {b.part > 0 ? (
                  <text x={cx} y={y(0) - 3} textAnchor="middle" fontSize="9" fill={tone(part.tone)} className="tabular" fontWeight={600}>
                    {fmt(b.part)}
                  </text>
                ) : null}
                <text
                  transform={`translate(${cx + 3} ${y(0) + 9}) rotate(-45)`}
                  textAnchor="end"
                  fontSize="10.5"
                  fill={hot === i ? 'rgb(var(--ink))' : 'rgb(var(--ink-2))'}
                >
                  {b.label}
                </text>
                <rect
                  x={cx - slot / 2}
                  y={M.t}
                  width={slot}
                  height={HEIGHT - M.t - 20}
                  fill="transparent"
                  tabIndex={0}
                  role="img"
                  aria-label={`${b.label}: ${fmt(b.value)}%, of which disinformation ${fmt(b.part)}%`}
                  className="outline-none"
                  onMouseEnter={() => setHot(i)}
                  onMouseLeave={() => setHot(null)}
                  onFocus={() => setHot(i)}
                  onBlur={() => setHot(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/**
 * One column chart per panel: categories sorted from the largest share down, each column with a second colour
 * for the part of it that belongs to a subset (here the disinformation sources), values printed on top. The
 * layout of Figure 9 in the paper. Hover a column for its readout; hover or click a legend entry to isolate a
 * colour.
 */
export function ColumnChart({
  title,
  whole,
  part,
  yLabel = 'Percentage of all domains (%)',
  panels,
  caption,
}: {
  title: string;
  whole: ColumnSeries;
  part: ColumnSeries;
  yLabel?: string;
  panels: ColumnPanel[];
  caption?: string;
}) {
  const iso = useIsolate();
  return (
    <Figure title={title} caption={caption}>
      <ul className={LEGEND_LIST} aria-label="Legend">
        {[part, whole].map((s) => {
          const k = s === whole ? 0 : 1;
          return (
            <li key={s.label} {...iso.legend(k)}>
              <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: tone(s.tone) }} />
              {s.label}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 space-y-8">
        {panels.map((p, i) => (
          <Panel key={p.label} panel={p} whole={whole} part={part} yLabel={yLabel} iso={iso} index={i} />
        ))}
      </div>
    </Figure>
  );
}
