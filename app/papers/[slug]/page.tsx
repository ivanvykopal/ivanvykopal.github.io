import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ME } from 'app/data/publications';
import { getPaper, papers } from 'app/data/papers';
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
  const links = [
    { label: 'Paper', href: pub.url },
    pub.pdf && pub.pdf !== pub.url ? { label: 'PDF', href: pub.pdf } : null,
    pub.code ? { label: 'Code', href: pub.code } : null,
    pub.post ? { label: 'Blog post', href: pub.post, internal: true } : null,
    paper.bibtex ? { label: 'Cite', href: '#cite', internal: true } : null,
  ].filter(Boolean) as { label: string; href: string; internal?: boolean }[];

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
        <h1 className="mt-2 max-w-[42rem] text-[1.75rem] font-semibold leading-tight tracking-tight text-ink">
          {pub.title}
        </h1>
        {paper.tagline ? <p className="mt-3 max-w-[40rem] text-ink-2">{paper.tagline}</p> : null}
        <p className="mt-4 max-w-[42rem] text-[0.9375rem] leading-relaxed text-ink-2">
          {pub.authors.map((name, i) => (
            <span key={name}>
              {name === ME ? <span className="font-semibold text-ink">{name}</span> : name}
              {i < pub.authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
        {paper.affiliations?.length ? (
          <p className="mt-1 max-w-[42rem] text-sm text-muted">{paper.affiliations.join(' · ')}</p>
        ) : null}
        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[0.9375rem]">
          {links.map(({ label, href, internal }) =>
            internal ? (
              <Link key={label} href={href} className="link">
                {label}
              </Link>
            ) : (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="link">
                {label}
              </a>
            )
          )}
        </p>
      </header>

      {paper.tldr ? (
        <p className="mt-10 max-w-[40rem] border-l-2 border-accent pl-4 text-[1.0625rem] leading-relaxed text-ink">
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
