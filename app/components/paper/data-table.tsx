'use client';

import type { ReactNode } from 'react';
import clsx from 'clsx';
import { tone } from './viz/figure';

/** A column of a results table. A plain string is a column with no options. */
export type TableColumn = {
  label: string;
  /** Heading shared by neighbouring columns with the same group, drawn above them. */
  group?: string;
  /** Sets the best value of the column in bold. */
  better?: 'higher' | 'lower';
  /**
   * In-cell bar; `diverging` draws signed values from a centre line. The scale is the column's largest value unless
   * `max` is given; give columns that are read against each other the same `max`.
   */
  bar?: { tone: string; diverging?: boolean; max?: number };
};

const SIGNIFICANCE = /^(.*?)\s*\((\*{1,3}|ns)\)$/;
const COUNT = /^(.+?) \((\d[\d,]*)\)$/;
const SPREAD = /^(-?[\d,]*\.?\d+) ± ([\d,]*\.?\d+)$/;
const NUMBER = /^-?[\d,]*\.?\d+%?$/;
/** Text that still lines up as a number: "27 / 39", "70B". */
const NUMERIC_TEXT = /^([\d,.]+( \/ [\d,.]+)+|\d+(\.\d+)?[KMB])$/;
const CODES = /^[a-z]{2,3}\*?(, [a-z]{2,3}\*?)+$/;
/** How a missing value is typed in the data, and how it is shown. */
const EMPTY: Record<string, string> = { '': '', '-': '–', '–': '–', NA: 'NA' };

type Cell =
  | { kind: 'empty'; text: string }
  | { kind: 'number'; text: string; value: number; spread?: string; sig?: string }
  | { kind: 'count'; text: string; count: string }
  | { kind: 'codes'; codes: string[] }
  | { kind: 'text'; text: string; numeric: boolean };

const toNumber = (s: string) => Number(s.replace(/,/g, '').replace(/%$/, ''));
/** A typographic minus for negative numbers. */
const signed = (s: string) => s.replace(/^-/, '−');

/** Reads the conventions the tables are typed in: "3.787 (**)", "mid.ru (18)", "57.26 ± 92.63", "ar, de*", "NA". */
function parse(raw: string): Cell {
  const s = raw.trim();
  if (s in EMPTY) return { kind: 'empty', text: EMPTY[s] };
  const sig = s.match(SIGNIFICANCE);
  if (sig && NUMBER.test(sig[1])) return { kind: 'number', text: signed(sig[1]), value: toNumber(sig[1]), sig: sig[2] };
  const spread = s.match(SPREAD);
  if (spread) return { kind: 'number', text: spread[1], value: toNumber(spread[1]), spread: spread[2] };
  if (NUMBER.test(s)) return { kind: 'number', text: signed(s), value: toNumber(s) };
  if (CODES.test(s)) return { kind: 'codes', codes: s.split(', ') };
  const count = s.match(COUNT);
  if (count) return { kind: 'count', text: count[1], count: count[2] };
  return { kind: 'text', text: s, numeric: NUMERIC_TEXT.test(s) };
}

const isNumeric = (c: Cell) => c.kind === 'number' || c.kind === 'empty' || (c.kind === 'text' && c.numeric);

function Bar({ value, scale, toneName, diverging, faint }: { value: number; scale: number; toneName: string; diverging?: boolean; faint?: boolean }) {
  const share = scale > 0 ? Math.min(Math.abs(value) / scale, 1) : 0;
  const fill = tone(toneName, faint ? 0.25 : 0.7);
  return (
    <span aria-hidden className="relative hidden h-2 w-14 shrink-0 rounded-[2px] bg-rule/50 sm:block">
      {diverging ? (
        <>
          <span className="absolute inset-y-[-3px] left-1/2 w-px bg-muted/60" />
          <span
            className="absolute inset-y-0 rounded-[2px]"
            style={{ background: fill, width: `${share * 50}%`, ...(value < 0 ? { right: '50%' } : { left: '50%' }) }}
          />
        </>
      ) : (
        <span className="absolute inset-y-0 left-0 rounded-[2px]" style={{ background: fill, width: `${share * 100}%`, minWidth: value > 0 ? 2 : 0 }} />
      )}
    </span>
  );
}

function CellContent({
  cell,
  best,
  bar,
  scale,
}: {
  cell: Cell;
  best: boolean;
  bar?: TableColumn['bar'];
  scale: number;
}): ReactNode {
  switch (cell.kind) {
    case 'empty':
      return <span className="text-muted">{cell.text}</span>;
    case 'codes':
      return (
        <span className="flex flex-wrap gap-1">
          {cell.codes.map((c) => (
            <span key={c} className="rounded-[2px] border border-rule px-1 text-xs leading-5 text-ink-2" title={c.endsWith('*') ? 'machine-translated' : undefined}>
              {c}
            </span>
          ))}
        </span>
      );
    case 'count':
      return (
        <span className="flex flex-wrap items-baseline justify-between gap-x-2">
          {/* Names such as domains have no spaces; let them wrap only after a dot. */}
          <span className="min-w-0">
            {cell.text.split('.').map((part, i, all) => (
              <span key={i}>
                {part}
                {i < all.length - 1 ? (
                  <>
                    .<wbr />
                  </>
                ) : null}
              </span>
            ))}
          </span>
          <span className="shrink-0 text-muted">{cell.count}</span>
        </span>
      );
    case 'text':
      return cell.text;
    case 'number': {
      const faint = cell.sig === 'ns';
      return (
        <span className="inline-flex items-center justify-end gap-2.5">
          {bar ? <Bar value={cell.value} scale={scale} toneName={bar.tone} diverging={bar.diverging} faint={faint} /> : null}
          <span className={clsx(best ? 'font-semibold text-ink' : cell.value === 0 || faint ? 'text-muted' : undefined)}>
            {cell.text}
            {cell.spread ? <span className="text-muted"> ± {cell.spread}</span> : null}
          </span>
          {cell.sig ? (
            <span className={clsx('w-6 text-left text-xs', faint ? 'text-muted' : 'text-ink')} title={faint ? 'not significant' : `p < ${['0.05', '0.01', '0.001'][cell.sig.length - 1]}`}>
              {cell.sig}
            </span>
          ) : null}
        </span>
      );
    }
  }
}

/**
 * Exact results table of a paper page. Numbers align right in tabular figures, with a true minus sign. Columns can
 * share a group heading, set their best value in bold and carry an in-cell bar, or bars can compare the cells of each
 * row. Repeated values in the first column merge into one cell. Zeros, dashes and non-significant results recede;
 * significance stars sit in their own slot.
 */
export function DataTable({
  columns: specs,
  rows,
  highlight,
  rowBars,
}: {
  columns: (string | TableColumn)[];
  rows: string[][];
  /** First cell of a row to set in bold, e.g. the paper's own dataset. */
  highlight?: string;
  /** Data colour token for bars scaled within each row. */
  rowBars?: string;
}) {
  const columns = specs.map((c): TableColumn => (typeof c === 'string' ? { label: c } : c));
  const parsed = rows.map((r) => r.map(parse));
  // A single language code ("en") reads as code only in a column that also lists several.
  const codeCol = columns.map((_, k) => parsed.some((r) => r[k].kind === 'codes'));
  const cells = parsed.map((r) =>
    r.map((c, k): Cell => (codeCol[k] && c.kind === 'text' && /^[a-z]{2,3}\*?$/.test(c.text) ? { kind: 'codes', codes: [c.text] } : c))
  );
  const rowScale = cells.map((r) => Math.max(0, ...r.slice(1).map((c) => (c.kind === 'number' ? Math.abs(c.value) : 0))));
  const numericCol = columns.map((_, k) => k > 0 && cells.every((r) => isNumeric(r[k])) && cells.some((r) => r[k].kind !== 'empty'));
  const values = columns.map((_, k) =>
    cells.flatMap((r) => {
      const c = r[k];
      return c.kind === 'number' ? [c.value] : [];
    })
  );
  const best = columns.map((c, k) => (c.better && values[k].length ? (c.better === 'higher' ? Math.max(...values[k]) : Math.min(...values[k])) : null));
  const scale = columns.map((_, k) => Math.max(0, ...values[k].map(Math.abs)));
  const groups = columns.reduce<{ label?: string; span: number }[]>((acc, c) => {
    const last = acc[acc.length - 1];
    if (last && c.group && last.label === c.group) last.span += 1;
    else acc.push({ label: c.group, span: 1 });
    return acc;
  }, []);
  const grouped = groups.some((g) => g.label);
  const pad = 'py-2 pr-3 last:pr-0 sm:pr-5 sm:last:pr-0';

  return (
    <table className="tabular table w-full max-w-none overflow-visible whitespace-normal break-words border-collapse text-left text-[0.8125rem] sm:text-sm">
      <thead className="align-bottom">
        {grouped ? (
          <tr>
            {groups.map((g, i) => (
              <th key={i} colSpan={g.span} className={clsx('pb-0 pt-1 font-normal', g.label && 'pr-3 sm:pr-5')}>
                {g.label ? <span className="block border-b border-rule pb-1 text-center text-ink-2">{g.label}</span> : null}
              </th>
            ))}
          </tr>
        ) : null}
        <tr className="border-b border-ink/30 text-muted">
          {columns.map((c, k) => (
            <th key={k} className={clsx(pad, 'font-normal', numericCol[k] && 'text-right')}>
              {c.label}
              {c.better ? <span className="sr-only">, {c.better} is better</span> : null}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cells.map((r, i) => {
          const first = rows[i][0];
          const continues = i > 0 && rows[i - 1][0] === first;
          const span = rows.slice(i).findIndex((o) => o[0] !== first);
          const rowSpan = span === -1 ? rows.length - i : span;
          const joined = rows[i + 1]?.[0] === first;
          const strong = highlight !== undefined && first === highlight;
          return (
            <tr key={i} className={clsx(joined ? 'border-b border-dashed border-rule/70' : 'border-b border-rule', strong ? 'font-semibold text-ink' : 'text-ink-2')}>
              {r.map((cell, k) =>
                k === 0 && continues ? null : (
                  <td
                    key={k}
                    rowSpan={k === 0 ? rowSpan : undefined}
                    className={clsx(pad, k === 0 ? 'align-top text-ink' : 'align-middle', numericCol[k] && 'text-right')}
                  >
                    <CellContent
                      cell={cell}
                      best={best[k] !== null && cell.kind === 'number' && cell.value === best[k]}
                      bar={columns[k].bar ?? (rowBars && k > 0 ? { tone: rowBars } : undefined)}
                      scale={columns[k].bar?.max ?? (columns[k].bar ? scale[k] : rowScale[i])}
                    />
                  </td>
                )
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
