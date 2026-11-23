'use client';

import { delay, Figure, tone, useWidth } from './figure';

export type GroupedSeries = {
  label: string;
  /** Data colour token from global.css, e.g. "q3". */
  tone: string;
  /** One [mean, 95% confidence half-width] per category. */
  values: [number, number][];
};

const SCALE = ['Does not apply', 'Few parts', 'Some parts', 'Most parts', 'Completely applies'];
const M = { l: 122, r: 8, t: 22, b: 46 };
const HEIGHT = 330;

/**
 * Vertical bars side by side per category, each with its value and a confidence whisker, on the 1 to 5
 * answer scale: the layout of Figure 3 in the paper. Bars rise from the baseline on first view.
 */
export function GroupedBars({
  title,
  categories,
  series,
  caption,
}: {
  title: string;
  categories: string[];
  series: GroupedSeries[];
  caption?: string;
}) {
  const [ref, measured] = useWidth<HTMLDivElement>(856);
  const width = Math.max(measured, 600);
  const plotW = width - M.l - M.r;
  const plotH = HEIGHT - M.t - M.b;
  const slot = plotW / categories.length;
  const barW = Math.min(44, (slot * 0.72) / series.length);
  const y = (v: number) => M.t + ((5 - v) / 4) * plotH;
  const base = y(1);

  return (
    <Figure title={title} caption={caption}>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2" aria-label="Legend">
        {series.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: tone(s.tone) }} />
            {s.label}
          </li>
        ))}
      </ul>
      <div ref={ref} className="mt-2 overflow-x-auto">
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
          {SCALE.map((label, k) => (
            <g key={label}>
              <line x1={M.l} x2={width - M.r} y1={y(k + 1)} y2={y(k + 1)} stroke="rgb(var(--rule))" />
              <text x={M.l - 12} y={y(k + 1)} textAnchor="end" dominantBaseline="central" fontSize="12" fill="rgb(var(--muted))">
                {label}
              </text>
            </g>
          ))}

          {categories.map((c, i) => {
            const cx = M.l + (i + 0.5) * slot;
            const [id, ...rest] = c.split(' ');
            return (
              <g key={c}>
                {series.map((s, k) => {
                  const [mean, ci] = s.values[i];
                  const bx = cx + (k - series.length / 2) * barW + 1.5;
                  const mid = bx + (barW - 3) / 2;
                  const wait = i * 70 + k * 35;
                  return (
                    <g key={s.label}>
                      <rect
                        className="viz-rise"
                        style={delay(wait)}
                        x={bx}
                        y={y(mean)}
                        width={barW - 3}
                        height={base - y(mean)}
                        rx={1.5}
                        fill={tone(s.tone)}
                      />
                      <g className="viz-in" style={delay(wait + 450)}>
                        <path
                          d={`M${mid},${y(mean + ci)}V${y(mean - ci)}M${mid - 4},${y(mean + ci)}h8M${mid - 4},${y(mean - ci)}h8`}
                          stroke="rgb(var(--ink))"
                          strokeWidth={1.25}
                          fill="none"
                        />
                        <text
                          x={mid}
                          y={y(mean + ci) - 6}
                          textAnchor="middle"
                          fontSize="12"
                          fill="rgb(var(--ink-2))"
                          className="tabular"
                        >
                          {mean.toFixed(2)}
                        </text>
                      </g>
                    </g>
                  );
                })}
                <text x={cx} y={base + 18} textAnchor="middle" fontSize="12" fill="rgb(var(--ink-2))">
                  {id}
                </text>
                <text x={cx} y={base + 34} textAnchor="middle" fontSize="12" fill="rgb(var(--muted))">
                  {rest.join(' ')}
                </text>
              </g>
            );
          })}
          <line x1={M.l} x2={width - M.r} y1={base} y2={base} stroke="rgb(var(--muted))" />
        </svg>
      </div>
    </Figure>
  );
}
