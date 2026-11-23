import type { Metadata } from 'next';
import Link from 'next/link';
import { papers, resolvePaper } from 'app/data/papers';
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
        {items.map(({ slug, pub, tagline }) => (
          <li key={slug}>
            <DatedRow date={pub.venue}>
              <Link href={`/papers/${slug}`} className="group block">
                <h2 className="font-semibold leading-6 text-ink transition-colors group-hover:text-accent">
                  {pub.title}
                </h2>
                <p className="mt-1 text-[0.9375rem] text-ink-2">{tagline ?? pub.authors.join(', ')}</p>
              </Link>
            </DatedRow>
          </li>
        ))}
      </ol>
    </>
  );
}
