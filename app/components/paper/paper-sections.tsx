import type { ReactNode } from 'react';
import type { PaperFigure, PaperFinding, PaperStat, PaperTable, PaperViz } from 'app/data/papers';
import {
  Architecture,
  BarChart,
  BiasPipeline,
  Bubble,
  ClaimRanking,
  ColumnChart,
  CompositionBars,
  DotPlot,
  Dumbbell,
  Flow,
  GroupedBars,
  GroupList,
  Heatmap,
  Histogram,
  LineChart,
  PairedBars,
  Pipeline,
  PromptTabs,
  Scatter,
  ScoreTable,
  ShareTable,
  StackedBars,
  UnitMatrix,
} from './viz';

/** Major section of a paper page: a hairline, then a heading one step above the site's section headings. */
function PaperSection({ title, id, children }: { title: string; id: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-16 scroll-mt-8 border-t border-rule pt-10">
      <h2 className="mb-6 text-[1.375rem] font-semibold leading-tight tracking-tight text-ink">{title}</h2>
      {children}
    </section>
  );
}

export function PaperFigureBlock({ figure }: { figure: PaperFigure }) {
  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={figure.src} alt={figure.alt} className={figure.plain ? 'w-full dark:rounded dark:bg-white dark:p-3' : 'w-full rounded border border-rule bg-white'} loading="lazy" />
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">{figure.caption}</figcaption>
    </figure>
  );
}

export function Viz({ viz }: { viz: PaperViz }) {
  switch (viz.type) {
    case 'bars':
      return <BarChart {...viz} />;
    case 'pipeline':
      return <Pipeline {...viz} />;
    case 'stacked':
      return <StackedBars {...viz} />;
    case 'prompts':
      return <PromptTabs {...viz} />;
    case 'groups':
      return <GroupList {...viz} />;
    case 'lines':
      return <LineChart {...viz} />;
    case 'grouped':
      return <GroupedBars {...viz} />;
    case 'dumbbell':
      return <Dumbbell {...viz} />;
    case 'shares':
      return <ShareTable {...viz} />;
    case 'matrix':
      return <UnitMatrix {...viz} />;
    case 'dots':
      return <DotPlot {...viz} />;
    case 'columns':
      return <ColumnChart {...viz} />;
    case 'histogram':
      return <Histogram {...viz} />;
    case 'composition':
      return <CompositionBars {...viz} />;
    case 'bubble':
      return <Bubble {...viz} />;
    case 'scatter':
      return <Scatter {...viz} />;
    case 'paired':
      return <PairedBars {...viz} />;
    case 'scores':
      return <ScoreTable {...viz} />;
    case 'heatmap':
      return <Heatmap {...viz} />;
    case 'architecture':
      return <Architecture {...viz} />;
    case 'image':
      return <PaperFigureBlock figure={viz} />;
    case 'flow':
      return <Flow {...viz} />;
    case 'bias-pipeline':
      return <BiasPipeline {...viz} />;
    case 'claims':
      return <ClaimRanking {...viz} />;
  }
}

/** The study in numbers, set as one quiet row rather than a banner. */
export function StatStrip({ stats }: { stats: PaperStat[] }) {
  return (
    <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse justify-end">
          <dt className="mt-0.5 text-sm leading-snug text-muted">{s.label}</dt>
          <dd className="tabular text-xl font-semibold tracking-tight text-ink">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Overview({ paragraphs, approach }: { paragraphs?: string[]; approach?: PaperViz[] }) {
  return (
    <PaperSection title="Overview" id="overview">
      {paragraphs?.length ? (
        <div className="space-y-4 text-ink-2">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : null}
      {approach?.map((viz) => (
        <div key={viz.type === 'image' ? viz.src : viz.title} className="mt-10">
          <Viz viz={viz} />
        </div>
      ))}
    </PaperSection>
  );
}

/**
 * Numbered findings. Each one opens with a hairline and a numbered marker (the same ring as the stages of
 * the approach diagram), so the list reads as separate claims; an index above links to each of them.
 */
export function Findings({ findings }: { findings: PaperFinding[] }) {
  return (
    <PaperSection title="Findings" id="findings">
      <nav aria-label="Findings">
        <ol className="gap-x-10 space-y-1.5 text-[0.9375rem] sm:columns-2">
          {findings.map((f, i) => (
            <li key={f.title} className="break-inside-avoid">
              <a
                href={`#finding-${i + 1}`}
                className="group grid grid-cols-[1.5rem_1fr] rounded text-ink-2 transition-colors duration-150 hover:text-accent"
              >
                <span className="tabular text-muted transition-colors duration-150 group-hover:text-accent">{i + 1}</span>
                {f.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <ol className="mt-12">
        {findings.map((f, i) => (
          <li key={f.title} id={`finding-${i + 1}`} className="scroll-mt-6 border-t border-rule py-12 last:pb-0">
            <div className="grid grid-cols-[2.75rem_1fr] items-start">
              <span
                aria-hidden
                className="tabular flex h-8 w-8 items-center justify-center rounded-full border border-ink text-sm font-semibold text-ink"
              >
                {i + 1}
              </span>
              <h3 className="text-balance text-[1.3125rem] font-semibold leading-8 tracking-tight text-ink">
                <span className="sr-only">Finding {i + 1}: </span>
                {f.title}
              </h3>
            </div>
            <div className="min-w-0 sm:pl-[2.75rem]">
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink">{f.summary}</p>
              {f.body?.length ? (
                <div className="mt-4 space-y-3 text-ink-2">
                  {f.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              ) : null}
              {f.viz?.length || f.figures?.length ? (
                <div className="mt-8">
                  {f.viz?.map((v, j) => <Viz key={j} viz={v} />)}
                  {f.figures?.map((fig) => <PaperFigureBlock key={fig.src} figure={fig} />)}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </PaperSection>
  );
}

export function Tables({ tables }: { tables: PaperTable[] }) {
  return (
    <PaperSection title="Results" id="results">
      <div className="space-y-10">
        {tables.map((t) => (
          <div key={t.title}>
            <h3 className="font-semibold text-ink">{t.title}</h3>
            {/*
              The global table rule in global.css makes tables a nowrap scroll box; paper tables override it so
              cells wrap and a wide table never brings in scrollbars.
            */}
            <div className="mt-3">
              <table className="tabular table w-full max-w-none overflow-visible whitespace-normal break-words border-collapse text-left text-[0.8125rem] sm:text-sm">
                <thead>
                  <tr className="border-b border-rule text-muted">
                    {t.columns.map((c) => (
                      <th key={c} className="py-2 pr-3 align-bottom font-normal last:pr-0 sm:pr-6 sm:last:pr-0">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r, i) => (
                    <tr key={i} className="border-b border-rule text-ink-2">
                      {r.map((cell, j) => (
                        <td key={j} className={`py-2 pr-3 align-top last:pr-0 sm:pr-6 sm:last:pr-0${j === 0 ? ' text-ink' : ''}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {t.caption ? <p className="mt-3 text-sm leading-relaxed text-muted">{t.caption}</p> : null}
          </div>
        ))}
      </div>
    </PaperSection>
  );
}

export function FigureGallery({ figures }: { figures: PaperFigure[] }) {
  return (
    <PaperSection title="Figures" id="figures">
      {figures.map((fig) => (
        <PaperFigureBlock key={fig.src} figure={fig} />
      ))}
    </PaperSection>
  );
}

export function CiteBlock({ bibtex }: { bibtex: string }) {
  return (
    <PaperSection title="Cite" id="cite">
      <pre className="overflow-x-auto rounded border border-rule bg-subtle p-4 text-[0.8125rem] leading-relaxed text-ink-2">
        {bibtex}
      </pre>
    </PaperSection>
  );
}

export function ComingSoon({ children }: { children: ReactNode }) {
  return (
    <p className="mt-12 rounded border border-dashed border-rule px-4 py-6 text-sm text-muted">{children}</p>
  );
}
