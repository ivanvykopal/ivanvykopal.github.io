'use client';

import { useState, type ReactNode } from 'react';
import clsx from 'clsx';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import { delay, Figure, tone } from './figure';

export type ArchKind = 'adapter' | 'prompt';
export type ArchConfig = {
  label: string;
  /** Name inside the picker grid, where the row and column already say what is combined. */
  short: string;
  /** What carries the language representation, if anything. */
  language: ArchKind | null;
  task: ArchKind;
  /** Colour of the configuration in the result charts, shown as a swatch in the picker. */
  tone?: string;
  /** Headline results of the configuration, e.g. how many language pairs it wins. */
  facts?: { value: string; label: string }[];
};

const LANGUAGE_ROWS: { kind: ArchKind | null; label: string }[] = [
  { kind: null, label: 'No language representation' },
  { kind: 'adapter', label: 'Language adapter' },
  { kind: 'prompt', label: 'Soft language prompt' },
];
const TASK_COLUMNS: { kind: ArchKind; label: string }[] = [
  { kind: 'adapter', label: 'Task adapter' },
  { kind: 'prompt', label: 'Soft task prompt' },
];

/** Bottleneck glyph of an adapter: a down-projection, then an up-projection back to the model width. */
function AdapterGlyph({ toneName }: { toneName: string }) {
  return (
    <svg aria-hidden width="22" height="14" viewBox="0 0 22 14" className="shrink-0">
      <path d="M1 1h8l-2.5 6h-3z M1 13h8l-2.5-6h-3z" fill={tone(toneName, 0.55)} stroke={tone(toneName)} strokeWidth="1" strokeLinejoin="round" />
      <path d="M13 7h8" stroke={tone(toneName)} strokeWidth="1" strokeDasharray="2 1.5" />
    </svg>
  );
}

/** A frozen part of mT0-BASE. */
function Frozen({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-8 items-center justify-center rounded-[3px] border border-rule px-3 text-center text-xs text-muted">{children}</span>
  );
}

/**
 * Place of an adapter inside the layer. Filled when the configuration uses it; otherwise a faint dashed slot,
 * so the layer keeps its shape and switching configurations shows only what changes.
 */
function AdapterSlot({ label, toneName, on, wait }: { label: string; toneName: string; on: boolean; wait: number }) {
  return on ? (
    <span
      className="viz-in flex h-8 items-center justify-center gap-2 rounded-[3px] border px-3 text-xs font-semibold text-ink"
      style={{ background: tone(toneName, 0.16), borderColor: tone(toneName, 0.85), ...delay(wait) }}
    >
      <AdapterGlyph toneName={toneName} />
      {label}
    </span>
  ) : (
    <span className="flex h-5 items-center justify-center rounded-[3px] border border-dashed border-rule text-[0.6875rem] text-muted/70">
      no {label.toLowerCase()}
    </span>
  );
}

/** A run of trained vectors in the input sequence; dashed and empty when the configuration has no such prompt. */
function PromptSegment({ label, toneName, on, wait }: { label: string; toneName: string; on: boolean; wait: number }) {
  return (
    <span className="flex min-w-0 flex-col gap-1">
      <span
        className={clsx('flex h-7 items-center gap-[3px] rounded-[3px] border px-1', on ? 'viz-in' : 'border-dashed border-rule')}
        style={on ? { borderColor: tone(toneName, 0.85), ...delay(wait) } : undefined}
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((k) => (
          <span
            key={k}
            className="h-4 flex-1 rounded-[2px]"
            style={{ background: on ? tone(toneName, 0.45) : 'transparent', minWidth: 6 }}
          />
        ))}
      </span>
      <span className={clsx('text-center text-[0.6875rem] leading-tight', on ? 'font-semibold text-ink' : 'text-muted/70')}>
        {on ? label : `no ${label.toLowerCase()}`}
      </span>
    </span>
  );
}

/** One row of the train and test strip: the language part (which changes) and the task part (which does not). */
function SwapRow({
  when,
  language,
  config,
  languageTone,
  taskTone,
}: {
  when: string;
  language: string;
  config: ArchConfig;
  languageTone: string;
  taskTone: string;
}) {
  const part = (name: string, toneName: string, text: string) => (
    <span
      className="rounded-[3px] border px-2 py-1 leading-tight text-ink"
      style={{ background: tone(toneName, 0.12), borderColor: tone(toneName, 0.7) }}
    >
      <span className="block text-[0.6875rem] text-muted">{name}</span>
      {text}
    </span>
  );
  return (
    <li className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
      <span className="text-muted">{when}</span>
      <span className="flex flex-wrap items-center gap-1.5">
        {config.language
          ? part(config.language === 'adapter' ? 'Language adapter' : 'Language prompt', languageTone, language)
          : null}
        {config.language ? <span className="text-muted">+</span> : null}
        {part(config.task === 'adapter' ? 'Task adapter' : 'Task prompt', taskTone, when === 'Training' ? `trained on ${language} data` : 'unchanged')}
      </span>
    </li>
  );
}

/**
 * Where the language and task representations sit in mT0-BASE for each of the six configurations, after
 * Figure 2 of the paper: adapters inside every transformer layer, soft prompts prepended to the input. The
 * 3 by 2 grid is the design space and picks the configuration. Beside the model, a strip shows what is swapped
 * between training and testing, and the configuration's headline results.
 */
export function Architecture({
  title,
  configs,
  languageTone,
  taskTone,
  example,
  caption,
}: {
  title: string;
  configs: ArchConfig[];
  languageTone: string;
  taskTone: string;
  /** Source and target language used to illustrate the swap at test time. */
  example: { source: string; target: string };
  caption?: string;
}) {
  const [ci, setCi] = useState(Math.max(configs.findIndex((c) => c.language === 'prompt' && c.task === 'adapter'), 0));
  const config = configs[ci];
  const find = (language: ArchKind | null, task: ArchKind) => configs.findIndex((c) => c.language === language && c.task === task);
  const key = `${config.language}-${config.task}`;

  return (
    <Figure title={title} caption={caption}>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2" aria-label="Legend">
        <li className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: tone(languageTone, 0.7) }} />
          Language representation, trained on Wikipedia
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: tone(taskTone, 0.7) }} />
          Task representation, trained on the task
        </li>
        <li className="flex items-center gap-2">
          <HiOutlineLockClosed aria-hidden className="h-3.5 w-3.5 text-muted" />
          mT0-BASE, frozen
        </li>
      </ul>

      <div className="mt-6 grid items-start gap-x-10 gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div role="group" aria-label="Pick a configuration" className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] gap-1 text-xs">
            <span />
            {TASK_COLUMNS.map((col) => (
              <span key={col.kind} className="self-end pb-1 text-center text-muted">
                {col.label}
              </span>
            ))}
            {LANGUAGE_ROWS.map((row) => (
              <div key={row.label} className="contents">
                <span className="flex items-center border-t border-rule pr-2 leading-snug text-muted">{row.label}</span>
                {TASK_COLUMNS.map((col) => {
                  const i = find(row.kind, col.kind);
                  if (i < 0) return <span key={col.kind} className="border-t border-rule" />;
                  const active = i === ci;
                  const c = configs[i];
                  return (
                    <span key={col.kind} className="flex border-t border-rule pt-1">
                      <button
                        type="button"
                        aria-pressed={active}
                        aria-label={c.label}
                        onClick={() => setCi(i)}
                        className={clsx(
                          'flex min-h-[2.75rem] w-full items-center justify-center gap-1.5 rounded px-2 py-1.5 text-center leading-snug transition-colors duration-150',
                          active
                            ? 'bg-subtle font-semibold text-ink shadow-[inset_0_0_0_1px_rgb(var(--ink)/0.5)]'
                            : 'text-ink-2 hover:bg-subtle hover:text-ink'
                        )}
                      >
                        {c.tone ? (
                          <span aria-hidden className="inline-block h-2 w-2 shrink-0 rounded-[2px]" style={{ background: tone(c.tone) }} />
                        ) : null}
                        {c.short}
                      </button>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <div key={key} className="mt-6" aria-live="polite">
            <p className="flex items-center gap-2 font-semibold text-ink">
              {config.tone ? (
                <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: tone(config.tone) }} />
              ) : null}
              {config.label}
            </p>
            <ul className="mt-3 space-y-2 text-xs" aria-label="Training and testing">
              <SwapRow when="Training" language={example.source} config={config} languageTone={languageTone} taskTone={taskTone} />
              <SwapRow when="Testing" language={example.target} config={config} languageTone={languageTone} taskTone={taskTone} />
            </ul>
            {config.facts?.length ? (
              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
                {config.facts.map((f) => (
                  <div key={f.label} className="flex flex-col-reverse justify-end">
                    <dt className="mt-0.5 text-xs leading-snug text-muted">{f.label}</dt>
                    <dd className="tabular text-lg font-semibold tracking-tight text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>

        <div key={key} className="mx-auto flex w-full min-w-0 max-w-[24rem] flex-col items-stretch">
          <span className="mx-auto rounded-[3px] border border-rule px-3 py-1 text-[0.6875rem] text-muted">
            Output: answer, entity tags or label
          </span>
          <span aria-hidden className="mx-auto h-3 w-px bg-rule" />
          <div className="relative flex flex-col gap-1.5 rounded border border-dashed border-rule p-3 pt-7">
            <span className="absolute left-3 top-2 flex items-center gap-1.5 text-[0.6875rem] text-muted">
              <HiOutlineLockClosed aria-hidden className="h-3 w-3" />
              Every transformer layer of mT0-BASE
            </span>
            <Frozen>Add &amp; norm</Frozen>
            <AdapterSlot label="Task adapter" toneName={taskTone} on={config.task === 'adapter'} wait={160} />
            <AdapterSlot label="Language adapter" toneName={languageTone} on={config.language === 'adapter'} wait={60} />
            <Frozen>Feed forward</Frozen>
            <Frozen>Add &amp; norm</Frozen>
            <Frozen>Multi-head attention</Frozen>
          </div>
          <span aria-hidden className="mx-auto h-3 w-px bg-rule" />
          <div className="grid grid-cols-[1fr_1fr_1.1fr] gap-1.5" aria-label="Input sequence">
            <PromptSegment label="Language prompt" toneName={languageTone} on={config.language === 'prompt'} wait={60} />
            <PromptSegment label="Task prompt" toneName={taskTone} on={config.task === 'prompt'} wait={160} />
            <span className="flex min-w-0 flex-col gap-1">
              <span className="flex h-7 items-center gap-[3px] rounded-[3px] border border-rule px-1" aria-hidden>
                {[0, 1, 2, 3, 4, 5].map((k) => (
                  <span key={k} className="h-4 flex-1 rounded-[2px] bg-muted/20" style={{ minWidth: 5 }} />
                ))}
              </span>
              <span className="text-center text-[0.6875rem] leading-tight text-muted">Input text</span>
            </span>
          </div>
          <span className="mt-1.5 text-center text-[0.6875rem] text-muted">Input embeddings, read left to right</span>
        </div>
      </div>
    </Figure>
  );
}
