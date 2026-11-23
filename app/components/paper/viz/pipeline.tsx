'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { useInView } from './figure';

export type PipelineStep = {
  title: string;
  detail: string;
  /** Headline number for the stage. */
  metric?: { value: string; label: string };
  /** Short tags shown under the detail, e.g. the models or questions involved. */
  chips?: string[];
};

/** Slow enough to read: how long each stage stays active during autoplay. */
const STAGE_MS = 4200;

/**
 * Flow diagram of an approach: numbered stages on a track, with the detail of the current stage below.
 * It plays through once when scrolled into view, the connector filling for as long as a stage is shown.
 * Choosing a stage takes over; Replay starts again.
 */
export function Pipeline({ title, steps }: { title: string; steps: PipelineStep[] }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.4);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  const last = steps.length - 1;

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const auto = seen && playing && !reduced;
  useEffect(() => {
    if (!auto) return;
    if (current >= last) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setCurrent((c) => c + 1), STAGE_MS);
    return () => window.clearTimeout(t);
  }, [auto, current, last]);

  const step = steps[current];

  return (
    <div ref={ref} className="my-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[0.9375rem] font-semibold text-ink">{title}</p>
        <button
          type="button"
          onClick={() => {
            setCurrent(0);
            setPlaying(true);
          }}
          className="no-print inline-flex items-center gap-1.5 rounded px-1 text-sm text-muted transition-colors duration-150 hover:text-ink"
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
                <span aria-hidden className="absolute left-1/2 top-[15px] h-px w-full bg-rule">
                  <span
                    // Keyed so the fill restarts from zero when the stage becomes active again.
                    key={`${active}-${auto}`}
                    className="-mt-px block h-[3px] origin-left bg-ink"
                    style={{
                      transform: `scaleX(${done ? 1 : 0})`,
                      animation: active && auto ? `pipeline-fill ${STAGE_MS}ms linear forwards` : undefined,
                    }}
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
                className="group relative z-10 flex w-full flex-col items-center gap-2 rounded px-1"
              >
                <span
                  className={clsx(
                    'tabular flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-[background-color,border-color,color,box-shadow] duration-300',
                    done && 'border-ink bg-ink text-page',
                    active && 'border-ink bg-page text-ink shadow-[0_0_0_4px_rgb(var(--ink)/0.1)]',
                    !done && !active && 'border-rule bg-page text-muted group-hover:border-muted group-hover:text-ink'
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={clsx(
                    'text-center text-xs leading-tight transition-colors duration-300 sm:text-sm',
                    active ? 'font-semibold text-ink' : done ? 'text-ink-2' : 'text-muted group-hover:text-ink'
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
        className="mt-7 grid min-h-[17rem] content-start gap-x-10 gap-y-3 border-t border-rule pt-6 sm:min-h-[10.5rem] sm:grid-cols-[12rem_1fr]"
        aria-live="polite"
      >
        {step.metric ? (
          <div className="animate-[pipeline-in_500ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none">
            <p className="tabular text-[2.5rem] font-semibold leading-none tracking-tight text-ink">{step.metric.value}</p>
            <p className="mt-2 text-sm leading-snug text-muted">{step.metric.label}</p>
          </div>
        ) : (
          <div />
        )}
        <div className="min-w-0 animate-[pipeline-in_500ms_cubic-bezier(0.16,1,0.3,1)_80ms_both] motion-reduce:animate-none">
          <p className="leading-relaxed text-ink-2">{step.detail}</p>
          {step.chips?.length ? (
            <ul className="mt-3 flex flex-wrap gap-x-1.5 gap-y-1.5">
              {step.chips.map((chip, k) => (
                <li
                  key={chip}
                  className="animate-[viz-in_400ms_ease-out_both] rounded-full border border-rule px-2.5 py-0.5 text-sm text-ink-2 motion-reduce:animate-none"
                  style={{ animationDelay: `${250 + k * 50}ms` }}
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
