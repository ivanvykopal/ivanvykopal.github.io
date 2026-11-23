'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { delay, Figure, Switch, Tooltip, tone, useWidth } from './figure';

export type ScatterFamily = {
  label: string;
  /** Data colour token from global.css, e.g. "q3". */
  tone: string;
  /** Drawn as a ring instead of a filled dot. */
  hollow?: boolean;
};
export type ScatterAxis = { label: string; domain: [number, number]; ticks: number[] };
export type ScatterPoint = {
  /** Stable across views, so a point slides to its new position when the view changes. */
  id: string;
  label: string;
  /** Index into `families`. */
  family: number;
  x: number;
  y: number;
  /** Short name printed next to the point; omit to leave the point unlabelled. */
  named?: string;
};
export type ScatterView = { label: string; x: ScatterAxis; y: ScatterAxis; points: ScatterPoint[]; note?: string };

const M = { l: 52, r: 16, t: 12, b: 44 };
const HEIGHT = 360;

/**
 * One dot per method on two measures. Hovering a dot reads out its values; hovering a legend entry isolates
 * that family. With several views (different measures) the dots slide to their new places and points missing
 * from a view fade out.
 */
export function Scatter({
  title,
  families,
  views,
  switchLabel = 'View',
  caption,
}: {
  title: string;
  families: ScatterFamily[];
  views: ScatterView[];
  switchLabel?: string;
  caption?: string;
}) {
  const [ref, measured] = useWidth<HTMLDivElement>(700);
  const [vi, setVi] = useState(0);
  const [hot, setHot] = useState<string | null>(null);
  const [hotFamily, setHotFamily] = useState<number | null>(null);
  const view = views[vi];
  const width = Math.max(measured, 360);
  const plotW = width - M.l - M.r;
  const plotH = HEIGHT - M.t - M.b;
  const sx = (v: number) => M.l + ((v - view.x.domain[0]) / (view.x.domain[1] - view.x.domain[0])) * plotW;
  const sy = (v: number) => M.t + (1 - (v - view.y.domain[0]) / (view.y.domain[1] - view.y.domain[0])) * plotH;

  // Every point of every view stays mounted, so its transform can transition between views.
  const all = new Map<string, ScatterPoint>();
  for (const v of views) for (const p of v.points) if (!all.has(p.id)) all.set(p.id, p);
  const current = new Map(view.points.map((p) => [p.id, p]));
  const hotPoint = hot ? current.get(hot) : undefined;
  const decimals = (axis: ScatterAxis) => (axis.domain[1] - axis.domain[0] < 1 ? 2 : 0);

  return (
    <Figure
      title={title}
      caption={[caption, view.note].filter(Boolean).join(' ')}
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
      <ul className="-mx-2 flex flex-wrap gap-x-1 gap-y-0.5 text-sm text-ink-2" aria-label="Legend" onMouseLeave={() => setHotFamily(null)}>
        {families.map((f, k) => (
          <li
            key={f.label}
            onMouseEnter={() => setHotFamily(k)}
            className={clsx(
              'flex cursor-default items-center gap-2 rounded px-2 py-0.5 transition-opacity duration-150',
              hotFamily !== null && hotFamily !== k && 'opacity-40'
            )}
          >
            <svg width="10" height="10" aria-hidden className="shrink-0">
              <circle cx="5" cy="5" r={f.hollow ? 3.75 : 5} fill={f.hollow ? 'none' : tone(f.tone)} stroke={tone(f.tone)} strokeWidth={f.hollow ? 2 : 0} />
            </svg>
            {f.label}
          </li>
        ))}
      </ul>

      <div ref={ref} className="mt-2 overflow-x-auto overflow-y-hidden">
        <div className="relative" style={{ width }}>
          <svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} className="block" role="group" aria-label={`${title}. ${view.label}.`}>
            {view.y.ticks.map((t) => (
              <g key={`y${t}`}>
                <line x1={M.l} x2={width - M.r} y1={sy(t)} y2={sy(t)} stroke="rgb(var(--rule))" />
                <text x={M.l - 8} y={sy(t)} textAnchor="end" dominantBaseline="central" fontSize="12" fill="rgb(var(--muted))" className="tabular">
                  {t}
                </text>
              </g>
            ))}
            {view.x.ticks.map((t) => (
              <g key={`x${t}`}>
                <line x1={sx(t)} x2={sx(t)} y1={M.t} y2={M.t + plotH} stroke="rgb(var(--rule))" strokeOpacity={0.6} />
                <text x={sx(t)} y={M.t + plotH + 18} textAnchor="middle" fontSize="12" fill="rgb(var(--muted))" className="tabular">
                  {t}
                </text>
              </g>
            ))}
            <text x={M.l + plotW / 2} y={HEIGHT - 6} textAnchor="middle" fontSize="12" fill="rgb(var(--ink-2))">
              {view.x.label}
            </text>
            <text
              transform={`translate(13 ${M.t + plotH / 2}) rotate(-90)`}
              textAnchor="middle"
              fontSize="12"
              fill="rgb(var(--ink-2))"
            >
              {view.y.label}
            </text>

            {[...all.values()].map((base, i) => {
              const p = current.get(base.id);
              const f = families[base.family];
              const shown = p ?? base;
              const dim = (hotFamily !== null && hotFamily !== base.family) || (hot !== null && hot !== base.id);
              const color = tone(f.tone);
              return (
                <g
                  key={base.id}
                  className="transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none"
                  style={{
                    transform: `translate(${sx(shown.x)}px, ${sy(shown.y)}px)`,
                    opacity: p ? (dim ? 0.2 : 1) : 0,
                    pointerEvents: p ? undefined : 'none',
                  }}
                >
                  <g className="viz-pop" style={delay(i * 30)}>
                    <circle
                      r={hot === base.id ? 7 : 5.5}
                      fill={f.hollow ? 'rgb(var(--page))' : color}
                      stroke={f.hollow ? color : 'rgb(var(--page))'}
                      strokeWidth={f.hollow ? 2 : 1}
                    />
                    {p?.named ? (
                      <text x={9} y={-8} fontSize="12" fill="rgb(var(--ink-2))">
                        {p.named}
                      </text>
                    ) : null}
                    <circle
                      r={11}
                      fill="transparent"
                      tabIndex={p ? 0 : -1}
                      role="img"
                      aria-label={p ? `${p.label}: ${view.x.label} ${p.x}, ${view.y.label} ${p.y}` : undefined}
                      className="outline-none"
                      onMouseEnter={() => setHot(base.id)}
                      onMouseLeave={() => setHot(null)}
                      onFocus={() => setHot(base.id)}
                      onBlur={() => setHot(null)}
                    />
                  </g>
                </g>
              );
            })}
          </svg>

          {hotPoint ? (
            <Tooltip
              x={(sx(hotPoint.x) / width) * 100}
              top={Math.max(sy(hotPoint.y) - 30, 0)}
              flip={sx(hotPoint.x) > width * 0.6}
            >
              <p className="mb-1 font-semibold text-ink">{hotPoint.label}</p>
              <p className="text-muted">{families[hotPoint.family].label}</p>
              <p className="tabular mt-1">
                {view.x.label}: {hotPoint.x.toFixed(decimals(view.x))}
              </p>
              <p className="tabular">
                {view.y.label}: {hotPoint.y.toFixed(decimals(view.y))}
              </p>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </Figure>
  );
}
