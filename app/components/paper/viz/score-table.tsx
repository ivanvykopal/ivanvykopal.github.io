'use client';

import { Fragment, useState } from 'react';
import clsx from 'clsx';
import { Figure, Switch, tone } from './figure';

export type ScoreColumn = {
  label: string;
  /** Data colour token from global.css for the in-cell bar, e.g. "q3". */
  tone: string;
  /** Upper end of the bar scale. */
  max: number;
  /** Which end is good; marks the best value per column. Omit for a neutral measure. */
  better?: 'higher' | 'lower';
  hint?: string;
};
/**
 * A way the same method was run, e.g. on translated or on original text. Rows show only the `badge`; the full
 * `label` appears once in the legend and on hover. Hollow variants draw outlined badges and bars.
 */
export type ScoreVariant = { label: string; short: string; badge: string; hollow?: boolean };
export type ScoreRow = {
  label: string;
  /** Small muted tag after the label, e.g. the model size. */
  tag?: string;
  /** Index into `variants`. */
  variant?: number;
  /** One value per column. */
  values: number[];
};
export type ScoreGroup = { label: string; rows: ScoreRow[] };

/** Small pill naming a variant: solid for the default variant, outlined for the hollow one. */
function VariantBadge({ variant }: { variant: ScoreVariant }) {
  return (
    <span
      title={variant.label}
      className={clsx(
        'inline-flex h-[1.125rem] min-w-[2rem] shrink-0 items-center justify-center rounded-full px-1.5 text-[0.625rem] font-semibold leading-none tracking-wide',
        variant.hollow ? 'border border-ink-2/70 text-ink-2' : 'bg-ink-2 text-page'
      )}
    >
      <span aria-hidden>{variant.badge}</span>
      <span className="sr-only">{variant.label}</span>
    </span>
  );
}

/**
 * Results table with a bar beside every score, grouped rows and sortable columns. The best value in each
 * column is set in bold. Rows can carry a variant (e.g. translated or original text): its marker sits in its
 * own column, hollow variants get outlined bars, runs of one method share its name cell, and a switch shows
 * one variant at a time. Sorting flattens the groups into one ranking; choosing the same column again
 * returns to the grouped order.
 */
export function ScoreTable({
  title,
  columns,
  variants,
  groups,
  caption,
}: {
  title: string;
  columns: ScoreColumn[];
  variants?: ScoreVariant[];
  groups: ScoreGroup[];
  caption?: string;
}) {
  const [sortBy, setSortBy] = useState<number | null>(null);
  const [only, setOnly] = useState(0);
  const [hot, setHot] = useState<string | null>(null);
  const all = groups.flatMap((g) => g.rows);
  const best = columns.map((c, k) => {
    if (!c.better) return null;
    const vals = all.map((r) => r.values[k]);
    return c.better === 'higher' ? Math.max(...vals) : Math.min(...vals);
  });
  const keep = (r: ScoreRow) => only === 0 || r.variant === only - 1;
  const shown: ScoreGroup[] = (
    sortBy === null
      ? groups
      : [
          {
            label: `Ranked by ${columns[sortBy].label.toLowerCase()}`,
            rows: [...all].sort((a, b) =>
              columns[sortBy].better === 'lower' ? a.values[sortBy] - b.values[sortBy] : b.values[sortBy] - a.values[sortBy]
            ),
          },
        ]
  )
    .map((g) => ({ ...g, rows: g.rows.filter(keep) }))
    .filter((g) => g.rows.length > 0);
  const key = (r: ScoreRow) => `${r.label}|${r.variant ?? ''}`;
  // In grouped order, neighbouring rows of the same method share one name cell.
  const merge = sortBy === null;

  return (
    <Figure
      title={title}
      caption={caption}
      controls={
        variants?.length ? (
          <Switch label="Text" options={['Both', ...variants.map((v) => v.short)]} value={only} onChange={setOnly} />
        ) : null
      }
    >
      {variants?.length ? (
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2" aria-label="Legend">
          {variants.map((v) => (
            <li key={v.label} className="flex items-center gap-2">
              <VariantBadge variant={v} />
              <span
                aria-hidden
                className="inline-block h-2.5 w-6 rounded-[2px]"
                style={v.hollow ? { boxShadow: 'inset 0 0 0 1.5px rgb(var(--ink-2))' } : { background: 'rgb(var(--ink-2))' }}
              />
              {v.label}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-3 overflow-x-auto">
        <table className="tabular w-full min-w-[44rem] border-collapse text-left text-sm" onMouseLeave={() => setHot(null)}>
          <thead>
            <tr className="border-b border-ink/30 align-bottom">
              <th className="py-2 pr-4 font-normal text-muted">Method</th>
              {variants?.length ? <th className="w-12 py-2 pr-3" aria-label="Text" /> : null}
              {columns.map((c, k) => (
                <th key={c.label} className="w-[20%] py-1 pr-4 font-normal">
                  <button
                    type="button"
                    aria-pressed={sortBy === k}
                    title={c.hint}
                    onClick={() => setSortBy((cur) => (cur === k ? null : k))}
                    className={clsx(
                      'no-print -mx-1 flex items-center gap-1.5 rounded px-1 py-1 text-left transition-colors duration-150',
                      sortBy === k ? 'text-ink' : 'text-muted hover:text-ink'
                    )}
                  >
                    <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: tone(c.tone) }} />
                    {c.label}
                    <span aria-hidden className="text-xs">
                      {sortBy === k ? '↓' : '↕'}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((g) => (
              <Fragment key={g.label}>
                <tr>
                  <th
                    colSpan={columns.length + (variants?.length ? 2 : 1)}
                    className="pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-muted"
                  >
                    {g.label}
                  </th>
                </tr>
                {g.rows.map((r, i) => {
                  const prev = g.rows[i - 1];
                  const next = g.rows[i + 1];
                  const continues = merge && prev?.label === r.label;
                  const span = merge ? g.rows.slice(i).findIndex((o) => o.label !== r.label) : 1;
                  const rowSpan = span === -1 ? g.rows.length - i : Math.max(span, 1);
                  const joined = merge && next?.label === r.label;
                  const variant = r.variant === undefined ? undefined : variants?.[r.variant];
                  const groupHot = hot !== null && hot.split('|')[0] === r.label && merge;
                  return (
                    <tr
                      key={key(r)}
                      onMouseEnter={() => setHot(key(r))}
                      className={clsx(
                        'transition-colors duration-150',
                        joined ? 'border-b border-dashed border-rule/60' : 'border-b border-rule',
                        hot === key(r) ? 'bg-subtle' : undefined
                      )}
                    >
                      {continues ? null : (
                        <td
                          rowSpan={rowSpan}
                          className={clsx('py-1.5 pr-4 align-middle transition-colors duration-150', groupHot && 'bg-subtle')}
                        >
                          <span className="text-ink">{r.label}</span>
                          {r.tag ? (
                            <span className="ml-1.5 rounded border border-rule px-1 py-px text-[0.6875rem] text-muted">{r.tag}</span>
                          ) : null}
                        </td>
                      )}
                      {variants?.length ? (
                        <td className="py-1.5 pr-3">{variant ? <VariantBadge variant={variant} /> : null}</td>
                      ) : null}
                      {columns.map((c, k) => {
                        const v = r.values[k];
                        const isBest = best[k] === v;
                        const color = tone(c.tone, isBest ? 1 : 0.75);
                        return (
                          <td key={c.label} className="py-1.5 pr-4">
                            <span className="flex items-center gap-2">
                              <span className={clsx('w-9 shrink-0 text-right', isBest ? 'font-semibold text-ink' : 'text-ink-2')}>
                                {v.toFixed(2)}
                              </span>
                              <span aria-hidden className="relative h-2.5 flex-1 rounded-[2px] bg-rule/40">
                                <span
                                  className="absolute inset-y-0 left-0 rounded-[2px] transition-[width] duration-300"
                                  style={{
                                    width: `${Math.min(v / c.max, 1) * 100}%`,
                                    ...(variant?.hollow
                                      ? { boxShadow: `inset 0 0 0 1.5px ${color}`, background: tone(c.tone, 0.12) }
                                      : { background: color }),
                                  }}
                                />
                              </span>
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Figure>
  );
}
