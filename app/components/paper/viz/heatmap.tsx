'use client';

import { useRef, useState, type FocusEvent, type MouseEvent } from 'react';
import clsx from 'clsx';
import { delay, Figure, Switch, Tooltip, tone } from './figure';

/** A category a cell can belong to, e.g. the configuration that scored best there. */
export type HeatClass = { label: string; tone: string };
/** One line of the readout of a cell. */
export type HeatDetail = { label: string; value: string; tone?: string; strong?: boolean; muted?: boolean };
export type HeatCell = {
  value: number | null;
  /** Index into `classes`; colours the cell by category instead of by value. */
  cls?: number;
  detail?: HeatDetail[];
};
export type HeatView = { label: string; cells: HeatCell[][] };
export type HeatAxis = { label: string; short?: string; separated?: boolean };
/** Diverging colour scale around zero: `tones` colour negative and positive values, `max` is full strength. */
export type HeatScale = { max: number; tones: [string, string] };

/** Strongest tint a cell gets, so ink text on it keeps its contrast in both themes. */
const STRENGTH = 0.6;

const minus = (s: string) => s.replace('-', '\u2212');

/**
 * A grid of source by target values, as in Figure 4 of the soft language prompts paper. Cells are tinted on a
 * diverging scale or, with `classes`, by the category each cell falls into. Hovering a cell reads out its
 * detail; hovering a legend entry keeps only the cells of that category. A switch changes the view and the
 * tints cross-fade.
 */
export function Heatmap({
  title,
  rows,
  columns,
  rowAxis,
  columnAxis,
  views,
  classes,
  scale,
  decimals = 2,
  signed,
  switchLabel = 'View',
  caption,
}: {
  title: string;
  rows: HeatAxis[];
  columns: HeatAxis[];
  rowAxis: string;
  columnAxis: string;
  views: HeatView[];
  classes?: HeatClass[];
  scale?: HeatScale;
  decimals?: number;
  /** Print a + before positive values. */
  signed?: boolean;
  switchLabel?: string;
  caption?: string;
}) {
  const [vi, setVi] = useState(0);
  const [hot, setHot] = useState<{ r: number; c: number; x: number; y: number; up: boolean } | null>(null);
  const [only, setOnly] = useState<number | null>(null);
  const outer = useRef<HTMLDivElement>(null);
  const view = views[vi];
  const fmt = (v: number) => minus(`${signed && v > 0 ? '+' : ''}${v.toFixed(decimals)}`);

  const fill = (cell: HeatCell) => {
    if (cell.value === null) return 'transparent';
    if (classes && cell.cls !== undefined) return tone(classes[cell.cls].tone, only === null || only === cell.cls ? 0.5 : 0.07);
    if (scale) {
      const a = Math.min(Math.abs(cell.value) / scale.max, 1) * STRENGTH;
      return tone(scale.tones[cell.value < 0 ? 0 : 1], a);
    }
    return 'transparent';
  };

  const counts = classes?.map((_, k) => view.cells.flat().filter((cell) => cell.cls === k).length);

  const enter = (r: number, c: number) => (e: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    const box = outer.current?.getBoundingClientRect();
    const cell = e.currentTarget.getBoundingClientRect();
    if (!box) return;
    const up = r >= rows.length / 2;
    setHot({
      r,
      c,
      x: ((cell.left + cell.width / 2 - box.left) / box.width) * 100,
      y: up ? box.bottom - cell.top + 6 : cell.bottom - box.top + 6,
      up,
    });
  };

  const hotCell = hot ? view.cells[hot.r]?.[hot.c] : null;
  const grid = { gridTemplateColumns: `minmax(6.5rem, auto) ${columns.map((c) => (c.separated ? '0.5rem minmax(3.25rem, 1fr)' : 'minmax(3.25rem, 1fr)')).join(' ')}` };

  return (
    <Figure
      title={title}
      caption={caption}
      controls={
        views.length > 1 ? (
          <Switch
            label={switchLabel}
            options={views.map((v) => v.label)}
            value={vi}
            onChange={(i) => {
              setVi(i);
              setHot(null);
            }}
          />
        ) : null
      }
    >
      {classes ? (
        <ul className="-mx-2 flex flex-wrap gap-x-1 gap-y-0.5 text-sm text-ink-2" aria-label="Legend" onMouseLeave={() => setOnly(null)}>
          {classes.map((k, i) => (
            <li
              key={k.label}
              onMouseEnter={() => setOnly(i)}
              className={clsx(
                'flex cursor-default items-center gap-2 rounded px-2 py-0.5 transition-opacity duration-150',
                only !== null && only !== i && 'opacity-40'
              )}
            >
              <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: tone(k.tone, 0.7) }} />
              {k.label}
              <span className="tabular text-muted">{counts?.[i]}</span>
            </li>
          ))}
        </ul>
      ) : scale ? (
        <div className="flex items-center gap-3 text-xs text-muted" aria-hidden>
          <span className="tabular">{minus(`-${scale.max}`)}</span>
          <span
            className="h-2.5 w-40 rounded-[2px]"
            style={{
              background: `linear-gradient(to right, ${tone(scale.tones[0], STRENGTH)}, transparent, ${tone(scale.tones[1], STRENGTH)})`,
            }}
          />
          <span className="tabular">{signed ? `+${scale.max}` : scale.max}</span>
        </div>
      ) : null}

      <div ref={outer} className="relative mt-4" onMouseLeave={() => setHot(null)}>
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="grid min-w-[40rem] gap-[3px] text-xs" style={grid} role="table" aria-label={`${title}, ${view.label}`}>
            <div role="row" className="contents">
              <span role="columnheader" className="self-end pb-1 pr-3 text-right text-muted">
                {rowAxis}
                <span className="mx-1 text-rule" aria-hidden>
                  /
                </span>
                {columnAxis}
              </span>
              {columns.map((col, c) => (
                <span key={col.label} role="columnheader" className="contents">
                  {col.separated ? <span aria-hidden /> : null}
                  <span
                    className={clsx(
                      'self-end truncate pb-1 text-center transition-colors duration-150',
                      hot?.c === c ? 'text-ink' : 'text-ink-2'
                    )}
                    title={col.label}
                  >
                    <span className="hidden lg:inline">{col.label}</span>
                    <span className="lg:hidden">{col.short ?? col.label}</span>
                  </span>
                </span>
              ))}
            </div>
            {rows.map((row, r) => (
              <div key={row.label} role="row" className="contents">
                <span
                  role="rowheader"
                  className={clsx('flex items-center justify-end pr-3 text-sm transition-colors duration-150', hot?.r === r ? 'text-ink' : 'text-ink-2')}
                >
                  {row.label}
                </span>
                {columns.map((col, c) => {
                  const cell = view.cells[r][c];
                  const label = `${row.label} to ${col.label}: ${
                    cell.value === null ? 'no data' : `${classes && cell.cls !== undefined ? `${classes[cell.cls].label}, ` : ''}${fmt(cell.value)}`
                  }`;
                  return (
                    <span key={col.label} className="contents">
                      {col.separated ? <span aria-hidden /> : null}
                      <span
                        role="cell"
                        tabIndex={cell.value === null ? undefined : 0}
                        aria-label={label}
                        onMouseEnter={cell.value === null ? undefined : enter(r, c)}
                        onFocus={cell.value === null ? undefined : enter(r, c)}
                        onBlur={() => setHot(null)}
                        className={clsx(
                          'viz-in tabular flex h-9 items-center justify-center rounded-[2px] outline-none transition-[background-color,box-shadow,color] duration-300',
                          cell.value === null ? 'text-muted' : 'text-ink',
                          classes && only !== null && cell.cls !== only && 'text-muted/60',
                          hot?.r === r && hot.c === c && 'shadow-[inset_0_0_0_1.5px_rgb(var(--ink))]'
                        )}
                        style={{ background: fill(cell), ...delay((r + c) * 22) }}
                      >
                        {cell.value === null ? '–' : fmt(cell.value)}
                      </span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        {hot && hotCell?.detail ? (
          <Tooltip x={hot.x} {...(hot.up ? { bottom: hot.y } : { top: hot.y })} flip={hot.x > 55} wide>
            <p className="mb-1 font-semibold text-ink">
              {rows[hot.r].label} to {columns[hot.c].label}
            </p>
            <ul className="space-y-0.5">
              {hotCell.detail.map((d) => (
                <li
                  key={d.label}
                  className={clsx('tabular flex items-center justify-between gap-4', d.strong && 'font-semibold text-ink', d.muted && 'text-muted')}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    {d.tone ? <span aria-hidden className="inline-block h-2 w-2 rounded-[2px]" style={{ background: tone(d.tone) }} /> : null}
                    {d.label}
                  </span>
                  <span className="whitespace-nowrap">{d.value}</span>
                </li>
              ))}
            </ul>
          </Tooltip>
        ) : null}
      </div>
    </Figure>
  );
}
