import type { ReactNode } from 'react';
import type { PaperFigure, PaperFinding, PaperStat, PaperTable, PaperViz } from 'app/data/papers';
import {
  BarChart,
  Dumbbell,
  GroupedBars,
  GroupList,
  LineChart,
  Pipeline,
  PromptTabs,
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
      <img src={figure.src} alt={figure.alt} className="w-full rounded border border-rule bg-white" loading="lazy" />
      <figcaption className="mt-3 max-w-[44rem] text-sm leading-relaxed text-muted">{figure.caption}</figcaption>
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
    case 'matrix':
      return <UnitMatrix {...viz} />;
  }
}

/** The study in numbers, set as one quiet row rather than a banner. */
export function StatStrip({ stats }: { stats: PaperStat[] }) {
  return (
    <dl className="mt-8 grid max-w-[44rem] grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse justify-end">
          <dt className="mt-0.5 text-sm leading-snug text-muted">{s.label}</dt>
          <dd className="tabular text-xl font-semibold tracking-tight text-ink">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Overview({ paragraphs, approach }: { paragraphs?: string[]; approach?: PaperViz }) {
  return (
    <PaperSection title="Overview" id="overview">
      {paragraphs?.length ? (
        <div className="max-w-[44rem] space-y-4 text-ink-2">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : null}
      {approach ? (
        <div className="mt-10">
          <Viz viz={approach} />
        </div>
      ) : null}
    </PaperSection>
  );
}

export function Findings({ findings }: { findings: PaperFinding[] }) {
  return (
    <PaperSection title="Findings" id="findings">
      <ol className="space-y-16">
        {findings.map((f, i) => (
          <li key={f.title} id={`finding-${i + 1}`} className="grid scroll-mt-8 gap-x-5 sm:grid-cols-[1.75rem_1fr]">
            <span aria-hidden className="tabular text-[1.1875rem] font-semibold leading-7 text-muted">
              {i + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-balance text-[1.1875rem] font-semibold leading-7 tracking-tight text-ink">{f.title}</h3>
              <div className="max-w-[44rem]">
                <p className="mt-2 text-ink">{f.summary}</p>
                {f.body?.length ? (
                  <div className="mt-3 space-y-3 text-ink-2">
                    {f.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                ) : null}
              </div>
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
            <div className="mt-3 overflow-x-auto">
              <table className="tabular w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-rule text-muted">
                    {t.columns.map((c) => (
                      <th key={c} className="py-2 pr-6 font-normal">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r, i) => (
                    <tr key={i} className="border-b border-rule text-ink-2">
                      {r.map((cell, j) => (
                        <td key={j} className={j === 0 ? 'py-2 pr-6 text-ink' : 'py-2 pr-6'}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {t.caption ? <p className="mt-3 max-w-[44rem] text-sm leading-relaxed text-muted">{t.caption}</p> : null}
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
