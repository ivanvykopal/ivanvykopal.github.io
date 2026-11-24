import { publications, type Publication } from 'app/data/publications';
import type {
  ArchConfig,
  BarItem,
  BarTone,
  BiasLanguage,
  BiasModel,
  BiasStrategy,
  BubbleAxis,
  BubblePoint,
  BubbleTarget,
  ClaimView,
  ColumnPanel,
  ColumnSeries,
  CompositionRow,
  CompositionSegment,
  ChipGroup,
  DotSeries,
  DotView,
  DumbbellMetric,
  FlowStage,
  GroupedScale,
  GroupedSeries,
  HeatAxis,
  HeatClass,
  HeatScale,
  HeatView,
  HistogramPanel,
  HistogramSeries,
  LineBand,
  LineDataset,
  MatrixClass,
  MatrixColumn,
  MatrixColumnGroup,
  MatrixRowGroup,
  PairedRow,
  PairedSide,
  PipelineStep,
  PromptTab,
  ScatterFamily,
  ScatterView,
  ScoreColumn,
  ScoreGroup,
  ScoreVariant,
  ShareGroup,
  StackedSegment,
  StackedView,
} from 'app/components/paper/viz';
import { disinformationCapabilities } from './paper-content/disinformation-capabilities';
import { languageRetrievalBias } from './paper-content/language-retrieval-bias';
import { llmsPfcd } from './paper-content/llms-pfcd';
import { multiclaim } from './paper-content/multiclaim';
import { softLanguagePrompts } from './paper-content/soft-language-prompts';
import { skBench } from './paper-content/sk-bench';
import { webSearchCredibility } from './paper-content/web-search-credibility';

export type PaperFigure = {
  /** Path under /public, e.g. "/images/papers/<slug>/fig1.png". */
  src: string;
  alt: string;
  caption: string;
  /** Drop the white frame and border, for images with a transparent background. */
  plain?: boolean;
};

export type PaperStat = { value: string; label: string };

/** Animated, interactive visual described as data; rendered by components/paper/viz. */
export type PaperViz =
  | { type: 'bars'; title: string; items: BarItem[]; max?: number; unit?: string; tone?: BarTone; legend?: [string, string]; caption?: string }
  | {
      type: 'claims';
      title: string;
      views: ClaimView[];
      similarity: { min: number; max: number; ticks: number[] };
      switchLabel?: string;
      caption?: string;
    }
  | { type: 'pipeline'; title: string; steps: PipelineStep[] }
  | { type: 'stacked'; title: string; segments: StackedSegment[]; views: StackedView[]; switchLabel?: string; caption?: string }
  | { type: 'prompts'; title: string; tabs: PromptTab[] }
  | { type: 'groups'; title: string; groups: ChipGroup[] }
  | { type: 'shares'; title: string; groups: ShareGroup[]; segments: StackedSegment[]; rankBy: number; rankLabel: string; caption?: string }
  | {
      type: 'lines';
      title: string;
      categories: string[];
      categoryTitles?: string[];
      bands?: LineBand[];
      datasets: LineDataset[];
      descriptions?: Record<string, string>;
      minWidth?: number;
      caption?: string;
    }
  | {
      type: 'grouped';
      title: string;
      categories: string[];
      categoryDescriptions?: string[];
      series: GroupedSeries[];
      scale?: GroupedScale;
      caption?: string;
    }
  | {
      type: 'dumbbell';
      title: string;
      rows: string[];
      rowDescriptions?: string[];
      series: [string, string];
      tones?: [string, string];
      metrics: DumbbellMetric[];
      switchLabel?: string;
      caption?: string;
    }
  | {
      type: 'matrix';
      title: string;
      classes: MatrixClass[];
      columns: MatrixColumn[];
      columnGroups: MatrixColumnGroup[];
      rowGroups: MatrixRowGroup[];
      perCell: number;
      unit: string;
      caption?: string;
    }
  | {
      type: 'dots';
      title: string;
      series: DotSeries[];
      views: DotView[];
      domain?: [number, number];
      ticks?: number[];
      axisLabel?: string;
      switchLabel?: string;
      /** Join the two series of each row and colour the line by the direction of the change. */
      paired?: boolean;
      caption?: string;
    }
  | {
      type: 'bubble';
      title: string;
      x: BubbleAxis;
      y: BubbleAxis;
      points: BubblePoint[];
      sizeLabel: string;
      ringLabel: string;
      target?: BubbleTarget;
      caption?: string;
    }
  | { type: 'columns'; title: string; whole: ColumnSeries; part: ColumnSeries; yLabel?: string; panels: ColumnPanel[]; caption?: string }
  | {
      type: 'histogram';
      title: string;
      series: HistogramSeries[];
      panels: HistogramPanel[];
      yMax?: number;
      yTicks?: number[];
      xLabel?: string;
      caption?: string;
    }
  | { type: 'composition'; title: string; segments: CompositionSegment[]; rows: CompositionRow[]; caption?: string }
  | { type: 'scatter'; title: string; families: ScatterFamily[]; views: ScatterView[]; switchLabel?: string; caption?: string }
  | { type: 'paired'; title: string; left: PairedSide; right: PairedSide; rows: PairedRow[]; caption?: string }
  | { type: 'scores'; title: string; columns: ScoreColumn[]; variants?: ScoreVariant[]; groups: ScoreGroup[]; caption?: string }
  | {
      type: 'heatmap';
      title: string;
      rows: HeatAxis[];
      columns: HeatAxis[];
      rowAxis: string;
      columnAxis: string;
      views: HeatView[];
      classes?: HeatClass[];
      scale?: HeatScale;
      decimals?: number;
      signed?: boolean;
      switchLabel?: string;
      caption?: string;
    }
  | ({ type: 'image' } & PaperFigure)
  | { type: 'flow'; title: string; stages: FlowStage[]; caption?: string }
  | {
      type: 'bias-pipeline';
      title: string;
      strategies: BiasStrategy[];
      languages: BiasLanguage[];
      baseline: string;
      models: BiasModel[];
      retrievers: string[];
      topK: number;
      caption?: string;
    }
  | {
      type: 'architecture';
      title: string;
      configs: ArchConfig[];
      languageTone: string;
      taskTone: string;
      example: { source: string; target: string };
      caption?: string;
    };

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
 *
 * Each paper lives in its own directory, app/data/paper-content/<slug>/: index.ts exports the page and
 * data.ts holds the numbers its charts read. Register the page in `papers` below.
 */
export type PaperPage = {
  /** URL segment: /papers/<slug>. */
  slug: string;
  /** Must match `title` of an entry in publications.ts; authors, venue and links come from there. */
  publicationTitle: string;
  /** One or two sentences for the list page and the page header. */
  tagline?: string;
  /**
   * Absolute URL of a page for this paper hosted elsewhere. The papers list and the publication's
   * "Paper summary" link go there, and no /papers/<slug> page is built.
   */
  external?: string;
  /** Short plain-language answer to "what did you find?". */
  tldr?: string;
  /** Affiliations in display order; authors refer to them by 1-based number. */
  affiliations?: string[];
  /** Author name (as in publications.ts) to affiliation numbers. Authors not listed get no marker. */
  authorAffiliations?: Record<string, number[]>;
  /** Authors marked with * as having contributed equally. */
  equalContribution?: string[];
  /** Headline numbers shown as a row under the header. */
  stats?: PaperStat[];
  /** The one figure that carries the main result, shown before the overview. */
  lead?: PaperViz;
  /** Plain-language background: question and approach. */
  overview?: string[];
  /** Interactive diagrams of how the approach works, shown in order right after the overview. */
  approach?: PaperViz[];
  findings?: PaperFinding[];
  tables?: PaperTable[];
  /** Further figures not tied to a specific finding. */
  figures?: PaperFigure[];
  bibtex?: string;
};

export const papers: PaperPage[] = [disinformationCapabilities, multiclaim, llmsPfcd, softLanguagePrompts, skBench, webSearchCredibility, languageRetrievalBias];

export type ResolvedPaper = PaperPage & { pub: Publication };

export function resolvePaper(page: PaperPage): ResolvedPaper {
  const pub = publications.find((p) => p.title === page.publicationTitle);
  if (!pub) throw new Error(`papers.ts: no publication titled "${page.publicationTitle}"`);
  return { ...page, pub };
}

/** Paper pages built on this site; papers with an external page are left out. */
export const sitePapers = papers.filter((p) => !p.external);

export const getPaper = (slug: string) => {
  const page = sitePapers.find((p) => p.slug === slug);
  return page ? resolvePaper(page) : undefined;
};

/** Where a paper's page lives: its external URL, or /papers/<slug> on this site. */
export const paperHref = (page: PaperPage) => page.external ?? `/papers/${page.slug}`;

export const paperPathFor = (title: string) => {
  const page = papers.find((p) => p.publicationTitle === title);
  return page ? paperHref(page) : undefined;
};
