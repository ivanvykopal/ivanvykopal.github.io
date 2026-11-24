'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { DIMMED, delay, Figure, LEGEND_LIST, tone, useIsolate } from './figure';

export type CompositionSegment = { label: string; /** Data colour token from global.css, e.g. "q3". */ tone: string };
export type CompositionRow = { label: string; /** Share of each segment in percent, in the order of the segments. */ values: number[] };

/** Segments narrower than this share carry no number inside, as in the paper's own figure. */
const LABEL_MIN = 4;

/**
 * Full-width bars split into classes, one bar per titled row, each segment labelled with its share in percent:
 * the layout of Figure 2 in the paper. Hovering a legend entry or a segment isolates that class in every bar,
 * clicking a legend entry keeps it isolated.
 */
export function CompositionBars({
  title,
  segments,
  rows,
  caption,
}: {
  title: string;
  segments: CompositionSegment[];
  rows: CompositionRow[];
  caption?: string;
}) {
  const iso = useIsolate();
  const [hot, setHot] = useState<{ row: number; seg: number } | null>(null);
  const hotRow = hot ? rows[hot.row] : null;

  return (
    <Figure title={title} caption={caption}>
      <ul className={LEGEND_LIST} aria-label="Legend">
        {segments.map((s, k) => (
          <li key={s.label} {...iso.legend(k)}>
            <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: tone(s.tone) }} />
            {s.label}
          </li>
        ))}
      </ul>
      <p className="tabular mt-1.5 h-5 text-sm text-muted" aria-hidden>
        {hotRow && hot ? (
          <>
            <span className="font-semibold text-ink">{hotRow.label}</span>: {hotRow.values[hot.seg].toFixed(1)}% {segments[hot.seg].label}
          </>
        ) : (
          'Hover a segment for its share.'
        )}
      </p>

      <ul className="mt-3 space-y-3" onMouseLeave={() => setHot(null)}>
        {rows.map((row, i) => (
          <li key={row.label}>
            <p className="mb-1 text-center text-sm font-semibold text-ink">{row.label}</p>
            <div
              role="img"
              aria-label={`${row.label}: ${row.values.map((v, k) => `${segments[k].label} ${v.toFixed(1)}%`).join(', ')}`}
              className="viz-wipe flex h-8 overflow-hidden rounded-[2px]"
              style={delay(i * 70)}
            >
              {row.values.map((v, k) => (
                <span
                  key={segments[k].label}
                  onMouseEnter={() => {
                    setHot({ row: i, seg: k });
                    iso.setOver(k);
                  }}
                  onMouseLeave={() => iso.setOver(null)}
                  className={clsx(
                    'viz-seg tabular flex h-full items-center justify-center overflow-hidden text-xs font-semibold text-white transition-[opacity,filter] duration-150',
                    iso.dim(k) && DIMMED,
                    hot?.row === i && hot.seg === k && 'shadow-[inset_0_0_0_2px_rgb(var(--ink))]'
                  )}
                  style={{ width: `${v}%`, background: tone(segments[k].tone) }}
                >
                  {v >= LABEL_MIN ? `${v.toFixed(1)}%` : null}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
