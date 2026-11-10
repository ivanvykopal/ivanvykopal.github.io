export const SITE_URL = 'https://ivanvykopal.github.io';

export const EMAIL = 'ivan.vykopal@kinit.sk';

export type ProfileLink = {
  label: string;
  href: string;
  kind: 'email' | 'scholar' | 'github' | 'linkedin' | 'orcid' | 'researchgate';
};

export const profileLinks: ProfileLink[] = [
  { label: 'Email', href: `mailto:${EMAIL}`, kind: 'email' },
  {
    label: 'Google Scholar',
    href: 'https://scholar.google.com/citations?user=HgsKgYAAAAAJ',
    kind: 'scholar',
  },
  { label: 'GitHub', href: 'https://github.com/ivanvykopal', kind: 'github' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ivan-vykopal-668893211/',
    kind: 'linkedin',
  },
  { label: 'ORCID', href: 'https://orcid.org/0000-0002-0431-0044', kind: 'orcid' },
  {
    label: 'ResearchGate',
    href: 'https://www.researchgate.net/profile/Ivan-Vykopal',
    kind: 'researchgate',
  },
];

export type NewsItem = {
  /** Display date, e.g. "Nov 2026" or "2025" when the month is not recorded. */
  date: string;
  text: string;
  href?: string;
};

export const news: NewsItem[] = [
  {
    date: 'Nov 2026',
    text: 'Started as a Junior Researcher in the NLP team at KInIT.',
  },
  {
    date: '2026',
    text: 'sk-bench, a native-first benchmark for evaluating LLMs in Slovak, was accepted to the EMNLP 2026 main conference.',
    href: 'https://aclanthology.org/2026.emnlp-main.2639/',
  },
  {
    date: '2026',
    text: 'Our agentic audit of Slovak FineWeb2 will be presented as a poster at the WaC-13 workshop at EMNLP 2026.',
    href: 'https://arxiv.org/abs/2610.31636',
  },
  {
    date: '2026',
    text: 'Two first-author papers at EACL 2026, on web search credibility in chat assistants and on language and retrieval bias in claim detection. I also volunteered at the conference.',
  },
  {
    date: '2025',
    text: 'Our team won CLEF 2025 CheckThat! Task 2 on claim normalization, ranking 1st in 13 of 20 languages and 2nd or 3rd in the rest.',
  },
  {
    date: '2025',
    text: 'Paper on LLMs for multilingual previously fact-checked claim detection accepted to EMNLP 2025 Findings.',
    href: 'https://aclanthology.org/2025.findings-emnlp.852/',
  },
  {
    date: '2025',
    text: 'Presented soft language prompts for cross-lingual transfer at NAACL 2025.',
    href: 'https://aclanthology.org/2025.naacl-long.517/',
  },
  {
    date: '2025',
    text: 'Attended the Eastern European Machine Learning Summer School (EEML).',
  },
  {
    date: 'Jun 2024',
    text: 'Four-week research visit at DFKI in Saarbrücken, Germany.',
  },
  {
    date: '2024',
    text: 'Our study of the disinformation capabilities of LLMs appeared at ACL 2024.',
    href: 'https://aclanthology.org/2024.acl-long.793/',
  },
];
