import type { Metadata } from 'next';
import { PageTitle } from 'app/components/section';
import { PublicationEntry } from 'app/components/publication';
import { isFirstAuthor, publications } from 'app/data/publications';

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Publications by Ivan Vykopal on multilingual fact-checking, low-resource languages and large language models.',
};

export default function Page() {
  const years = Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a);
  const firstAuthor = publications.filter(isFirstAuthor).length;

  return (
    <>
      <PageTitle
        intro={
          <p>
            {publications.length} papers, {firstAuthor} as first author. Also on{' '}
            <a className="link" href="https://scholar.google.com/citations?user=HgsKgYAAAAAJ" target="_blank" rel="noopener noreferrer">
              Google Scholar
            </a>{' '}
            and{' '}
            <a className="link" href="https://orcid.org/0000-0002-0431-0044" target="_blank" rel="noopener noreferrer">
              ORCID
            </a>
            .
          </p>
        }
      >
        Publications
      </PageTitle>

      <div className="space-y-14">
        {years.map((year) => (
          <section key={year} aria-labelledby={`y${year}`} className="grid gap-x-6 gap-y-5 sm:grid-cols-[6.5rem_1fr]">
            <h2 id={`y${year}`} className="tabular text-lg font-semibold text-ink sm:sticky sm:top-6 sm:self-start">
              {year}
            </h2>
            <ol className="max-w-[46rem] space-y-8">
              {publications
                .filter((p) => p.year === year)
                .map((pub, i) => (
                  <li key={pub.title}>
                    <PublicationEntry pub={pub} id={`p${year}-${i}`} />
                  </li>
                ))}
            </ol>
          </section>
        ))}
      </div>
    </>
  );
}
