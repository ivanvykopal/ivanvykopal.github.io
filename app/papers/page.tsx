import type { Metadata } from 'next';
import Link from 'next/link';
import { HiArrowUpRight } from 'react-icons/hi2';
import { paperHref, papers, resolvePaper } from 'app/data/papers';
import { DatedRow, PageTitle } from 'app/components/section';

export const metadata: Metadata = {
  title: 'Papers',
  description: 'Summaries of my papers: key findings, figures and results.',
};

export default function PapersPage() {
  const items = papers.map(resolvePaper).sort((a, b) => b.pub.year - a.pub.year);

  return (
    <>
      <PageTitle intro={<p>One page per paper, with the key findings, figures and results.</p>}>Papers</PageTitle>
      <ol className="space-y-8">
        {items.map((paper) => {
          const { slug, pub, tagline, external } = paper;
          const body = (
            <>
              <h2 className="font-semibold leading-6 text-ink transition-colors group-hover:text-accent">
                {pub.title}
                {external ? (
                  <HiArrowUpRight aria-label="opens the paper's own site" className="ml-1 inline h-3.5 w-3.5 align-[-0.05em] text-muted transition-colors group-hover:text-accent" />
                ) : null}
              </h2>
              <p className="mt-1 text-[0.9375rem] text-ink-2">{tagline ?? pub.authors.join(', ')}</p>
            </>
          );
          return (
            <li key={slug}>
              <DatedRow date={pub.venue}>
                {external ? (
                  <a href={paperHref(paper)} className="group block">
                    {body}
                  </a>
                ) : (
                  <Link href={paperHref(paper)} className="group block">
                    {body}
                  </Link>
                )}
              </DatedRow>
            </li>
          );
        })}
      </ol>
    </>
  );
}
