import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ME } from 'app/data/publications';
import { getPaper, papers } from 'app/data/papers';
import { PaperActions } from 'app/components/paper/paper-actions';
import {
  CiteBlock,
  ComingSoon,
  FigureGallery,
  Findings,
  Overview,
  StatStrip,
  Tables,
} from 'app/components/paper/paper-sections';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return papers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const paper = getPaper((await params).slug);
  if (!paper) return {};
  return { title: paper.pub.title, description: paper.tagline ?? paper.tldr ?? paper.pub.abstract.slice(0, 160) };
}

export default async function PaperPage({ params }: { params: Promise<Params> }) {
  const paper = getPaper((await params).slug);
  if (!paper) notFound();

  const { pub } = paper;
  const hasContent = Boolean(
    paper.tldr || paper.stats?.length || paper.overview?.length || paper.approach ||
      paper.findings?.length || paper.tables?.length || paper.figures?.length || paper.bibtex
  );

  return (
    <article>
      <p className="text-sm">
        <Link href="/papers" className="link">
          ← All papers
        </Link>
      </p>

      <header className="mt-6">
        <p className="text-sm text-muted">
          {pub.venue} · {pub.venueNote}
        </p>
        <h1 className="mt-2 text-[1.75rem] font-semibold leading-tight tracking-tight text-ink">
          {pub.title}
        </h1>
        {paper.tagline ? <p className="mt-3 text-ink-2">{paper.tagline}</p> : null}
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[1rem] leading-snug text-ink-2">
          {pub.authors.map((name) => {
            const marks = paper.authorAffiliations?.[name]?.join(',');
            const equal = paper.equalContribution?.includes(name);
            return (
              <li key={name}>
                <span className={name === ME ? 'font-semibold text-ink' : undefined}>{name}</span>
                {marks || equal ? (
                  <sup className="ml-0.5 text-xs text-muted">
                    {marks}
                    {equal ? '*' : ''}
                  </sup>
                ) : null}
              </li>
            );
          })}
        </ul>
        {paper.affiliations?.length ? (
          <ol className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            {paper.affiliations.map((a, i) => (
              <li key={a}>
                <sup className="mr-1">{i + 1}</sup>
                {a}
              </li>
            ))}
          </ol>
        ) : null}
        {paper.equalContribution?.length ? <p className="mt-1 text-sm text-muted">* Equal contribution</p> : null}
        <PaperActions pub={pub} bibtex={paper.bibtex} />
      </header>

      {paper.tldr ? (
        <p className="mt-10 border-l-2 border-accent pl-4 text-[1.0625rem] leading-relaxed text-ink">
          {paper.tldr}
        </p>
      ) : null}
      {paper.stats?.length ? <StatStrip stats={paper.stats} /> : null}

      <div className="mt-16">
        {paper.overview?.length || paper.approach ? <Overview paragraphs={paper.overview} approach={paper.approach} /> : null}
        {paper.findings?.length ? <Findings findings={paper.findings} /> : null}
        {paper.tables?.length ? <Tables tables={paper.tables} /> : null}
        {paper.figures?.length ? <FigureGallery figures={paper.figures} /> : null}
        {paper.bibtex ? <CiteBlock bibtex={paper.bibtex} /> : null}
      </div>

      {!hasContent ? <ComingSoon>The summary for this paper is coming soon.</ComingSoon> : null}
    </article>
  );
}
