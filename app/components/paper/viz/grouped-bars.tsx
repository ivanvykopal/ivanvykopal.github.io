'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { DIMMED, delay, Figure, LEGEND_LIST, useIsolate, Tooltip, tone, useWidth } from './figure';

export type GroupedSeries = {
  label: string;
  /** Data colour token from global.css, e.g. "q3". */
  tone: string;
  /** Drawn in a pale tint of the tone, as the paper does for the series it does not single out. */
  soft?: boolean;
  /** One [mean, 95% confidence half-width] per category; a half-width of 0 draws no whisker. */
  values: [number, number][];
};

/** Value axis: its range, the gridlines with their labels, and how many decimals the bar labels show. */
export type GroupedScale = {
  min: number;
  max: number;
  ticks: { value: number; label: string }[];
  decimals: number;
  /** Room left of the plot for the tick labels, in pixels. */
  labelWidth: number;
};

const LIKERT: GroupedScale = {
  min: 1,
  max: 5,
  ticks: ['Does not apply', 'Few parts', 'Some parts', 'Most parts', 'Completely applies'].map((label, k) => ({
    value: k + 1,
    label,
  })),
  decimals: 2,
  labelWidth: 122,
};
const M = { r: 8, t: 22, b: 46 };
const HEIGHT = 330;

/**
 * Vertical bars side by side per category, each with its value and an optional confidence whisker: the layout
 * of Figure 3 in both the disinformation and the soft language prompts paper. The scale defaults to the 1 to 5
 * answer scale. Bars rise from the baseline on first view; hovering a category lists its exact values.
 */
export function GroupedBars({
  title,
  categories,
  categoryDescriptions,
  series,
  scale = LIKERT,
  caption,
}: {
  title: string;
  categories: string[];
  /** Full wording behind each category label, shown when the label or its bars are hovered. */
  categoryDescriptions?: string[];
  series: GroupedSeries[];
  scale?: GroupedScale;
  caption?: string;
}) {
  const [ref, measured] = useWidth<HTMLDivElement>(856);
  const [hover, setHover] = useState<number | null>(null);
  const iso = useIsolate();
  const width = Math.max(measured, 600);
  const left = scale.labelWidth;
  const plotW = width - left - M.r;
  const plotH = HEIGHT - M.t - M.b;
  const slot = plotW / categories.length;
  const barW = Math.min(44, (slot * 0.72) / series.length);
  const y = (v: number) => M.t + ((scale.max - Math.max(v, scale.min)) / (scale.max - scale.min)) * plotH;
  const base = y(scale.min);
  const exact = (mean: number, ci: number) => (ci ? `${mean.toFixed(2)} ± ${ci.toFixed(2)}` : mean.toFixed(2));
  /** With some series softened, the labels of the others are set in ink and bold, like the paper's Figure 3. */
  const strong = (s: GroupedSeries) => series.some((o) => o.soft) && !s.soft;

  return (
    <Figure title={title} caption={caption}>
      <ul className={LEGEND_LIST} aria-label="Legend">
        {series.map((s, k) => (
          <li key={s.label} {...iso.legend(k)}>
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ background: tone(s.tone, s.soft ? 0.45 : 1) }}
            />
            {s.label}
          </li>
        ))}
      </ul>
      <div ref={ref} className="mt-2 overflow-x-auto overflow-y-hidden">
        <div className="relative" style={{ width }}>
          <svg
            width={width}
            height={HEIGHT}
            viewBox={`0 0 ${width} ${HEIGHT}`}
            className="block"
            role="img"
            aria-label={`${title}. ${categories
              .map((c, i) => `${c}: ${series.map((s) => `${s.label} ${s.values[i][0].toFixed(2)}`).join(', ')}`)
              .join('; ')}.`}
          >
            {scale.ticks.map((t) => (
              <g key={t.value}>
                <line x1={left} x2={width - M.r} y1={y(t.value)} y2={y(t.value)} stroke="rgb(var(--rule))" />
                <text x={left - 12} y={y(t.value)} textAnchor="end" dominantBaseline="central" fontSize="12" fill="rgb(var(--muted))">
                  {t.label}
                </text>
              </g>
            ))}

            {categories.map((c, i) => {
              const cx = left + (i + 0.5) * slot;
              const [id, ...rest] = c.split(' ');
              const dim = hover !== null && hover !== i;
              return (
                <g key={c} className="transition-opacity duration-150" opacity={dim ? 0.4 : 1}>
                  {series.map((s, k) => {
                    const [mean, ci] = s.values[i];
                    const bx = cx + (k - series.length / 2) * barW + 1.5;
                    const mid = bx + (barW - 3) / 2;
                    const wait = i * 70 + k * 35;
                    return (
                      <g key={s.label} className={clsx('transition-[opacity,filter] duration-150', iso.dim(k) && DIMMED)}>
                        <rect
                          className="viz-rise"
                          style={delay(wait)}
                          x={bx}
                          y={y(mean)}
                          width={barW - 3}
                          height={base - y(mean)}
                          rx={1.5}
                          fill={tone(s.tone, s.soft ? 0.45 : 1)}
                        />
                        <g className="viz-in" style={delay(wait + 450)}>
                          {ci ? (
                            <path
                              d={`M${mid},${y(mean + ci)}V${y(mean - ci)}M${mid - 4},${y(mean + ci)}h8M${mid - 4},${y(mean - ci)}h8`}
                              stroke="rgb(var(--ink))"
                              strokeWidth={1.25}
                              fill="none"
                            />
                          ) : null}
                          <text
                            x={mid}
                            y={y(mean + ci) - 6}
                            textAnchor="middle"
                            fontSize={scale.decimals ? 12 : 11}
                            fontWeight={strong(s) ? 600 : undefined}
                            fill={strong(s) ? 'rgb(var(--ink))' : 'rgb(var(--ink-2))'}
                            className="tabular"
                          >
                            {mean.toFixed(scale.decimals)}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                  <text x={cx} y={base + 18} textAnchor="middle" fontSize="12" fill={hover === i ? 'rgb(var(--ink))' : 'rgb(var(--ink-2))'}>
                    {id}
                  </text>
                  <text x={cx} y={base + 34} textAnchor="middle" fontSize="12" fill={hover === i ? 'rgb(var(--ink))' : 'rgb(var(--muted))'}>
                    {rest.join(' ')}
                  </text>
                  <rect
                    x={cx - slot / 2}
                    y={M.t}
                    width={slot}
                    height={HEIGHT - M.t}
                    fill="transparent"
                    tabIndex={0}
                    role="img"
                    aria-label={`${c}: ${categoryDescriptions?.[i] ? `${categoryDescriptions[i]}. ` : ''}${series
                      .map((s) => `${s.label} ${exact(...s.values[i])}`)
                      .join(', ')}`}
                    className="outline-none"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                  />
                </g>
              );
            })}
            <line x1={left} x2={width - M.r} y1={base} y2={base} stroke="rgb(var(--muted))" />
          </svg>
          {hover !== null ? (
            <Tooltip x={((left + (hover + 0.5) * slot) / width) * 100} bottom={M.b + 6} flip={hover >= categories.length / 2} wide>
              <p className="mb-1 font-semibold text-ink">{categories[hover]}</p>
              {categoryDescriptions?.[hover] ? <p className="mb-1.5">{categoryDescriptions[hover]}</p> : null}
              <ul className="space-y-0.5">
                {series.map((s) => (
                  <li key={s.label} className="tabular flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <span aria-hidden className="inline-block h-2 w-2 rounded-[2px]" style={{ background: tone(s.tone, s.soft ? 0.45 : 1) }} />
                      {s.label}
                    </span>
                    <span className="whitespace-nowrap">{exact(...s.values[hover])}</span>
                  </li>
                ))}
              </ul>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </Figure>
  );
}
