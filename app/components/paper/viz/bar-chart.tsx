'use client';

import clsx from 'clsx';
import { delay, Figure } from './figure';

export type BarItem = { label: string; value: number; highlight?: boolean };
export type BarTone = 'series' | 'danger';

const FILL: Record<BarTone, { strong: string; soft: string }> = {
  series: { strong: 'viz-fill-series', soft: 'viz-fill-series-soft' },
  danger: { strong: 'viz-fill-danger', soft: 'viz-fill-danger-soft' },
};

/**
 * Horizontal bars with the value at the end of each bar. Highlighted items are drawn solid and the rest
 * lighter; `legend` names the two groups. Bars wipe in from the left on first view.
 */
export function BarChart({
  title,
  items,
  max,
  unit = '',
  tone = 'series',
  legend,
  caption,
}: {
  title: string;
  items: BarItem[];
  max?: number;
  unit?: string;
  tone?: BarTone;
  /** Names for [highlighted, other] items. */
  legend?: [string, string];
  caption?: string;
}) {
  const top = max ?? Math.max(...items.map((i) => i.value));
  // Same number of decimals on every value, so 0.4 reads as 0.40 beside 0.36.
  const decimals = Math.max(...items.map((i) => `${i.value}`.split('.')[1]?.length ?? 0));
  const anyHighlight = items.some((i) => i.highlight);
  const fill = (item: BarItem) => (!anyHighlight || item.highlight ? FILL[tone].strong : FILL[tone].soft);

  return (
    <Figure title={title} caption={caption}>
      {legend ? (
        <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2" aria-label="Legend">
          {legend.map((label, k) => (
            <li key={label} className="flex items-center gap-2">
              <span aria-hidden className={clsx('inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]', k === 0 ? FILL[tone].strong : FILL[tone].soft)} />
              {label}
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="space-y-1.5 [&:has(li:hover)>li:not(:hover)]:opacity-45">
        {items.map((item, i) => (
          <li
            key={item.label}
            className="grid grid-cols-[9.75rem_1fr] items-center gap-3 text-sm transition-opacity duration-150 sm:grid-cols-[12rem_1fr]"
          >
            <span className="truncate text-right text-ink-2">{item.label}</span>
            <span className="flex items-center gap-2 border-l border-muted/60 pr-12">
              <span
                className={clsx('viz-wipe h-5 shrink-0 rounded-r-[2px]', fill(item))}
                style={{ width: `${Math.min((item.value / top) * 100, 100)}%`, minWidth: 2, ...delay(i * 45) }}
              />
              <span className="viz-in tabular text-ink-2" style={delay(i * 45 + 350)}>
                {item.value.toFixed(decimals)}
                {unit}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
