import type { DotRow } from 'app/components/paper/viz';

// Source: Vykopal et al., EACL 2026 (aclanthology.org/2026.eacl-long.115). Tables 1, 3 and 4 of the paper, typed in as
// [mean, 95% half-width] in percent, in the column order of the paper. The charts read them as shares from 0 to 1.

export const ASSISTANTS = ['GPT-4o', 'GPT-5', 'Perplexity', 'Qwen Chat'] as const;

type Cell = [number, number];
type Row = { label: string; values: Cell[] };

/** Table 1, Credibility Rate: GPT-4o, GPT-5, Perplexity, Qwen Chat. */
const CR_TOPICS: Row[] = [
  { label: 'Health', values: [[82.42, 3.71], [77.28, 3.26], [91.78, 3.14], [90.28, 3.25]] },
  { label: 'Climate change', values: [[80.29, 2.73], [73.26, 3.15], [92.28, 1.99], [87.62, 2.91]] },
  { label: 'U.S. politics', values: [[73.1, 3.48], [67.78, 3.04], [83.04, 3.2], [79.43, 4.01]] },
  { label: 'Local', values: [[69.29, 4.44], [68.74, 4.02], [78.95, 5.84], [65.59, 6.4]] },
  { label: 'Russia-Ukraine war', values: [[70.7, 3.45], [69.79, 3.21], [85.46, 2.95], [77.03, 4.56]] },
];
const CR_USERS: Row[] = [
  { label: 'Fact-checker', values: [[75.14, 2.29], [72.8, 2.15], [86.3, 2.41], [81.11, 2.87]] },
  { label: 'Claim believer', values: [[75.17, 2.33], [69.94, 2.18], [86.3, 2.41], [78.91, 3.02]] },
];
const CR_OVERALL: Row[] = [{ label: 'Overall', values: [[75.16, 1.62], [71.37, 1.53], [86.3, 1.67], [80.01, 2.06]] }];

/** Table 1, Non-Credibility Rate. */
const NCR_TOPICS: Row[] = [
  { label: 'Health', values: [[1.26, 0.73], [0.88, 0.04], [0.68, 0.79], [0, 0]] },
  { label: 'Climate change', values: [[2.95, 1.49], [3.44, 1.98], [1.18, 0.77], [0.86, 0.73]] },
  { label: 'U.S. politics', values: [[1.31, 0.61], [1.0, 0.54], [0, 0], [0, 0]] },
  { label: 'Local', values: [[1.28, 1.0], [2.43, 1.3], [0.1, 0.2], [2.5, 1.56]] },
  { label: 'Russia-Ukraine war', values: [[4.55, 1.93], [2.63, 0.94], [1.52, 1.05], [1.92, 1.28]] },
];
const NCR_USERS: Row[] = [
  { label: 'Fact-checker', values: [[1.81, 0.62], [1.87, 0.72], [0.76, 0.47], [1.03, 0.65]] },
  { label: 'Claim believer', values: [[2.73, 0.94], [2.2, 0.77], [0.63, 0.43], [1.1, 0.59]] },
];
const NCR_OVERALL: Row[] = [{ label: 'Overall', values: [[2.27, 0.57], [2.03, 0.53], [0.69, 0.32], [1.07, 0.43]] }];

/** Table 4, Groundedness Score. */
const GS_TOPICS: Row[] = [
  { label: 'Health', values: [[84.57, 2.31], [86.33, 1.93], [89.24, 1.84], [77.32, 3.7]] },
  { label: 'Climate change', values: [[84.64, 2.19], [85.01, 2.19], [87.48, 2.5], [73.53, 4.21]] },
  { label: 'U.S. politics', values: [[86.45, 1.79], [86.53, 1.9], [87.02, 2.32], [76.6, 4.38]] },
  { label: 'Local', values: [[74.74, 3.58], [82.73, 2.37], [81.18, 3.11], [69.58, 4.57]] },
  { label: 'Russia-Ukraine war', values: [[83.33, 2.2], [82.04, 2.3], [85.14, 3.02], [73.44, 4.47]] },
];
const GS_USERS: Row[] = [
  { label: 'Fact-checker', values: [[83.15, 1.71], [84.29, 1.43], [86.07, 1.77], [73.46, 2.6]] },
  { label: 'Claim believer', values: [[82.34, 1.59], [84.77, 1.38], [85.96, 1.65], [74.64, 2.74]] },
];
const GS_OVERALL: Row[] = [{ label: 'Overall', values: [[82.75, 1.15], [84.53, 0.97], [86.01, 1.17], [74.05, 1.89]] }];

/** Table 4, Credible Groundedness. */
const CG_TOPICS: Row[] = [
  { label: 'Health', values: [[83.93, 2.37], [82.26, 2.76], [86.87, 2.77], [80.81, 3.56]] },
  { label: 'Climate change', values: [[78.03, 3.68], [75.09, 4.35], [82.02, 3.71], [73.5, 4.62]] },
  { label: 'U.S. politics', values: [[81.29, 3.34], [79.85, 3.71], [86.2, 2.19], [77.31, 4.35]] },
  { label: 'Local', values: [[65.56, 5.26], [63.91, 5.48], [66.82, 5.63], [52.75, 6.48]] },
  { label: 'Russia-Ukraine war', values: [[77.53, 4.14], [76.32, 3.69], [83.4, 3.41], [74.6, 4.95]] },
];
const CG_USERS: Row[] = [
  { label: 'Fact-checker', values: [[78.1, 2.57], [76.58, 2.53], [80.43, 2.58], [72.89, 3.12]] },
  { label: 'Claim believer', values: [[76.43, 2.55], [74.4, 2.68], [81.69, 2.59], [70.39, 3.57]] },
];
const CG_OVERALL: Row[] = [{ label: 'Overall', values: [[77.27, 1.85], [75.49, 1.82], [81.06, 1.82], [71.64, 2.38]] }];

/** Table 4, Non-Credible Groundedness. */
const NCG_TOPICS: Row[] = [
  { label: 'Health', values: [[0.37, 0.34], [0.36, 0.34], [0.17, 0.24], [0, 0]] },
  { label: 'Climate change', values: [[0.86, 0.62], [1.2, 0.83], [0.2, 0.21], [0.21, 0.42]] },
  { label: 'U.S. politics', values: [[0.96, 0.67], [1.05, 0.72], [0, 0], [0, 0]] },
  { label: 'Local', values: [[0.38, 0.34], [2.91, 2.39], [0, 0], [4.51, 3.14]] },
  { label: 'Russia-Ukraine war', values: [[3.22, 1.99], [1.62, 0.86], [0.27, 0.34], [0.18, 0.33]] },
];
const NCG_USERS: Row[] = [
  { label: 'Fact-checker', values: [[1.15, 0.71], [1.36, 0.84], [0.15, 0.12], [1.12, 1.03]] },
  { label: 'Claim believer', values: [[1.16, 0.59], [1.49, 0.72], [0.11, 0.14], [0.9, 0.84]] },
];
const NCG_OVERALL: Row[] = [{ label: 'Overall', values: [[1.16, 0.45], [1.43, 0.56], [0.13, 0.1], [1.01, 0.67]] }];

/** Table 3: GPT-5 conversations where thinking mode fired (58 of 600) against the rest, [thinking, non-thinking]. */
const THINK_CR: Row[] = [
  { label: 'Health', values: [[95.15, 1.69], [74.92, 3.37]] },
  { label: 'Climate change', values: [[94.83, 2.06], [72.71, 3.11]] },
  { label: 'U.S. politics', values: [[78.19, 6.22], [66.73, 3.33]] },
  { label: 'Local', values: [[78.3, 11.29], [67.87, 4.41]] },
  { label: 'Russia-Ukraine war', values: [[85.77, 2.4], [66.59, 3.37]] },
  { label: 'Fact-checker', values: [[85.92, 4.18], [71.12, 2.33]] },
  { label: 'Claim believer', values: [[85.58, 4.47], [68.58, 2.43]] },
  { label: 'Average', values: [[85.78, 3.02], [69.83, 1.56]] },
];
const THINK_NCR: Row[] = [
  { label: 'Health', values: [[0, 0], [0.78, 0.49]] },
  { label: 'Climate change', values: [[0, 0], [3.53, 2.0]] },
  { label: 'U.S. politics', values: [[0.65, 0.79], [1.03, 0.58]] },
  { label: 'Local', values: [[0, 0], [2.65, 1.46]] },
  { label: 'Russia-Ukraine war', values: [[0.79, 0.52], [3.0, 1.16]] },
  { label: 'Fact-checker', values: [[0.38, 0.33], [2.06, 0.83]] },
  { label: 'Claim believer', values: [[0.41, 0.4], [2.36, 0.83]] },
  { label: 'Average', values: [[0.4, 0.25], [2.21, 0.59]] },
];

const toRows = (rows: Row[]): DotRow[] =>
  rows.map(({ label, values }) => ({
    label,
    values: values.map(([m, ci]) => [m / 100, ci / 100] as [number, number]),
  }));

/** Dot plot groups: topics, user framings, and the overall row. */
export const dotGroups = (topics: Row[], users: Row[], overall: Row[]) => [
  { label: 'By topic', rows: toRows(topics) },
  { label: 'By user framing', rows: toRows(users) },
  { label: 'All conversations', rows: toRows(overall) },
];

export const CR_GROUPS = dotGroups(CR_TOPICS, CR_USERS, CR_OVERALL);
export const NCR_GROUPS = dotGroups(NCR_TOPICS, NCR_USERS, NCR_OVERALL);
export const GS_GROUPS = dotGroups(GS_TOPICS, GS_USERS, GS_OVERALL);
export const CG_GROUPS = dotGroups(CG_TOPICS, CG_USERS, CG_OVERALL);
export const NCG_GROUPS = dotGroups(NCG_TOPICS, NCG_USERS, NCG_OVERALL);

export const THINK_CR_ROWS = toRows(THINK_CR);
export const THINK_NCR_ROWS = toRows(THINK_NCR);

/** Overall rows by assistant, as [mean, half-width] in percent, for the lead chart. */
export const OVERALL = {
  cr: CR_OVERALL[0].values,
  gs: GS_OVERALL[0].values,
  cg: CG_OVERALL[0].values,
  ncr: NCR_OVERALL[0].values,
  ncg: NCG_OVERALL[0].values,
};

/** Figure 3: conversations per 5-point bin of groundedness (0-100%), read off the paper's vector figure. */
export const GROUNDEDNESS_HISTOGRAMS = [
  { label: 'GPT-4o', credible: [12, 3, 4, 5, 9, 9, 4, 4, 10, 12, 9, 9, 27, 25, 33, 54, 72, 104, 99, 96], nonCredible: [567, 11, 8, 4, 1, 2, 2, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0], mean: 77.27, median: 84.8 },
  { label: 'GPT-5', credible: [22, 3, 1, 4, 5, 5, 7, 7, 9, 13, 18, 17, 21, 35, 31, 44, 79, 98, 99, 82], nonCredible: [555, 20, 10, 4, 3, 1, 2, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0], mean: 75.49, median: 83.8 },
  { label: 'Perplexity', credible: [17, 1, 2, 1, 3, 4, 7, 4, 10, 9, 12, 4, 26, 22, 22, 35, 53, 87, 113, 168], nonCredible: [595, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], mean: 81.06, median: 88.7 },
  { label: 'Qwen Chat', credible: [44, 1, 2, 1, 5, 9, 6, 8, 20, 2, 37, 17, 30, 31, 24, 40, 65, 46, 36, 155], nonCredible: [569, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 2, 0, 1, 1, 0], mean: 71.64, median: 80.0 },
];

/** Figure 9: share of all cited domains per category in percent and the disinformation part of it, largest first. */
export const DOMAIN_CATEGORIES = [
  {
    label: 'GPT-4o',
    bars: [
      { label: 'website', value: 18.6, part: 1.4 },
      { label: 'news', value: 15.9, part: 0.0 },
      { label: 'unknown', value: 12.7, part: 0.0 },
      { label: 'organization', value: 11.5, part: 0.2 },
      { label: 'tv/radio/podcast', value: 8.6, part: 0.0 },
      { label: 'publisher', value: 5.7, part: 0.0 },
      { label: 'news agency', value: 5.7, part: 0.0 },
      { label: 'government', value: 5.2, part: 0.0 },
      { label: 'social media', value: 4.9, part: 0.0 },
      { label: 'magazine', value: 2.9, part: 0.0 },
      { label: 'fact-checking', value: 2.2, part: 0.0 },
      { label: 'blog', value: 1.6, part: 0.0 },
      { label: 'company', value: 1.2, part: 0.0 },
      { label: 'database', value: 0.5, part: 0.0 },
      { label: 'tool/app', value: 0.5, part: 0.0 },
      { label: 'politic', value: 0.5, part: 0.0 },
      { label: 'research', value: 0.4, part: 0.0 },
      { label: 'education', value: 0.2, part: 0.0 },
      { label: 'forum', value: 0.2, part: 0.0 },
      { label: 'health organization', value: 0.2, part: 0.0 },
      { label: 'think tank', value: 0.1, part: 0.0 },
      { label: 'AI content', value: 0.1, part: 0.0 },
      { label: 'academic', value: 0.1, part: 0.0 },
      { label: 'policy', value: 0.1, part: 0.0 },
      { label: 'finance', value: 0.1, part: 0.0 },
      { label: 'search engine', value: 0.0, part: 0.0 },
    ],
  },
  {
    label: 'GPT-5',
    bars: [
      { label: 'unknown', value: 31.6, part: 0.0 },
      { label: 'website', value: 14.7, part: 0.9 },
      { label: 'news', value: 10.5, part: 0.0 },
      { label: 'organization', value: 10.5, part: 0.1 },
      { label: 'tv/radio/podcast', value: 5.8, part: 0.0 },
      { label: 'government', value: 5.7, part: 0.0 },
      { label: 'news agency', value: 5.3, part: 0.0 },
      { label: 'publisher', value: 5.2, part: 0.0 },
      { label: 'social media', value: 4.4, part: 0.0 },
      { label: 'magazine', value: 2.5, part: 0.0 },
      { label: 'fact-checking', value: 1.3, part: 0.0 },
      { label: 'company', value: 0.6, part: 0.0 },
      { label: 'blog', value: 0.5, part: 0.0 },
      { label: 'politic', value: 0.3, part: 0.0 },
      { label: 'tool/app', value: 0.2, part: 0.0 },
      { label: 'database', value: 0.2, part: 0.0 },
      { label: 'research', value: 0.2, part: 0.0 },
      { label: 'education', value: 0.1, part: 0.0 },
      { label: 'think tank', value: 0.1, part: 0.0 },
      { label: 'policy', value: 0.1, part: 0.0 },
      { label: 'health organization', value: 0.1, part: 0.0 },
      { label: 'AI content', value: 0.0, part: 0.0 },
      { label: 'academic', value: 0.0, part: 0.0 },
      { label: 'search engine', value: 0.0, part: 0.0 },
      { label: 'forum', value: 0.0, part: 0.0 },
      { label: 'finance', value: 0.0, part: 0.0 },
    ],
  },
  {
    label: 'Perplexity',
    bars: [
      { label: 'unknown', value: 25.9, part: 0.0 },
      { label: 'website', value: 15.3, part: 0.6 },
      { label: 'organization', value: 13.8, part: 0.0 },
      { label: 'tv/radio/podcast', value: 11.5, part: 0.1 },
      { label: 'news', value: 9.9, part: 0.0 },
      { label: 'news agency', value: 6.5, part: 0.0 },
      { label: 'publisher', value: 5.5, part: 0.0 },
      { label: 'government', value: 5.3, part: 0.0 },
      { label: 'magazine', value: 2.3, part: 0.0 },
      { label: 'fact-checking', value: 1.3, part: 0.0 },
      { label: 'social media', value: 1.2, part: 0.0 },
      { label: 'blog', value: 0.3, part: 0.0 },
      { label: 'company', value: 0.3, part: 0.0 },
      { label: 'politic', value: 0.2, part: 0.0 },
      { label: 'research', value: 0.2, part: 0.0 },
      { label: 'think tank', value: 0.1, part: 0.0 },
      { label: 'tool/app', value: 0.1, part: 0.0 },
      { label: 'database', value: 0.1, part: 0.0 },
      { label: 'education', value: 0.1, part: 0.0 },
      { label: 'health organization', value: 0.0, part: 0.0 },
    ],
  },
  {
    label: 'Qwen Chat',
    bars: [
      { label: 'unknown', value: 36.2, part: 0.0 },
      { label: 'website', value: 18.1, part: 0.7 },
      { label: 'organization', value: 12.2, part: 0.0 },
      { label: 'news', value: 7.8, part: 0.0 },
      { label: 'publisher', value: 6.3, part: 0.0 },
      { label: 'government', value: 6.3, part: 0.0 },
      { label: 'tv/radio/podcast', value: 5.2, part: 0.0 },
      { label: 'social media', value: 2.2, part: 0.0 },
      { label: 'fact-checking', value: 1.2, part: 0.0 },
      { label: 'magazine', value: 1.2, part: 0.0 },
      { label: 'news agency', value: 1.0, part: 0.0 },
      { label: 'company', value: 0.9, part: 0.0 },
      { label: 'politic', value: 0.5, part: 0.0 },
      { label: 'tool/app', value: 0.2, part: 0.0 },
      { label: 'blog', value: 0.2, part: 0.0 },
      { label: 'database', value: 0.2, part: 0.0 },
      { label: 'think tank', value: 0.1, part: 0.0 },
      { label: 'health organization', value: 0.1, part: 0.0 },
      { label: 'research', value: 0.1, part: 0.0 },
      { label: 'policy', value: 0.0, part: 0.0 },
      { label: 'academic', value: 0.0, part: 0.0 },
    ],
  },
];
