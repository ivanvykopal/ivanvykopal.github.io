import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DatedRow, PageTitle, Section } from 'app/components/section';
import { PrintButton } from './print-button';

export const metadata: Metadata = {
  title: 'CV',
  description: 'Curriculum vitae of Ivan Vykopal: research experience, education and skills.',
};

const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="link">
    {children}
  </a>
);

const KINIT = { name: 'Kempelen Institute of Intelligent Technologies (KInIT)', url: 'https://kinit.sk/' };

const projectLink = {
  disaiAmplified: 'https://kinit.sk/project/disai-amplified/',
  disai: 'https://kinit.sk/project/disai-improving-scientific-excellence-of-kinit/',
  exu: 'https://kinit.sk/project/exu-ai-models-for-examining-multilingual-disinformation-narratives-and-understanding-their-spread/',
  veraai: 'https://kinit.sk/project/vera-ai-verification-assisted-by-artificial-intelligence/',
  cedmo: 'https://kinit.sk/project/cedmo-central-european-digital-media-observatory/',
};

type Role = {
  dates: string;
  title: string;
  org: { name: string; url: string };
  meta: string;
  points: ReactNode[];
};

const experience: Role[] = [
  {
    dates: 'Nov 2026 – now',
    title: 'Junior Researcher',
    org: KINIT,
    meta: 'Bratislava, Slovakia · Full-time',
    points: [
      'Research on building, transferring and evaluating multilingual fact-checking systems with large language models: claim detection, previously fact-checked claim retrieval and claim normalization.',
      'Improving fact-checking for low-resource languages, including Slovak, through cross-lingual transfer and parameter-efficient fine-tuning.',
      'Evaluating the risks and reliability of LLMs: disinformation generation, and the source credibility and groundedness of web-search chat assistants.',
      'Publishing at ACL, NAACL, EMNLP and EACL; reviewing for ACL Rolling Review and LowResNLP.',
    ],
  },
  {
    dates: 'Jun 2023 – Oct 2026',
    title: 'Research Assistant',
    org: KINIT,
    meta: 'Bratislava, Slovakia · Full-time',
    points: [
      'Research in multilingual NLP for fact-checking, with a focus on low-resource languages.',
      'Developed fact-checking methods and analysed how well large language models handle fact-checking tasks.',
      'Member of the winning team at CLEF 2025 CheckThat! Task 2 (claim normalization), ranking 1st in 13 of 20 languages.',
      <>
        Worked on the <Ext href={projectLink.disaiAmplified}>DisAI-AMPLIFIED</Ext>, <Ext href={projectLink.disai}>DisAI</Ext> and{' '}
        <Ext href={projectLink.exu}>ExU</Ext> projects.
      </>,
    ],
  },
  {
    dates: 'Jun – Jul 2024',
    title: 'Visiting Researcher',
    org: { name: 'German Research Center for Artificial Intelligence (DFKI)', url: 'https://www.dfki.de/' },
    meta: 'Saarbrücken, Germany · Research visit',
    points: [
      <>
        Four-week research stay on multilingual NLP, low-resource settings and fact-checking, as part of the{' '}
        <Ext href={projectLink.disai}>DisAI</Ext> project.
      </>,
    ],
  },
  {
    dates: 'Sep 2022 – Jun 2023',
    title: 'Research Intern',
    org: KINIT,
    meta: 'Bratislava, Slovakia · Part-time',
    points: [
      'Ran experiments evaluating how large language models can be misused to spread disinformation.',
      <>
        Worked on the <Ext href={projectLink.veraai}>veraAI</Ext> and <Ext href={projectLink.cedmo}>CEDMO</Ext> projects.
      </>,
    ],
  },
  {
    dates: 'Feb – Aug 2022',
    title: 'Full Stack Developer',
    org: { name: 'iteria.io', url: 'https://iteria.app/' },
    meta: 'Bratislava, Slovakia · Part-time',
    points: [],
  },
];

const education = [
  {
    dates: 'Sep 2023 – now',
    degree: 'PhD in Informatics',
    school: 'Faculty of Information Technology, Brno University of Technology',
    url: 'https://www.fit.vut.cz/.en',
    meta: 'Brno, Czech Republic',
    note: 'Thesis topic: Multilingual Natural Language Processing for Supporting Fact-Checking.',
  },
  {
    dates: 'Sep 2021 – Jun 2023',
    degree: 'MSc in Computer Science',
    school: 'Faculty of Informatics and Information Technologies, Slovak University of Technology',
    url: 'https://www.fiit.stuba.sk/en',
    meta: 'Bratislava, Slovakia',
    note: 'Thesis: deep neural networks for medical image segmentation to support the diagnosis of cardiac transplant rejection.',
  },
  {
    dates: 'Sep 2018 – Jun 2021',
    degree: 'BSc in Computer Science',
    school: 'Faculty of Informatics and Information Technologies, Slovak University of Technology',
    url: 'https://www.fiit.stuba.sk/en',
    meta: 'Bratislava, Slovakia',
    note: 'Thesis: Graph coloring in program analysis.',
  },
];

const skills: { label: string; items: string }[] = [
  {
    label: 'Research',
    items:
      'Natural language processing, large language models, fact-checking, low-resource languages, machine learning, deep learning, computer vision, image processing, data analysis and visualization',
  },
  { label: 'Programming', items: 'Python, JavaScript, TypeScript, C, C++, Java, R, SQL, Bash, MATLAB, HTML, CSS, XML' },
  { label: 'ML frameworks', items: 'PyTorch, Hugging Face Transformers, TensorFlow' },
  { label: 'Web', items: 'React, Next.js, Svelte, Node.js, Express, Flask, Django' },
  {
    label: 'Data and tools',
    items: 'Git, Docker, Kubernetes, Linux, Elasticsearch, PostgreSQL, PostGIS, MongoDB, Neo4j, GraphQL',
  },
  { label: 'Languages', items: 'Slovak (native), English (B2)' },
];

export default function Page() {
  return (
    <>
      <PageTitle
        intro={
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
            <p>Junior Researcher at KInIT and PhD student at Brno University of Technology.</p>
            <PrintButton />
          </div>
        }
      >
        Curriculum vitae
      </PageTitle>

      <Section title="Experience">
        <ol className="space-y-8">
          {experience.map((r) => (
            <li key={r.dates + r.title}>
              <DatedRow wide date={r.dates}>
                <h3 className="font-semibold leading-6 text-ink">{r.title}</h3>
                <p className="text-ink-2">
                  <Ext href={r.org.url}>{r.org.name}</Ext>
                </p>
                <p className="text-sm text-muted">{r.meta}</p>
                {r.points.length ? (
                  <ul className="mt-3 space-y-1.5 text-[0.9375rem] text-ink-2">
                    {r.points.map((pt, i) => (
                      <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted">
                        {pt}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </DatedRow>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Education">
        <ol className="space-y-7">
          {education.map((e) => (
            <li key={e.dates}>
              <DatedRow wide date={e.dates}>
                <h3 className="font-semibold leading-6 text-ink">{e.degree}</h3>
                <p className="text-ink-2">
                  <Ext href={e.url}>{e.school}</Ext>
                </p>
                <p className="text-sm text-muted">{e.meta}</p>
                <p className="mt-2 text-[0.9375rem] text-ink-2">{e.note}</p>
              </DatedRow>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Awards and service">
        <ul className="space-y-3">
          <li>
            <DatedRow wide date="2025">
              <p className="text-ink-2">
                Winning team, CLEF 2025 CheckThat! Task 2 on claim normalization: 1st in 13 of 20 languages, 2nd or 3rd in the
                rest.
              </p>
            </DatedRow>
          </li>
          <li>
            <DatedRow wide date="Reviewing">
              <p className="text-ink-2">ACL Rolling Review, LowResNLP workshop.</p>
            </DatedRow>
          </li>
          <li>
            <DatedRow wide date="2026">
              <p className="text-ink-2">Volunteer at EACL 2026.</p>
            </DatedRow>
          </li>
          <li>
            <DatedRow wide date="2025">
              <p className="text-ink-2">Participant, Eastern European Machine Learning Summer School (EEML).</p>
            </DatedRow>
          </li>
          <li>
            <DatedRow wide date="Press">
              <p className="text-ink-2">Interviewed by MIT Technology Review Germany on AI-driven disinformation in elections.</p>
            </DatedRow>
          </li>
        </ul>
      </Section>

      <Section title="Skills">
        <dl className="space-y-3">
          {skills.map((s) => (
            <div key={s.label} className="grid gap-x-6 sm:grid-cols-[9.5rem_1fr]">
              <dt className="text-sm leading-6 text-muted">{s.label}</dt>
              <dd className="text-[0.9375rem] text-ink-2">{s.items}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
