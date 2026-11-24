'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import clsx from 'clsx';

/** CSS colour of a data token from global.css, e.g. tone('q3') or tone('danger'). */
export const tone = (name: string, alpha = 1) => `rgb(var(--viz-${name}) / ${alpha})`;

/** Entrance delay in milliseconds for a mark with a viz-* animation class. */
export const delay = (ms: number) => ({ '--i': ms }) as CSSProperties;

/**
 * Isolating one series of a chart. Hovering or focusing a legend entry, or a mark of the series, highlights it;
 * clicking a legend entry keeps it highlighted. Everything else turns grey and fades, in every chart alike.
 * `legend(k)` gives the props of the entry of series k; `dim(k)` says whether series k steps back.
 */
export function useIsolate() {
  const [over, setOver] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const active = over ?? pinned;
  const legend = (k: number) => ({
    tabIndex: 0,
    role: 'button' as const,
    'aria-pressed': pinned === k,
    onMouseEnter: () => setOver(k),
    onMouseLeave: () => setOver(null),
    onFocus: () => setOver(k),
    onBlur: () => setOver(null),
    onClick: () => setPinned(pinned === k ? null : k),
    onKeyDown: (e: { key: string; preventDefault: () => void }) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setPinned(pinned === k ? null : k);
      }
    },
    className: clsx(
      'flex cursor-pointer items-center gap-2 rounded px-2 py-0.5 outline-none transition-[opacity,filter] duration-150 focus-visible:ring-2 focus-visible:ring-ink/30',
      active !== null && active !== k && 'opacity-40 grayscale',
      active === k && 'font-semibold text-ink'
    ),
  });
  return { active, setOver, legend, dim: (k: number) => active !== null && active !== k };
}

/** Classes of a mark that steps back while another series is isolated. */
export const DIMMED = 'opacity-25 grayscale';

/** Legend list shared by the charts that isolate series. */
export const LEGEND_LIST = '-mx-2 flex flex-wrap gap-x-1 gap-y-0.5 text-sm text-ink-2';

/** True once the element has scrolled into view. */
export function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
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
      // The bottom 15% of the viewport does not count, so a figure starts once it is clearly on screen.
      { threshold: [threshold], rootMargin: '0px 0px -15% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/** Width of the element in CSS pixels, so SVG charts can lay out at real size and keep text readable. */
export function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/**
 * Frame shared by every chart: title, optional controls, the chart, a caption. No box around it; the chart
 * sits on the page like a figure in a paper. Sets data-seen when scrolled into view, which starts the
 * entrance animations of the marks inside (see global.css).
 */
export function Figure({
  title,
  controls,
  caption,
  children,
}: {
  title: string;
  controls?: ReactNode;
  caption?: ReactNode;
  children: ReactNode;
}) {
  const [ref, seen] = useInView<HTMLElement>(0.2);
  return (
    <figure ref={ref} data-viz data-seen={seen ? 'true' : undefined} className="my-8 first:mt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
        <p className="text-[0.9375rem] font-semibold leading-snug text-ink">{title}</p>
        {controls}
      </div>
      <div className="mt-4">{children}</div>
      {caption ? (
        <figcaption className="mt-3 text-sm leading-relaxed text-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** Two or three mutually exclusive views of one chart, styled like the site navigation. */
export function Switch({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: number;
  onChange: (index: number) => void;
}) {
  return (
    <div role="group" aria-label={label} className="no-print -mx-2 flex flex-wrap">
      {options.map((option, i) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === i}
          onClick={() => onChange(i)}
          className={clsx(
            'rounded px-2 py-1 text-sm underline-offset-[0.45em] transition-colors duration-150',
            value === i ? 'text-ink underline decoration-ink/40' : 'text-muted hover:text-ink'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/**
 * Explanation that appears under its parent on hover or keyboard focus, e.g. the full wording of a question
 * behind a short legend label. The parent needs the classes `group relative`.
 */
export function Hint({ children, align = 'left' }: { children: ReactNode; align?: 'left' | 'right' }) {
  return (
    <span
      role="tooltip"
      className={clsx(
        'pointer-events-none absolute top-full z-20 mt-1 hidden w-max max-w-[18rem] rounded border border-rule bg-page px-3 py-2 text-left text-xs font-normal leading-snug text-ink-2 group-focus-within:block group-hover:block',
        align === 'left' ? 'left-0' : 'right-0'
      )}
    >
      {children}
    </span>
  );
}

/**
 * Floating readout for the hovered mark. `x` is a percentage of the positioned parent. Pass `bottom` instead
 * of `top` for marks near the lower edge, so the readout opens upwards and stays inside the chart. `wide`
 * lifts the width cap for readouts whose rows should not wrap.
 */
export function Tooltip({
  x,
  top = 0,
  bottom,
  flip,
  wide,
  children,
}: {
  x: number;
  top?: number;
  bottom?: number;
  flip: boolean;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        'pointer-events-none absolute z-10 w-max rounded border border-rule bg-page px-3 py-2 text-xs leading-snug text-ink-2',
        wide ? 'max-w-[24rem]' : 'max-w-[16rem]'
      )}
      style={{
        left: `${x}%`,
        ...(bottom === undefined ? { top } : { bottom }),
        transform: `translateX(${flip ? 'calc(-100% - 12px)' : '12px'})`,
      }}
    >
      {children}
    </div>
  );
}
