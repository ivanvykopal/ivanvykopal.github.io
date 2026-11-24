'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { delay, Figure, Tooltip, tone, useWidth } from './figure';

export type BubbleAxis = { label: string; domain: [number, number]; ticks: number[] };
export type BubblePoint = {
  id: string;
  label: string;
  /** Data colour token from global.css, e.g. "q3". */
  tone: string;
  x: number;
  y: number;
  /** Drives the bubble area; lower is better in the paper's use. */
  size: number;
  /** Drives the thickness of the red ring around the bubble. */
  ring: number;
};
/** Shaded corner of the plot that marks the good region. */
export type BubbleTarget = { x: number; y: number; label: string };

const M = { l: 56, r: 16, t: 12, b: 46 };
const HEIGHT = 400;
const radius = (size: number) => 8 + 7 * size;
const ringWidth = (ring: number) => 1.25 + 3.5 * ring;

/**
 * Two measures on the axes, a third as bubble size and a fourth as the thickness of a red ring: here source
 * credibility against credible groundedness, with the non-credible rates as size and ring. Hovering a bubble
 * reads out its four values; hovering a legend entry isolates that bubble.
 */
export function Bubble({
  title,
  x,
  y,
  points,
  sizeLabel,
  ringLabel,
  target,
  caption,
}: {
  title: string;
  x: BubbleAxis;
  y: BubbleAxis;
  points: BubblePoint[];
  sizeLabel: string;
  ringLabel: string;
  target?: BubbleTarget;
  caption?: string;
}) {
  const [ref, measured] = useWidth<HTMLDivElement>(700);
  const [hot, setHot] = useState<string | null>(null);
  const width = Math.max(measured, 360);
  const plotW = width - M.l - M.r;
  const plotH = HEIGHT - M.t - M.b;
  const sx = (v: number) => M.l + ((v - x.domain[0]) / (x.domain[1] - x.domain[0])) * plotW;
  const sy = (v: number) => M.t + (1 - (v - y.domain[0]) / (y.domain[1] - y.domain[0])) * plotH;
  const hotPoint = points.find((p) => p.id === hot);

  const sizes = points.map((p) => p.size);
  const rings = points.map((p) => p.ring);
  const key = (values: number[], names: string[]) =>
    [Math.min(...values), Math.max(...values)].map((v) => ({ v, name: names[values.indexOf(v)] }));
  const names = points.map((p) => p.label);
  const sizeKey = key(sizes, names);
  const ringKey = key(rings, names);

  return (
    <Figure title={title} caption={caption}>
      <div ref={ref} className="overflow-x-auto overflow-y-hidden">
        <div className="relative" style={{ width }}>
          <svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} className="block" role="group" aria-label={title}>
            {target ? (
              <rect
                x={sx(target.x)}
                y={M.t}
                width={M.l + plotW - sx(target.x)}
                height={sy(target.y) - M.t}
                fill={tone('safe', 0.1)}
              />
            ) : null}
            {y.ticks.map((t) => (
              <g key={`y${t}`}>
                <line x1={M.l} x2={width - M.r} y1={sy(t)} y2={sy(t)} stroke="rgb(var(--rule))" />
                <text x={M.l - 8} y={sy(t)} textAnchor="end" dominantBaseline="central" fontSize="12" fill="rgb(var(--muted))" className="tabular">
                  {t}
                </text>
              </g>
            ))}
            {x.ticks.map((t) => (
              <g key={`x${t}`}>
                <line x1={sx(t)} x2={sx(t)} y1={M.t} y2={M.t + plotH} stroke="rgb(var(--rule))" strokeOpacity={0.6} />
                <text x={sx(t)} y={M.t + plotH + 18} textAnchor="middle" fontSize="12" fill="rgb(var(--muted))" className="tabular">
                  {t}
                </text>
              </g>
            ))}
            {target ? (
              <text x={width - M.r - 8} y={M.t + 16} textAnchor="end" fontSize="12" fill={tone('safe')}>
                {target.label}
              </text>
            ) : null}
            <text x={M.l + plotW / 2} y={HEIGHT - 6} textAnchor="middle" fontSize="12" fill="rgb(var(--ink-2))">
              {x.label}
            </text>
            <text transform={`translate(13 ${M.t + plotH / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="rgb(var(--ink-2))">
              {y.label}
            </text>

            {points.map((p, i) => {
              const r = radius(p.size);
              const w = ringWidth(p.ring);
              return (
                <g
                  key={p.id}
                  transform={`translate(${sx(p.x)} ${sy(p.y)})`}
                  className={clsx('transition-opacity duration-150', hot !== null && hot !== p.id && 'opacity-25 grayscale')}
                >
                  <g className="viz-pop" style={delay(i * 80)}>
                    <circle r={r} fill={tone(p.tone, 0.9)} stroke={tone('danger')} strokeWidth={w} paintOrder="stroke" />
                    <circle r={r + w / 2} fill="none" stroke="rgb(var(--page))" strokeWidth={1} />
                    <text x={r + w + 6} y={0} dominantBaseline="central" fontSize="13" fontWeight={600} fill="rgb(var(--ink))">
                      {p.label}
                    </text>
                    <circle
                      r={r + w + 4}
                      fill="transparent"
                      tabIndex={0}
                      role="img"
                      aria-label={`${p.label}: ${x.label} ${p.x}, ${y.label} ${p.y}, ${sizeLabel} ${p.size}, ${ringLabel} ${p.ring}`}
                      className="outline-none"
                      onMouseEnter={() => setHot(p.id)}
                      onMouseLeave={() => setHot(null)}
                      onFocus={() => setHot(p.id)}
                      onBlur={() => setHot(null)}
                    />
                  </g>
                </g>
              );
            })}
          </svg>

          {hotPoint ? (
            <Tooltip x={(sx(hotPoint.x) / width) * 100} top={Math.max(sy(hotPoint.y) - 40, 0)} flip={sx(hotPoint.x) > width * 0.6}>
              <p className="mb-1 font-semibold text-ink">{hotPoint.label}</p>
              <p className="tabular">
                {x.label}: {hotPoint.x.toFixed(2)}
              </p>
              <p className="tabular">
                {y.label}: {hotPoint.y.toFixed(2)}
              </p>
              <p className="tabular">
                {sizeLabel}: {hotPoint.size.toFixed(2)}
              </p>
              <p className="tabular">
                {ringLabel}: {hotPoint.ring.toFixed(2)}
              </p>
            </Tooltip>
          ) : null}
        </div>
      </div>

      <div className="mt-3 grid gap-x-8 gap-y-3 text-sm text-ink-2 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-muted">Bubble size: {sizeLabel}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {sizeKey.map(({ v, name }) => (
              <li key={name} className="flex items-center gap-2">
                <svg width="52" height="52" aria-hidden className="shrink-0">
                  <circle cx="26" cy="26" r={radius(v)} fill="rgb(var(--muted) / 0.6)" />
                </svg>
                <span className="tabular">
                  {v.toFixed(2)}% ({name})
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1 text-muted">Ring thickness: {ringLabel}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {ringKey.map(({ v, name }) => (
              <li key={name} className="flex items-center gap-2">
                <svg width="52" height="52" aria-hidden className="shrink-0">
                  <circle cx="26" cy="26" r={14} fill="none" stroke={tone('danger')} strokeWidth={ringWidth(v)} />
                </svg>
                <span className="tabular">
                  {v.toFixed(2)}% ({name})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Figure>
  );
}
