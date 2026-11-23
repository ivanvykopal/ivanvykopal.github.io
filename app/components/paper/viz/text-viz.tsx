'use client';

import { useState } from 'react';
import { Figure, Switch } from './figure';

export type PromptTab = { label: string; text: string };

/**
 * Switchable prompt viewer. Bracketed [PLACEHOLDERS] are set apart, and a part wrapped in {+ +} is marked
 * as the text this variant adds.
 */
export function PromptTabs({ title, tabs }: { title: string; tabs: PromptTab[] }) {
  const [i, setI] = useState(0);
  return (
    <Figure
      title={title}
      controls={<Switch label="Prompt" options={tabs.map((t) => t.label)} value={i} onChange={setI} />}
    >
      <p key={i} className="max-w-[44rem] border-l border-rule pl-4 leading-relaxed text-ink">
        {tabs[i].text.split(/(\{\+.*?\+\})/).map((part, k) => {
          const added = /^\{\+.*\+\}$/.test(part);
          const body = (added ? part.slice(2, -2) : part).split(/(\[[A-Z ]+\])/).map((piece, n) =>
            /^\[[A-Z ]+\]$/.test(piece) ? (
              <span key={n} className="tabular text-[0.875em] text-muted">
                {piece}
              </span>
            ) : (
              piece
            )
          );
          return added ? (
            <ins
              key={k}
              className="animate-[viz-in_500ms_ease-out_both] bg-viz-neutral/70 box-decoration-clone px-0.5 no-underline motion-reduce:animate-none"
            >
              {body}
            </ins>
          ) : (
            <span key={k}>{body}</span>
          );
        })}
      </p>
    </Figure>
  );
}

export type ChipGroup = { label: string; items: string[] };

/** Short lists side by side under their group names, e.g. the narratives by category. Leading ids ("N3") are set apart. */
export function GroupList({ title, groups }: { title: string; groups: ChipGroup[] }) {
  return (
    <Figure title={title}>
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="border-b border-rule pb-1.5 text-sm text-ink">{g.label}</p>
            <ul className="mt-2 space-y-1.5 text-sm leading-snug text-ink-2">
              {g.items.map((item) => {
                const [, id, rest] = item.match(/^([A-Z]+\d+)\s+(.*)$/) ?? [null, null, item];
                return (
                  <li key={item} className={id ? 'grid grid-cols-[2.5rem_1fr]' : undefined}>
                    {id ? <span className="tabular text-muted">{id}</span> : null}
                    <span>{rest}</span>
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
