'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { delay, Figure, Switch } from './figure';
import { Swatch, TONE_FILL, type StackedSegment } from './stacked-bars';

export type ShareItem = { id: string; label: string; values: number[] };
export type ShareGroup = { label: string; items: ShareItem[] };

/**
 * A list of named items in groups, each with a stacked bar of how its total splits into classes: here the 20
 * narratives with the dangerous, neutral and safe articles written about each. A switch re-sorts the whole
 * list by one class, which turns the reference list into a ranking.
 */
export function ShareTable({
  title,
  groups,
  segments,
  rankBy,
  rankLabel,
  caption,
}: {
  title: string;
  groups: ShareGroup[];
  segments: StackedSegment[];
  /** Index of the segment the ranked view sorts by, largest first. */
  rankBy: number;
  rankLabel: string;
  caption?: string;
}) {
  const [ranked, setRanked] = useState(false);
  const shown: ShareGroup[] = ranked
    ? [
        {
          label: '',
          items: groups
            .flatMap((g) => g.items.map((item) => ({ ...item, group: g.label })))
            .sort((a, b) => b.values[rankBy] - a.values[rankBy]),
        },
      ]
    : groups;
  let index = 0;

  return (
    <Figure
      title={title}
      caption={caption}
      controls={
        <Switch label="Order" options={['By category', rankLabel]} value={ranked ? 1 : 0} onChange={(i) => setRanked(i === 1)} />
      }
    >
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2" aria-label="Legend">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <Swatch tone={s.tone} />
            {s.label}
          </li>
        ))}
      </ul>

      {/* Remounting on reorder replays the wipe. */}
      <div key={ranked ? 'ranked' : 'grouped'} className="mt-3 [&:has(li:hover)_li:not(:hover)]:opacity-45">
        {shown.map((group) => (
          <div key={group.label} className="mt-5 first:mt-0">
            {group.label ? <p className="border-b border-rule pb-1.5 text-sm font-semibold text-ink">{group.label}</p> : null}
            <ul>
              {group.items.map((item) => {
                const total = item.values.reduce((a, b) => a + b, 0);
                const i = index++;
                return (
                  <li
                    key={item.id}
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1 border-b border-rule/60 py-2 text-sm transition-opacity duration-150 sm:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,24rem)]"
                  >
                    <span className="tabular text-muted">{item.id}</span>
                    <span className="text-ink-2">
                      {item.label}
                      {'group' in item ? <span className="ml-2 whitespace-nowrap text-muted">{String(item.group)}</span> : null}
                    </span>
                    <span
                      role="img"
                      aria-label={item.values.map((v, k) => `${v} ${segments[k].label.toLowerCase()}`).join(', ')}
                      className="viz-wipe col-start-2 flex h-6 overflow-hidden rounded-[2px] sm:col-start-3"
                      style={delay(Math.min(i * 30, 600))}
                    >
                      {item.values.map((v, k) =>
                        v > 0 ? (
                          <span
                            key={k}
                            className={clsx(
                              'viz-seg tabular flex h-full items-center justify-center overflow-hidden text-xs font-semibold',
                              TONE_FILL[segments[k].tone]
                            )}
                            style={{ width: `${(v / total) * 100}%` }}
                          >
                            <span>{v}</span>
                          </span>
                        ) : null
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Figure>
  );
}
