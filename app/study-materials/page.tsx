import type { Metadata } from 'next';
import { HiArrowUpRight } from 'react-icons/hi2';
import { PageTitle } from 'app/components/section';

export const metadata: Metadata = {
  title: 'Study materials',
  description: 'Free courses and lecture series on machine learning, NLP and computer vision.',
};

type Material = { name: string; provider: string; format: 'Video lectures' | 'Course'; url: string };

const groups: { title: string; items: Material[] }[] = [
  {
    title: 'Machine learning and deep learning',
    items: [
      { name: 'Artificial Intelligence', provider: 'Stanford', format: 'Video lectures', url: 'https://www.youtube.com/playlist?list=PLoROMvodv4rOca_Ovz1DvdtWuz8BfSWL2' },
      { name: 'Transformers United', provider: 'Stanford', format: 'Video lectures', url: 'https://www.youtube.com/playlist?list=PLoROMvodv4rNiJRchCzutFw5ItR_Z27CM' },
      { name: 'Deep Learning', provider: 'Stanford', format: 'Video lectures', url: 'https://www.youtube.com/watch?v=PySo_6S4ZAg&list=PLoROMvodv4rOABXSygHTsbvUz4G_YQhOb' },
    ],
  },
  {
    title: 'Natural language processing',
    items: [
      { name: 'NLP Course', provider: 'Hugging Face', format: 'Course', url: 'https://huggingface.co/learn/nlp-course' },
      { name: 'Agents Course', provider: 'Hugging Face', format: 'Course', url: 'https://huggingface.co/learn/agents-course' },
      { name: 'Deep Reinforcement Learning Course', provider: 'Hugging Face', format: 'Course', url: 'https://huggingface.co/learn/deep-rl-course' },
      { name: 'CS224N: NLP with Deep Learning', provider: 'Stanford', format: 'Course', url: 'https://web.stanford.edu/class/cs224n/' },
      { name: 'CS224N lectures, Winter 2021', provider: 'Stanford', format: 'Video lectures', url: 'https://www.youtube.com/playlist?list=PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ' },
    ],
  },
  {
    title: 'Computer vision',
    items: [
      { name: 'CS231n: Deep Learning for Computer Vision', provider: 'Stanford', format: 'Course', url: 'http://cs231n.stanford.edu/' },
      { name: 'CS231n lectures, Spring 2017', provider: 'Stanford', format: 'Video lectures', url: 'https://www.youtube.com/watch?v=vT1JzLTH4G4&list=PLSVEhWrZWDHQTBmWZufjxpw3s8sveJtnJ' },
    ],
  },
];

export default function Page() {
  return (
    <>
      <PageTitle intro={<p>Free courses and lecture series I recommend for getting started in machine learning, NLP and computer vision.</p>}>
        Study materials
      </PageTitle>
      <div className="space-y-12">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="mb-3 text-lg font-semibold tracking-tight text-ink">{g.title}</h2>
            <ul className="divide-y divide-rule border-y border-rule">
              {g.items.map((m) => (
                <li key={m.url}>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="text-ink transition-colors group-hover:text-accent">{m.name}</span>
                    <span className="shrink-0 text-sm text-muted">
                      {m.provider} · {m.format}
                      <HiArrowUpRight aria-hidden className="ml-0.5 inline h-3 w-3 align-[-0.05em]" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
