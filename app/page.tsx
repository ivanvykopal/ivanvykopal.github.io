import Image from 'next/image';
import Link from 'next/link';
import portrait from 'public/images/ivanvykopal.jpeg';
import { ProfileLinks } from './components/profile-links';
import { DatedRow, Section } from './components/section';
import { PublicationEntry } from './components/publication';
import { news } from './data/profile';
import { publications } from './data/publications';

const RECENT_NEWS = 6;

const strands = [
  {
    title: 'Claim detection and retrieval',
    text: 'finding claims worth checking and matching them to fact-checks that already exist, across languages.',
  },
  {
    title: 'Claim normalization',
    text: 'turning noisy social media posts into short, clear claims a fact-checker can verify.',
  },
  {
    title: 'Low-resource languages',
    text: 'closing the gap for languages like Slovak through cross-lingual transfer and parameter-efficient fine-tuning.',
  },
  {
    title: 'Risks of LLMs',
    text: 'how well LLMs generate disinformation, and how credible the sources and how grounded the answers of web-search chat assistants are.',
  },
];

function NewsList({ items }: { items: typeof news }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.text}>
          <DatedRow date={item.date}>
            <p className="text-ink-2">
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                  {item.text}
                </a>
              ) : (
                item.text
              )}
            </p>
          </DatedRow>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  const selected = publications.filter((p) => p.selected);

  return (
    <>
      <section className="grid gap-8 sm:grid-cols-[1fr_12rem] sm:gap-12">
        <div className="order-2 sm:order-1">
          <h1 className="text-[2rem] font-semibold leading-tight tracking-tight text-ink">
            Ivan Vykopal
          </h1>
          <p className="mt-1 text-ink-2">
            PhD student · Junior Researcher, NLP team at{' '}
            <a href="https://kinit.sk/" target="_blank" rel="noopener noreferrer" className="link">
              KInIT
            </a>
            , Bratislava
          </p>
          <p className="mt-6 max-w-[42rem] text-[1.0625rem] text-ink-2">
            I build and evaluate <strong className="font-semibold text-ink">multilingual fact-checking</strong> systems with
            large language models, with a focus on low-resource languages. I’m a Junior Researcher at the Kempelen Institute
            of Intelligent Technologies and a PhD student at Brno University of Technology.
          </p>
          <div className="mt-6">
            <ProfileLinks only={['email', 'scholar', 'github', 'linkedin']} />
          </div>
        </div>
        <Image
          src={portrait}
          alt="Portrait of Ivan Vykopal"
          priority
          sizes="192px"
          className="order-1 h-auto w-32 rounded-md sm:order-2 sm:w-full"
        />
      </section>

      <Section
        title="Selected publications"
        className="mt-14"
        action={
          <Link href="/research" className="link">
            All {publications.length} publications
          </Link>
        }
      >
        <ol className="space-y-7">
          {selected.map((pub, i) => (
            <li key={pub.title}>
              <PublicationEntry pub={pub} id={`sel-${i}`} compact />
            </li>
          ))}
        </ol>
      </Section>

      <Section title="News">
        <NewsList items={news.slice(0, RECENT_NEWS)} />
        {news.length > RECENT_NEWS ? (
          <details className="group/more mt-3">
            <summary className="link w-fit cursor-pointer list-none text-sm sm:ml-[8rem] [&::-webkit-details-marker]:hidden">
              <span className="group-open/more:hidden">Older news</span>
              <span className="hidden group-open/more:inline">Hide older news</span>
            </summary>
            <div className="mt-3">
              <NewsList items={news.slice(RECENT_NEWS)} />
            </div>
          </details>
        ) : null}
      </Section>

      <Section title="Research">
        <div className="max-w-[46rem] space-y-4 text-ink-2">
          <p>
            My PhD topic is <em>Multilingual Natural Language Processing for Supporting Fact-Checking</em>. Fact-checking
            resources are overwhelmingly English, yet misinformation spreads in every language, so fact-checkers working in
            smaller languages get the weakest tools. I work on:
          </p>
          <ul className="space-y-2">
            {strands.map((s) => (
              <li key={s.title} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted">
                <strong className="font-semibold text-ink">{s.title}:</strong> {s.text}
              </li>
            ))}
          </ul>
          <p>
            My work has appeared at ACL, NAACL, EMNLP and EACL, and our team won CLEF 2025 CheckThat! Task 2 on claim
            normalization. Before NLP, I used deep learning for medical image segmentation during my MSc at the Slovak
            University of Technology.
          </p>
        </div>
      </Section>

      <Section title="Press and service">
        <ul className="space-y-2 text-ink-2">
          <li>Interviewed by MIT Technology Review Germany on AI-driven disinformation in elections.</li>
          <li>Reviewer for ACL Rolling Review and the LowResNLP workshop.</li>
          <li>Volunteer at EACL 2026; participant at the Eastern European Machine Learning Summer School 2025.</li>
        </ul>
      </Section>
    </>
  );
}
