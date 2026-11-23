import { publications, type Publication } from 'app/data/publications';
import type { BarItem, PipelineStep } from 'app/components/paper/viz';

export type PaperFigure = {
  /** Path under /public, e.g. "/images/papers/<slug>/fig1.png". */
  src: string;
  alt: string;
  caption: string;
};

export type PaperStat = { value: string; label: string };

/** Animated, interactive visual described as data; rendered by components/paper/viz.tsx. */
export type PaperViz =
  | { type: 'bars'; title: string; items: BarItem[]; max?: number; unit?: string }
  | { type: 'pipeline'; title: string; steps: PipelineStep[] };

export type PaperFinding = {
  title: string;
  /** One-sentence takeaway shown first. */
  summary: string;
  /** Paragraphs of supporting detail. */
  body?: string[];
  /** Animated charts or diagrams backing the finding. */
  viz?: PaperViz[];
  figures?: PaperFigure[];
};

export type PaperTable = {
  title: string;
  caption?: string;
  columns: string[];
  rows: string[][];
};

/**
 * Content of one paper page. Everything except `slug` and `publicationTitle` is optional:
 * the template skips any section that is empty, so a new paper can start as a bare hero.
 */
export type PaperPage = {
  /** URL segment: /papers/<slug>. */
  slug: string;
  /** Must match `title` of an entry in publications.ts; authors, venue and links come from there. */
  publicationTitle: string;
  /** One or two sentences for the list page and the page header. */
  tagline?: string;
  /** Short plain-language answer to "what did you find?". */
  tldr?: string;
  affiliations?: string[];
  /** Headline numbers shown as a counting strip under the header. */
  stats?: PaperStat[];
  /** Plain-language background: question and approach. */
  overview?: string[];
  /** Interactive diagram of how the approach works, shown right after the overview. */
  approach?: PaperViz;
  findings?: PaperFinding[];
  tables?: PaperTable[];
  /** Further figures not tied to a specific finding. */
  figures?: PaperFigure[];
  bibtex?: string;
};

export const papers: PaperPage[] = [
  {
    slug: 'disinformation-capabilities',
    publicationTitle: 'Disinformation Capabilities of Large Language Models',
  },
];

export type ResolvedPaper = PaperPage & { pub: Publication };

export function resolvePaper(page: PaperPage): ResolvedPaper {
  const pub = publications.find((p) => p.title === page.publicationTitle);
  if (!pub) throw new Error(`papers.ts: no publication titled "${page.publicationTitle}"`);
  return { ...page, pub };
}

export const getPaper = (slug: string) => {
  const page = papers.find((p) => p.slug === slug);
  return page ? resolvePaper(page) : undefined;
};

export const paperPathFor = (title: string) => {
  const page = papers.find((p) => p.publicationTitle === title);
  return page ? `/papers/${page.slug}` : undefined;
};
