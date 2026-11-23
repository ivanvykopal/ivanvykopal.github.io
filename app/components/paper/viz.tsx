'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import { HiOutlineArrowPath } from 'react-icons/hi2';

/** True once the element has scrolled into view (immediately when reduced motion is requested). */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** Fades and lifts its children in when scrolled into view. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={clsx(
        'transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none',
        seen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
        className
      )}
    >
      {children}
    </div>
  );
}

/** Counts a leading number up when visible, e.g. "98.3%" or "10 LLMs". Non-numeric values render as-is. */
export function CountUp({ value }: { value: string }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const match = value.match(/^(\d[\d,]*(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1].replace(/,/g, '')) : NaN;
  const decimals = match?.[1].split('.')[1]?.length ?? 0;
  const comma = match?.[1].includes(',') ?? false;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!seen || Number.isNaN(target)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1100, 1);
      setN(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, target]);

  if (!match) return <span>{value}</span>;
  const shown = (seen ? n : 0).toFixed(decimals);
  const text = comma ? Number(shown).toLocaleString('en-US', { minimumFractionDigits: decimals }) : shown;
  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden>
        {text}
        {match[2]}
      </span>
    </span>
  );
}

export type BarItem = { label: string; value: number; highlight?: boolean };

/** Horizontal bars that grow in when visible. Hover or focus a row to read its exact value. */
export function BarChart({
  title,
  items,
  max,
  unit = '',
}: {
  title: string;
  items: BarItem[];
  max?: number;
  unit?: string;
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const top = max ?? Math.max(...items.map((i) => i.value));

  return (
    <div ref={ref} className="my-6 rounded border border-rule bg-subtle p-4">
      <p className="mb-3 text-sm font-semibold text-ink">{title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={item.label}
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className="grid grid-cols-[minmax(6rem,13rem)_1fr_3.5rem] items-center gap-3 text-sm"
          >
            <span className={clsx('truncate', active === i ? 'text-ink' : 'text-ink-2')}>{item.label}</span>
            <span className="h-3 rounded-sm bg-rule/60">
              <span
                className={clsx(
                  'block h-full rounded-sm transition-[width,opacity] duration-1000 ease-out motion-reduce:transition-none',
                  item.highlight ? 'bg-accent' : 'bg-accent/50',
                  active !== null && active !== i && 'opacity-40'
                )}
                style={{ width: seen ? `${Math.min((item.value / top) * 100, 100)}%` : '0%', transitionDelay: `${i * 60}ms` }}
              />
            </span>
            <span className="tabular text-right text-muted">
              {item.value}
              {unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type PipelineStep = {
  title: string;
  detail: string;
  /** Headline number for the stage, counted up when the stage becomes active. */
  metric?: { value: string; label: string };
  /** Short tags shown under the detail, e.g. the models or questions involved. */
  chips?: string[];
};

/** Slow enough to read: how long each stage stays active during autoplay. */
const STAGE_MS = 4200;

/**
 * Flow diagram of an approach. Stages are joined by connectors that fill as the walkthrough advances.
 * It autoplays once when scrolled into view; clicking a stage takes over, Replay starts again.
 */
export function Pipeline({ title, steps }: { title: string; steps: PipelineStep[] }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  const last = steps.length - 1;

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!seen || !playing || reduced) return;
    if (current >= last) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setCurrent((c) => c + 1), STAGE_MS);
    return () => window.clearTimeout(t);
  }, [seen, playing, reduced, current, last]);

  const step = steps[current];

  return (
    <div ref={ref} className="my-6 rounded border border-rule bg-subtle p-4 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <button
          type="button"
          onClick={() => {
            setCurrent(0);
            setPlaying(true);
          }}
          className="no-print inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent motion-reduce:transition-none"
        >
          <HiOutlineArrowPath aria-hidden className="h-3.5 w-3.5" />
          Replay
        </button>
      </div>

      <ol className="mt-6 flex">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={s.title} className="relative min-w-0 flex-1">
              {i < last ? (
                <span aria-hidden className="absolute left-1/2 top-[15px] h-0.5 w-full bg-rule">
                  <span
                    className="block h-full origin-left bg-accent transition-transform duration-[1600ms] ease-in-out motion-reduce:transition-none"
                    style={{ transform: `scaleX(${done ? 1 : 0})` }}
                  />
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setCurrent(i);
                  setPlaying(false);
                }}
                aria-current={active ? 'step' : undefined}
                className="group relative z-10 flex w-full flex-col items-center gap-2 px-1"
              >
                <span className="relative flex h-8 w-8 items-center justify-center">
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute inset-0 animate-ping rounded-full bg-accent/30 [animation-duration:2.6s] motion-reduce:hidden"
                    />
                  ) : null}
                  <span
                    className={clsx(
                      'tabular relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-700 motion-reduce:transition-none',
                      done && 'border-accent bg-accent text-page',
                      active && 'scale-110 border-accent bg-page text-accent',
                      !done && !active && 'border-rule bg-page text-muted group-hover:border-accent/60'
                    )}
                  >
                    {i + 1}
                  </span>
                </span>
                <span
                  className={clsx(
                    'text-center text-xs leading-tight transition-colors duration-700 motion-reduce:transition-none sm:text-sm',
                    active ? 'font-semibold text-ink' : done ? 'text-ink-2' : 'text-muted'
                  )}
                >
                  {s.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div
        key={current}
        className="mt-6 grid min-h-[15rem] animate-[fadein_900ms_ease-out_both] content-start gap-x-8 gap-y-4 rounded border border-rule bg-page p-4 motion-reduce:animate-none sm:grid-cols-[11rem_1fr] sm:p-5"
        aria-live="polite"
      >
        <div>
          {step.metric ? (
            <>
              <p className="tabular text-4xl font-semibold tracking-tight text-accent">
                <CountUp value={step.metric.value} />
              </p>
              <p className="mt-1 text-sm leading-snug text-muted">{step.metric.label}</p>
            </>
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-ink">
            <span className="tabular mr-2 text-muted">{current + 1}/{steps.length}</span>
            {step.title}
          </p>
          <p className="mt-2 leading-relaxed text-ink-2">{step.detail}</p>
          {step.chips?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {step.chips.map((chip, k) => (
                <li
                  key={chip}
                  className="animate-[fadein_800ms_ease-out_both] rounded-full border border-rule bg-subtle px-3 py-1 text-sm text-ink-2 motion-reduce:animate-none"
                  style={{ animationDelay: `${500 + k * 180}ms` }}
                >
                  {chip}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export type StackedRow = { label: string; values: number[] };
export type StackedSegment = { label: string; tone: 'muted' | 'accent' | 'danger' | 'safe' };

const TONE_STYLES: Record<StackedSegment['tone'], string> = {
  muted: 'bg-ink/20',
  accent: 'bg-accent',
  danger: 'bg-red-500',
  safe: 'bg-emerald-500',
};

/** Stacked horizontal bars (parts of a whole per row) that grow in when visible. Hover a row for the exact counts. */
export function StackedBars({
  title,
  segments,
  rows,
  note,
}: {
  title: string;
  segments: StackedSegment[];
  rows: StackedRow[];
  note?: string;
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  return (
    <div ref={ref} className="my-6 rounded border border-rule bg-subtle p-4">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-label="Legend">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-1.5">
            <span className={clsx('inline-block h-2.5 w-2.5 rounded-sm', TONE_STYLES[s.tone])} />
            {s.label}
          </li>
        ))}
      </ul>
      <ul className="mt-4 space-y-2">
        {rows.map((row, r) => {
          const total = row.values.reduce((a, b) => a + b, 0);
          return (
            <li
              key={row.label}
              tabIndex={0}
              onMouseEnter={() => setActive(r)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(r)}
              onBlur={() => setActive(null)}
              className="grid grid-cols-[minmax(5rem,9rem)_1fr] items-center gap-3 text-sm sm:grid-cols-[minmax(5rem,9rem)_1fr_9rem]"
            >
              <span className={clsx('truncate', active === r ? 'text-ink' : 'text-ink-2')}>{row.label}</span>
              <span className="flex h-3 overflow-hidden rounded-sm bg-rule/40">
                {row.values.map((v, i) => (
                  <span
                    key={i}
                    className={clsx(
                      'block h-full transition-[width] duration-1000 ease-out motion-reduce:transition-none',
                      TONE_STYLES[segments[i].tone]
                    )}
                    style={{ width: seen ? `${(v / total) * 100}%` : '0%', transitionDelay: `${r * 60}ms` }}
                  />
                ))}
              </span>
              <span className="tabular hidden text-right text-xs text-muted sm:block">
                {row.values.join(' / ')}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted">
        Counts per row: {segments.map((s) => s.label).join(' / ')}.{note ? ` ${note}` : ''}
      </p>
    </div>
  );
}

export type PromptTab = { label: string; text: string };

/** Switchable prompt viewer. Bracketed [PLACEHOLDERS] are highlighted. */
export function PromptTabs({ title, tabs }: { title: string; tabs: PromptTab[] }) {
  const [i, setI] = useState(0);
  return (
    <div className="my-6 rounded border border-rule bg-subtle p-4">
      <p className="mb-3 text-sm font-semibold text-ink">{title}</p>
      <div role="tablist" className="flex gap-1 border-b border-rule">
        {tabs.map((t, idx) => (
          <button
            key={t.label}
            role="tab"
            type="button"
            aria-selected={i === idx}
            onClick={() => setI(idx)}
            className={clsx(
              '-mb-px border-b-2 px-3 py-1.5 text-sm transition-colors motion-reduce:transition-none',
              i === idx ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p
        key={i}
        role="tabpanel"
        className="mt-4 animate-[fadein_300ms_ease-out] whitespace-pre-wrap rounded border border-rule bg-page p-3 font-mono text-[0.8125rem] leading-relaxed text-ink-2 motion-reduce:animate-none"
      >
        {tabs[i].text.split(/(\[[A-Z ]+\])/).map((part, k) =>
          /^\[[A-Z ]+\]$/.test(part) ? (
            <span key={k} className="rounded bg-accent/15 px-1 text-accent">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </p>
    </div>
  );
}

export type ChipGroup = { label: string; items: string[] };

/** Grouped list with category filter: pick a category to focus its items and dim the rest. */
export function GroupExplorer({ title, groups }: { title: string; groups: ChipGroup[] }) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="my-6 rounded border border-rule bg-subtle p-4">
      <p className="mb-3 text-sm font-semibold text-ink">{title}</p>
      <div className="flex flex-wrap gap-2">
        {groups.map((g, i) => (
          <button
            key={g.label}
            type="button"
            aria-pressed={sel === i}
            onClick={() => setSel(sel === i ? null : i)}
            className={clsx(
              'rounded-full border px-3 py-1 text-sm transition-colors motion-reduce:transition-none',
              sel === i ? 'border-accent bg-accent/10 text-ink' : 'border-rule text-muted hover:text-ink'
            )}
          >
            {g.label}
          </button>
        ))}
      </div>
      <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        {groups.flatMap((g, gi) =>
          g.items.map((item) => (
            <li
              key={item}
              className={clsx(
                'transition-opacity duration-300 motion-reduce:transition-none',
                sel === null || sel === gi ? 'text-ink-2 opacity-100' : 'text-muted opacity-30'
              )}
            >
              {item}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
