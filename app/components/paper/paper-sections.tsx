import type { ReactNode } from 'react';
import type { PaperFigure, PaperFinding, PaperStat, PaperTable, PaperViz } from 'app/data/papers';
import { Section } from '../section';
import { BarChart, CountUp, GroupExplorer, LineChart, Pipeline, PromptTabs, Reveal, StackedBars } from './viz';

export function PaperFigureBlock({ figure }: { figure: PaperFigure }) {
  return (
    <Reveal>
      <figure className="my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={figure.src}
          alt={figure.alt}
          className="w-full rounded border border-rule bg-white"
          loading="lazy"
        />
        <figcaption className="mt-2 text-sm leading-relaxed text-muted">{figure.caption}</figcaption>
      </figure>
    </Reveal>
  );
}

function Viz({ viz }: { viz: PaperViz }) {
  switch (viz.type) {
    case 'bars':
      return <BarChart title={viz.title} items={viz.items} max={viz.max} unit={viz.unit} />;
    case 'pipeline':
      return <Pipeline title={viz.title} steps={viz.steps} />;
    case 'stacked':
      return <StackedBars title={viz.title} segments={viz.segments} rows={viz.rows} note={viz.note} />;
    case 'prompts':
      return <PromptTabs title={viz.title} tabs={viz.tabs} />;
    case 'groups':
      return <GroupExplorer title={viz.title} groups={viz.groups} />;
    case 'lines':
      return <LineChart title={viz.title} categories={viz.categories} datasets={viz.datasets} />;
  }
}

export function StatStrip({ stats }: { stats: PaperStat[] }) {
  return (
    <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded border border-rule bg-rule sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse justify-end bg-page px-4 py-4">
          <dt className="mt-1 text-sm leading-snug text-muted">{s.label}</dt>
          <dd className="tabular text-2xl font-semibold tracking-tight text-ink">
            <CountUp value={s.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Overview({ paragraphs, approach }: { paragraphs?: string[]; approach?: PaperViz }) {
  return (
    <Section title="Overview" id="overview">
      {paragraphs?.length ? (
        <div className="space-y-4 text-ink-2">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : null}
      {approach ? <Viz viz={approach} /> : null}
    </Section>
  );
}

export function Findings({ findings }: { findings: PaperFinding[] }) {
  return (
    <Section title="Findings" id="findings">
      <ol className="space-y-14">
        {findings.map((f, i) => (
          <li key={f.title} className="grid gap-x-6 sm:grid-cols-[2rem_1fr]">
            <span className="tabular text-sm font-semibold leading-7 text-muted">{i + 1}</span>
            <div className="min-w-0">
              <Reveal>
                <h3 className="text-[1.0625rem] font-semibold leading-7 tracking-tight text-ink">{f.title}</h3>
                <p className="mt-1 font-medium text-ink-2">{f.summary}</p>
                {f.body?.length ? (
                  <div className="mt-3 space-y-3 text-ink-2">
                    {f.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                ) : null}
              </Reveal>
              {f.viz?.map((v, j) => <Viz key={j} viz={v} />)}
              {f.figures?.map((fig) => <PaperFigureBlock key={fig.src} figure={fig} />)}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Tables({ tables }: { tables: PaperTable[] }) {
  return (
    <Section title="Results" id="results">
      <div className="space-y-10">
        {tables.map((t) => (
          <div key={t.title}>
            <h3 className="font-semibold text-ink">{t.title}</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="tabular w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-rule text-muted">
                    {t.columns.map((c) => (
                      <th key={c} className="py-2 pr-4 font-medium">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r, i) => (
                    <tr key={i} className="border-b border-rule text-ink-2">
                      {r.map((cell, j) => (
                        <td key={j} className="py-2 pr-4">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {t.caption ? <p className="mt-2 text-sm text-muted">{t.caption}</p> : null}
          </div>
        ))}
      </div>
    </Section>
  );
}

export function FigureGallery({ figures }: { figures: PaperFigure[] }) {
  return (
    <Section title="Figures" id="figures">
      {figures.map((fig) => (
        <PaperFigureBlock key={fig.src} figure={fig} />
      ))}
    </Section>
  );
}

export function CiteBlock({ bibtex }: { bibtex: string }) {
  return (
    <Section title="Cite" id="cite">
      <pre className="overflow-x-auto rounded border border-rule bg-subtle p-4 text-[0.8125rem] leading-relaxed text-ink-2">
        {bibtex}
      </pre>
    </Section>
  );
}

export function ComingSoon({ children }: { children: ReactNode }) {
  return (
    <p className="mt-12 rounded border border-dashed border-rule px-4 py-6 text-sm text-muted">{children}</p>
  );
}
