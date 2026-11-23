'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';

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
            className="grid grid-cols-[minmax(6rem,10rem)_1fr_3.5rem] items-center gap-3 text-sm"
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

export type PipelineStep = { title: string; detail: string };

/** Step-by-step diagram of an approach. Steps light up in sequence on view; click one to pin it. */
export function Pipeline({ title, steps }: { title: string; steps: PipelineStep[] }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [pinned, setPinned] = useState<number | null>(null);
  const [lit, setLit] = useState(-1);

  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLit(steps.length - 1);
      return;
    }
    const timers = steps.map((_, i) => window.setTimeout(() => setLit(i), 350 * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, [seen, steps]);

  const current = pinned ?? Math.max(lit, 0);

  return (
    <div ref={ref} className="my-6 rounded border border-rule bg-subtle p-4">
      <p className="mb-4 text-sm font-semibold text-ink">{title}</p>
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
        {steps.map((s, i) => (
          <li key={s.title} className="flex min-w-0 flex-1 items-center sm:flex-col sm:items-stretch">
            <button
              type="button"
              onClick={() => setPinned(pinned === i ? null : i)}
              aria-pressed={pinned === i}
              className={clsx(
                'w-full rounded border px-3 py-2 text-left text-sm transition-colors duration-500 motion-reduce:transition-none',
                i <= lit ? 'border-accent text-ink' : 'border-rule text-muted',
                current === i && 'bg-accent/10'
              )}
            >
              <span className="tabular mr-2 text-muted">{i + 1}</span>
              {s.title}
            </button>
            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className={clsx(
                  'mx-2 h-px w-4 shrink-0 self-center transition-colors duration-500 sm:mx-0 sm:hidden',
                  i < lit ? 'bg-accent' : 'bg-rule'
                )}
              />
            ) : null}
          </li>
        ))}
      </ol>
      <div className="mt-3 h-1 overflow-hidden rounded bg-rule/60" aria-hidden>
        <div
          className="h-full bg-accent transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${((lit + 1) / steps.length) * 100}%` }}
        />
      </div>
      <p className="mt-3 min-h-[3rem] text-sm leading-relaxed text-ink-2" aria-live="polite">
        {steps[current].detail}
      </p>
    </div>
  );
}
