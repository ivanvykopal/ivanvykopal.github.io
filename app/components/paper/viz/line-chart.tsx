'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Figure, Hint, Switch, Tooltip, tone, useWidth } from './figure';

type Point = [mean: number, ci: number] | null;

export type LineSeries = {
  id: string;
  label: string;
  /** Data colour token from global.css, e.g. "q3". */
  tone: string;
  /** SVG stroke-dasharray; omit for a solid line. */
  dash?: string;
  /** One [mean, 95% confidence half-width] per category; null where there is no rating. */
  values: Point[];
};
export type LineDataset = {
  label: string;
  note?: string;
  /** Written across trailing categories that have no values in this dataset. */
  emptyLabel?: string;
  series: LineSeries[];
};
/** A run of neighbouring categories with a heading above the plot, separated by dashed rules. */
export type LineBand = { label: string; span: number };

const SCALE = ['Does not apply', 'Few parts', 'Some parts', 'Most parts', 'Completely applies'];
const M = { l: 122, r: 12, t: 12, b: 34 };
const HEIGHT = 340;
const TWEEN_MS = 650;

const valuesOf = (ds: LineDataset) => Object.fromEntries(ds.series.map((s) => [s.id, s.values]));

/**
 * Mean scores (1 to 5) over categories, one line per question with its confidence band: the layout of
 * Figures 2 and 4 in the paper. Lines draw left to right on first view. Switching dataset moves every point
 * to its new value, hovering a legend entry isolates that line, clicking hides it.
 */
export function LineChart({
  title,
  categories,
  categoryTitles,
  bands,
  datasets,
  descriptions,
  minWidth = 640,
  caption,
}: {
  title: string;
  categories: string[];
  /** Longer names for the tooltip, one per category. */
  categoryTitles?: string[];
  bands?: LineBand[];
  datasets: LineDataset[];
  /** Full wording behind a series label, by series id; shown when its legend entry is hovered. */
  descriptions?: Record<string, string>;
  minWidth?: number;
  caption?: string;
}) {
  const [ref, measured] = useWidth<HTMLDivElement>(856);
  const [di, setDi] = useState(0);
  const [hidden, setHidden] = useState<string[]>([]);
  const [focus, setFocus] = useState<string | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const ds = datasets[di];

  // Displayed values tween towards the selected dataset, so the difference between two annotators is seen as movement.
  const [shown, setShown] = useState(() => valuesOf(ds));
  const shownRef = useRef(shown);
  shownRef.current = shown;
  useEffect(() => {
    const target = valuesOf(datasets[di]);
    const from = shownRef.current;
    if (from === target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / TWEEN_MS, 1);
      const e = 1 - Math.pow(1 - t, 4);
      setShown(
        t === 1
          ? target
          : Object.fromEntries(
              Object.entries(target).map(([id, pts]) => [
                id,
                pts.map((to, i): Point => {
                  const a = from[id]?.[i];
                  return to && a ? [a[0] + (to[0] - a[0]) * e, a[1] + (to[1] - a[1]) * e] : to;
                }),
              ])
            )
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [di]);

  const width = Math.max(measured, minWidth);
  const top = M.t + (bands ? 22 : 0);
  const plotW = width - M.l - M.r;
  const plotH = HEIGHT - top - M.b;
  const slot = plotW / categories.length;
  const x = (i: number) => M.l + (i + 0.5) * slot;
  const y = (v: number) => top + ((5 - Math.min(Math.max(v, 1), 5)) / 4) * plotH;

  const visible = ds.series.filter((s) => !hidden.includes(s.id));
  const firstEmpty = categories.findIndex((_, i) => ds.series.every((s) => !s.values[i]));
  const dim = (id: string) => focus !== null && focus !== id;

  return (
    <Figure
      title={title}
      caption={[caption, ds.note].filter(Boolean).join(' ')}
      controls={
        datasets.length > 1 ? (
          <Switch
            label="Annotator"
            options={datasets.map((d) => d.label)}
            value={di}
            onChange={(i) => {
              setDi(i);
              setHover(null);
            }}
          />
        ) : null
      }
    >
      <ul className="-mx-2 flex flex-wrap gap-y-0.5" aria-label="Questions: hover to isolate, click to hide">
        {ds.series.map((s) => {
          const off = hidden.includes(s.id);
          return (
            <li key={s.id} className="group relative">
              <button
                type="button"
                aria-pressed={!off}
                onMouseEnter={() => setFocus(off ? null : s.id)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(off ? null : s.id)}
                onBlur={() => setFocus(null)}
                onClick={() => {
                  setFocus(null);
                  setHidden((cur) => (off ? cur.filter((id) => id !== s.id) : [...cur, s.id]));
                }}
                className={clsx(
                  'flex items-center gap-2 rounded px-2 py-1 text-sm transition-opacity duration-150',
                  off ? 'text-muted line-through opacity-60' : 'text-ink-2',
                  dim(s.id) && 'opacity-40'
                )}
              >
                <svg width="24" height="8" aria-hidden>
                  <line x1="0" y1="4" x2="24" y2="4" stroke={tone(s.tone)} strokeWidth="2.5" strokeDasharray={s.dash} />
                </svg>
                {s.label}
              </button>
              {descriptions?.[s.id] ? <Hint>{descriptions[s.id]}</Hint> : null}
            </li>
          );
        })}
      </ul>

      <div ref={ref} className="mt-2 overflow-x-auto overflow-y-hidden">
        <div className="relative" style={{ width }}>
          <svg
            width={width}
            height={HEIGHT}
            viewBox={`0 0 ${width} ${HEIGHT}`}
            className="block"
            role="group"
            aria-label={`${title}. ${ds.label}.`}
          >
            {SCALE.map((label, k) => (
              <g key={label}>
                <line x1={M.l} x2={width - M.r} y1={y(k + 1)} y2={y(k + 1)} stroke="rgb(var(--rule))" />
                <text x={M.l - 12} y={y(k + 1)} textAnchor="end" dominantBaseline="central" fontSize="12" fill="rgb(var(--muted))">
                  {label}
                </text>
              </g>
            ))}

            {(() => {
              if (!bands) return null;
              let start = 0;
              return bands.map((b, k) => {
                const from = M.l + start * slot;
                start += b.span;
                return (
                  <g key={b.label}>
                    {k > 0 ? (
                      <line x1={from} x2={from} y1={top - 16} y2={top + plotH} stroke="rgb(var(--muted))" strokeDasharray="4 4" strokeOpacity={0.6} />
                    ) : null}
                    <text x={from + (b.span * slot) / 2} y={M.t + 4} textAnchor="middle" fontSize="12" fill="rgb(var(--ink-2))">
                      {b.label}
                    </text>
                  </g>
                );
              });
            })()}

            {ds.emptyLabel && firstEmpty > 0 ? (
              <text
                x={(x(firstEmpty) + x(categories.length - 1)) / 2}
                y={top + plotH / 2}
                textAnchor="middle"
                fontSize="12"
                fill="rgb(var(--muted))"
              >
                {ds.emptyLabel}
              </text>
            ) : null}

            {hover !== null ? (
              <line x1={x(hover)} x2={x(hover)} y1={top} y2={top + plotH} stroke="rgb(var(--ink))" strokeOpacity={0.35} />
            ) : null}

            <g className="viz-wipe">
              {visible.map((s) => {
                const pts = (shown[s.id] ?? s.values).flatMap((v, i) => (v ? [{ i, m: v[0], c: v[1] }] : []));
                if (pts.length === 0) return null;
                const line = pts.map((p, k) => `${k ? 'L' : 'M'}${x(p.i)},${y(p.m)}`).join(' ');
                const upper = pts.map((p, k) => `${k ? 'L' : 'M'}${x(p.i)},${y(p.m + p.c)}`).join(' ');
                const lower = [...pts].reverse().map((p) => `L${x(p.i)},${y(p.m - p.c)}`).join(' ');
                const color = tone(s.tone);
                return (
                  <g key={s.id} opacity={dim(s.id) ? 0.12 : 1} style={{ transition: 'opacity 150ms' }}>
                    <path d={`${upper} ${lower} Z`} fill={color} fillOpacity={focus === s.id ? 0.28 : 0.16} />
                    <path
                      d={line}
                      fill="none"
                      stroke={color}
                      strokeWidth={focus === s.id ? 3 : 2.25}
                      strokeDasharray={s.dash}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {pts.map((p) => (
                      <circle
                        key={p.i}
                        cx={x(p.i)}
                        cy={y(p.m)}
                        r={hover === p.i ? 5 : 3.5}
                        fill={color}
                        stroke="rgb(var(--page))"
                        strokeWidth={1}
                      />
                    ))}
                  </g>
                );
              })}
            </g>

            {categories.map((c, i) => (
              <text
                key={c}
                x={x(i)}
                y={HEIGHT - M.b + 20}
                textAnchor="middle"
                fontSize={slot < 40 ? 11 : 12}
                fill={hover === i ? 'rgb(var(--ink))' : 'rgb(var(--muted))'}
                className="tabular"
              >
                {c}
              </text>
            ))}

            {categories.map((c, i) => (
              <rect
                key={c}
                x={x(i) - slot / 2}
                y={top}
                width={slot}
                height={plotH + M.b}
                fill="transparent"
                tabIndex={0}
                role="img"
                aria-label={`${categoryTitles?.[i] ?? c}: ${
                  visible
                    .map((s) => (s.values[i] ? `${s.label} ${s.values[i]![0].toFixed(2)}` : null))
                    .filter(Boolean)
                    .join(', ') || 'not rated'
                }`}
                className="outline-none"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
              />
            ))}
          </svg>

          {hover !== null ? (
            <Tooltip x={(x(hover) / width) * 100} top={top + 4} flip={hover >= categories.length / 2}>
              <p className="mb-1 font-semibold text-ink">{categoryTitles?.[hover] ?? categories[hover]}</p>
              {visible.some((s) => s.values[hover]) ? (
                <ul className="space-y-0.5">
                  {[...visible]
                    .filter((s) => s.values[hover])
                    .sort((a, b) => b.values[hover]![0] - a.values[hover]![0])
                    .map((s) => (
                      <li key={s.id} className="tabular flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5">
                          <span className="inline-block h-2 w-2 rounded-full" style={{ background: tone(s.tone) }} />
                          {s.label}
                        </span>
                        <span>
                          {s.values[hover]![0].toFixed(2)} ± {s.values[hover]![1].toFixed(2)}
                        </span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p>{ds.emptyLabel ?? 'not rated'}</p>
              )}
            </Tooltip>
          ) : null}
        </div>
      </div>
    </Figure>
  );
}
