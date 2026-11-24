'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { delay, Figure, Tooltip, tone, useWidth } from './figure';
import { Swatch, type StackedTone } from './stacked-bars';

export type MatrixClass = { key: string; label: string; tone: StackedTone };
export type MatrixColumn = { label: string; title: string };
export type MatrixColumnGroup = { label: string; span: number };
export type MatrixRowGroup = { label: string; rows: { label: string; cells: string }[] };

const LABEL_W = 108;
const GROUP_GAP = 14;
const COL_GAP = 4;
const UNIT_GAP = 1.5;
const ROW_GAP = 7;
const HEAD_H = 40;
const GROUP_HEAD_H = 22;
/** Units per row inside one cell; a cell holds `perCell` units, so 6 units make a 3 by 2 block. */
const PER_LINE = 3;

/**
 * One square per item (here: per generated article), arranged as rows by columns with several items per
 * cell and coloured by class. Legend entries filter to one class; hovering a cell reads out its counts.
 */
export function UnitMatrix({
  title,
  classes,
  columns,
  columnGroups,
  rowGroups,
  perCell,
  unit,
  caption,
}: {
  title: string;
  classes: MatrixClass[];
  columns: MatrixColumn[];
  columnGroups: MatrixColumnGroup[];
  rowGroups: MatrixRowGroup[];
  perCell: number;
  /** Singular noun for one square, e.g. "article". */
  unit: string;
  caption?: string;
}) {
  const [ref, measured] = useWidth<HTMLDivElement>(912);
  const [only, setOnly] = useState<string | null>(null);
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);

  const width = Math.max(measured, 780);
  const lines = Math.ceil(perCell / PER_LINE);
  const colW = (width - LABEL_W - GROUP_GAP * (columnGroups.length - 1)) / columns.length;
  const size = Math.max(3, Math.floor((colW - COL_GAP - UNIT_GAP * (PER_LINE - 1)) / PER_LINE));
  const cellW = size * PER_LINE + UNIT_GAP * (PER_LINE - 1);
  const cellH = size * lines + UNIT_GAP * (lines - 1);

  // Left edge of every column, with a wider gap between column groups.
  const colX: number[] = [];
  let ci = 0;
  columnGroups.forEach((g, gi) => {
    for (let k = 0; k < g.span; k++, ci++) colX.push(LABEL_W + ci * colW + gi * GROUP_GAP + (colW - cellW) / 2);
  });

  const rows = rowGroups.flatMap((g, gi) => g.rows.map((row, k) => ({ ...row, gi, first: k === 0 })));
  const rowY: number[] = [];
  let y = HEAD_H;
  rows.forEach((row) => {
    if (row.first) y += GROUP_HEAD_H + (row.gi > 0 ? 8 : 0);
    rowY.push(y);
    y += cellH + ROW_GAP;
  });
  const height = y;

  const toneOf = Object.fromEntries(classes.map((c) => [c.key, c.tone]));
  const totals = Object.fromEntries(classes.map((c) => [c.key, 0]));
  rows.forEach((row) => {
    for (const ch of row.cells) totals[ch]++;
  });

  const cell = (r: number, c: number) => rows[r].cells.slice(c * perCell, (c + 1) * perCell);
  const hovered = hover ? cell(hover.r, hover.c) : '';

  // The 1,200 squares depend on layout and the class filter only, so hovering does not re-render them.
  const cells = useMemo(
    () =>
      rows.map((row, r) =>
        columns.map((col, c) => (
          <g key={col.label} className="viz-pop" style={delay(c * 24 + r * 16)}>
            {[...row.cells.slice(c * perCell, (c + 1) * perCell)].map((ch, k) => (
              <rect
                key={k}
                x={colX[c] + (k % PER_LINE) * (size + UNIT_GAP)}
                y={rowY[r] + Math.floor(k / PER_LINE) * (size + UNIT_GAP)}
                width={size}
                height={size}
                rx={1.5}
                fill={tone(toneOf[ch])}
                opacity={only === null || only === ch ? 1 : 0.12}
                style={{ transition: 'opacity 200ms' }}
              />
            ))}
            <rect
              x={colX[c] - COL_GAP / 2}
              y={rowY[r] - ROW_GAP / 2}
              width={cellW + COL_GAP}
              height={cellH + ROW_GAP}
              fill="transparent"
              onMouseEnter={() => setHover({ r, c })}
            />
          </g>
        ))
      ),
    // colX, rowY, size and the cell box all follow from width and the data props below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, only, rowGroups, columns, columnGroups, classes, perCell]
  );

  return (
    <Figure title={title} caption={caption}>
      <ul className="-mx-2 flex flex-wrap gap-x-2 gap-y-1 text-sm" aria-label="Show one class">
        {classes.map((c) => (
          <li key={c.key}>
            <button
              type="button"
              aria-pressed={only === c.key}
              onClick={() => setOnly(only === c.key ? null : c.key)}
              className={clsx(
                'flex items-center gap-2 rounded px-2 py-1 transition-colors duration-150',
                only === null || only === c.key ? 'text-ink-2 hover:text-ink' : 'text-muted hover:text-ink'
              )}
            >
              <Swatch tone={c.tone} />
              {c.label}
              <span className="tabular text-muted">{totals[c.key].toLocaleString('en-US')}</span>
            </button>
          </li>
        ))}
      </ul>

      <div ref={ref} className="mt-2 overflow-x-auto overflow-y-hidden">
        <div className="relative" style={{ width }}>
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="block"
            role="img"
            aria-label={`${title} ${classes.map((c) => `${totals[c.key]} ${c.label.toLowerCase()}`).join(', ')}.`}
            onMouseLeave={() => setHover(null)}
          >
            {(() => {
              let start = 0;
              return columnGroups.map((g) => {
                const from = colX[start];
                const to = colX[start + g.span - 1] + cellW;
                start += g.span;
                return (
                  <g key={g.label}>
                    <text x={(from + to) / 2} y={12} textAnchor="middle" fontSize="12" fill="rgb(var(--ink-2))">
                      {g.label}
                    </text>
                    <line x1={from} x2={to} y1={19} y2={19} stroke="rgb(var(--rule))" />
                  </g>
                );
              });
            })()}
            {columns.map((col, c) => (
              <text
                key={col.label}
                x={colX[c] + cellW / 2}
                y={34}
                textAnchor="middle"
                fontSize={colW < 30 ? 9.5 : 11}
                fill={hover?.c === c ? 'rgb(var(--ink))' : 'rgb(var(--muted))'}
                className="tabular"
              >
                {col.label}
              </text>
            ))}

            {rows.map((row, r) => (
              <g key={row.label}>
                {row.first ? (
                  <text x={0} y={rowY[r] - 9} fontSize="12" fill="rgb(var(--muted))">
                    {rowGroups[row.gi].label}
                  </text>
                ) : null}
                <text
                  x={LABEL_W - 12}
                  y={rowY[r] + cellH / 2}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontSize="13"
                  fill={hover?.r === r ? 'rgb(var(--ink))' : 'rgb(var(--ink-2))'}
                >
                  {row.label}
                </text>
                {cells[r]}
              </g>
            ))}

            {hover ? (
              <rect
                x={colX[hover.c] - 3}
                y={rowY[hover.r] - 3}
                width={cellW + 6}
                height={cellH + 6}
                rx={3}
                fill="none"
                stroke="rgb(var(--ink))"
                strokeWidth={1.25}
                pointerEvents="none"
              />
            ) : null}
          </svg>

          {hover ? (
            <Tooltip
              x={((colX[hover.c] + cellW / 2) / width) * 100}
              // Rows in the lower half open upwards: a readout hanging below the chart would overflow the
              // scroll container, add scrollbars and resize the chart under the cursor.
              {...(hover.r >= rows.length / 2
                ? { bottom: height - rowY[hover.r] + 10 }
                : { top: rowY[hover.r] + cellH + 10 })}
              flip={hover.c > columns.length / 2}
            >
              <p className="font-semibold text-ink">
                {rows[hover.r].label}, {columns[hover.c].label}
              </p>
              <p className="mt-0.5">{columns[hover.c].title}</p>
              <p className="tabular mt-1.5 flex flex-wrap gap-x-3">
                {classes.map((c) => {
                  const n = [...hovered].filter((ch) => ch === c.key).length;
                  return n ? (
                    <span key={c.key} className="flex items-center gap-1.5">
                      <Swatch tone={c.tone} />
                      {n} {c.label.toLowerCase()}
                    </span>
                  ) : null;
                })}
              </p>
              <p className="mt-1 text-muted">
                of {perCell} {unit}s
              </p>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </Figure>
  );
}
