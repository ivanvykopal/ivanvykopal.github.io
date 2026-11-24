import type { DotRow } from 'app/components/paper/viz';

// Numbers typed in from Vykopal et al., Findings of EMNLP 2025 (aclanthology.org/2025.findings-emnlp.852).
// Table 2 gives Macro F1 (in percent) per model, prompting strategy, input version and setting; Table 4 the share of
// relevant pairs per language; Table 5 the retrieval quality; Table 3 the dataset statistics.

export const TECHNIQUES = [
  'Zero-shot',
  'Zero-shot + task description',
  'Few-shot + task description',
  'Chain-of-thought',
  'Cross-lingual thought',
] as const;

/** Macro F1 in percent for the five strategies in the order of TECHNIQUES; null where the run does not exist. */
type Scores = (number | null)[];
type Run = { mono: Scores; cross: Scores };

export type LlmResult = { label: string; tag: string; large: boolean; og: Run; en: Run };

/** Table 2. Cross-lingual thought already translates, so it has no run on English input. */
export const LLMS: LlmResult[] = [
  {
    label: 'Mistral Large',
    tag: '123B',
    large: true,
    og: { mono: [72.06, 74.2, 82.46, 79.4, 81.98], cross: [67.09, 71.33, 80.54, 71.6, 74.29] },
    en: { mono: [75.5, 79.39, 81.64, 78.95, null], cross: [67.41, 72.38, 78.06, 72.09, null] },
  },
  {
    label: 'C4AI Command R+',
    tag: '104B',
    large: true,
    og: { mono: [79.29, 83.2, 76.26, 64.98, 65.9], cross: [70.34, 79.08, 74.54, 58.66, 61.36] },
    en: { mono: [80.0, 81.92, 80.4, 66.43, null], cross: [77.28, 75.5, 75.4, 58.78, null] },
  },
  {
    label: 'Qwen2.5 Instruct',
    tag: '72B',
    large: true,
    og: { mono: [70.87, 66.3, 81.68, 74.78, 72.56], cross: [69.69, 60.77, 77.87, 67.59, 67.04] },
    en: { mono: [76.16, 69.7, 82.0, 76.55, null], cross: [68.48, 61.76, 77.52, 68.46, null] },
  },
  {
    label: 'Llama3.1 Instruct',
    tag: '70B',
    large: true,
    og: { mono: [69.99, 72.08, 60.64, 75.9, 77.86], cross: [62.54, 67.69, 61.2, 68.65, 72.07] },
    en: { mono: [71.87, 75.27, 77.01, 78.29, null], cross: [63.77, 67.46, 76.79, 70.66, null] },
  },
  {
    label: 'Llama3.1 Instruct',
    tag: '8B',
    large: false,
    og: { mono: [48.63, 70.88, 47.78, 68.71, 71.77], cross: [47.19, 69.7, 42.15, 62.61, 64.48] },
    en: { mono: [60.57, 76.48, 64.22, 74.27, null], cross: [53.51, 71.11, 56.93, 66.33, null] },
  },
  {
    label: 'Qwen2.5 Instruct',
    tag: '7B',
    large: false,
    og: { mono: [65.4, 79.95, 71.43, 80.74, 66.97], cross: [64.18, 74.44, 72.52, 75.15, 66.49] },
    en: { mono: [66.76, 81.07, 69.02, 81.02, null], cross: [64.02, 76.09, 70.89, 75.1, null] },
  },
  {
    label: 'Mistral v3',
    tag: '7B',
    large: false,
    og: { mono: [64.92, 65.98, 57.91, 72.97, 65.67], cross: [61.26, 60.46, 53.31, 67.36, 59.1] },
    en: { mono: [68.69, 71.01, 68.67, 74.0, null], cross: [63.94, 63.49, 62.79, 66.08, null] },
  },
];

/** Baselines do not depend on the prompting strategy, so one score per input version. null: not run. */
export const BASELINES: { label: string; tag: string; og: [number, number] | null; en: [number, number] }[] = [
  { label: 'Multilingual E5 Large', tag: 'embeddings', og: [64.92, 65.5], en: [77.53, 68.45] },
  { label: 'GTR-T5 Large', tag: 'embeddings', og: null, en: [75.52, 67.88] },
  { label: 'DeBERTa v3 Large', tag: 'NLI', og: [70.32, 64.51], en: [74.05, 68.11] },
  { label: 'mDeBERTa v3 Base', tag: 'NLI', og: [67.38, 58.68], en: [64.84, 59.05] },
];

export const SETTINGS = ['mono', 'cross'] as const;
export type Setting = (typeof SETTINGS)[number];

/** Mean of the runs that exist; English input is averaged without cross-lingual thought, as in the paper. */
export const mean = (xs: (number | null)[]) => {
  const present = xs.filter((x): x is number => x !== null);
  return present.reduce((a, b) => a + b, 0) / present.length;
};
/** A [score, confidence half-width] point from a percent; the paper reports no intervals for these. */
const pt = (percent: number | null): [number, number] | null => (percent === null ? null : [percent / 100, 0]);

/** Rows of the per-model view: one row per baseline or LLM, original against English input. */
export function averageRows(setting: Setting, large: boolean): DotRow[] {
  return LLMS.filter((m) => m.large === large).map((m) => ({
    label: m.label,
    note: m.tag,
    values: [pt(mean(m.og[setting])) as [number, number], pt(mean(m.en[setting])) as [number, number]],
  }));
}

export const baselineRows = (setting: Setting): DotRow[] =>
  BASELINES.map((b) => {
    const i = setting === 'mono' ? 0 : 1;
    return { label: b.label, note: b.tag, values: [pt(b.og ? b.og[i] : null), pt(b.en[i])] as DotRow['values'] };
  });

/** One row per prompting strategy for a model. */
export function techniqueRows(m: LlmResult, setting: Setting): DotRow[] {
  return TECHNIQUES.map((label, k) => ({ label, values: [pt(m.og[setting][k]), pt(m.en[setting][k])] as DotRow['values'] }));
}

/** One row per strategy for the mean of a size class. */
export function classTechniqueRows(large: boolean, setting: Setting): DotRow[] {
  const group = LLMS.filter((m) => m.large === large);
  return TECHNIQUES.map((label, k) => ({
    label,
    values: [
      pt(mean(group.map((m) => m.og[setting][k]))),
      pt(mean(group.map((m) => m.en[setting][k]))),
    ] as DotRow['values'],
  }));
}

/** Table 4: share of the 400 annotated pairs judged relevant, in percent, per language and language pair. */
export const RELEVANT_MONO: { label: string; value: number }[] = [
  { label: 'English', value: 38.5 },
  { label: 'Malay', value: 36.0 },
  { label: 'Portuguese', value: 31.75 },
  { label: 'German', value: 30.25 },
  { label: 'Greek', value: 26.75 },
  { label: 'Spanish', value: 23.5 },
  { label: 'Hindi', value: 22.25 },
  { label: 'Polish', value: 20.25 },
  { label: 'Arabic', value: 20.0 },
  { label: 'Dutch', value: 20.0 },
  { label: 'Serbo-Croatian', value: 19.5 },
  { label: 'French', value: 19.25 },
  { label: 'Czech', value: 16.5 },
  { label: 'Slovak', value: 14.25 },
  { label: 'Hungarian', value: 13.75 },
  { label: 'Korean', value: 13.25 },
  { label: 'Thai', value: 12.25 },
  { label: 'Romanian', value: 11.5 },
  { label: 'Bulgarian', value: 11.25 },
  { label: 'Burmese', value: 9.5 },
];

export const RELEVANT_CROSS: { label: string; value: number }[] = [
  { label: 'Slovak post, English claim', value: 36.25 },
  { label: 'Korean post, English claim', value: 27.5 },
  { label: 'Czech post, English claim', value: 22.5 },
  { label: 'Spanish post, English claim', value: 17.5 },
  { label: 'German post, French claim', value: 16.75 },
  { label: 'German post, English claim', value: 15.25 },
  { label: 'Hungarian post, Polish claim', value: 13.75 },
  { label: 'Dutch post, German claim', value: 12.25 },
  { label: 'French post, English claim', value: 12.0 },
  { label: 'Polish post, Serbo-Croatian claim', value: 11.0 },
  { label: 'Czech post, Polish claim', value: 9.0 },
  { label: 'Thai post, Portuguese claim', value: 7.75 },
  { label: 'Slovak post, Czech claim', value: 7.5 },
  { label: 'English post, Portuguese claim', value: 6.0 },
  { label: 'Hindi post, English claim', value: 5.25 },
  { label: 'English post, Arabic claim', value: 5.25 },
  { label: 'Malay post, Arabic claim', value: 2.25 },
  { label: 'Arabic post, French claim', value: 2.25 },
  { label: 'Spanish post, Portuguese claim', value: 1.5 },
  { label: 'Burmese post, Malay claim', value: 0.5 },
];

/** Table 3: per language, mean word count (standard deviation) of posts and fact-checked claims, posts, claims. */
export const LANGUAGE_STATS: string[][] = [
  ['Arabic', '57.26 ± 92.63', '30.82 ± 49.46', '69', '825'],
  ['Bulgarian', '169.18 ± 238.08', '11.95 ± 3.87', '40', '118'],
  ['Czech', '151.54 ± 181.16', '11.09 ± 8.87', '56', '201'],
  ['German', '114.74 ± 146.74', '19.90 ± 17.08', '60', '558'],
  ['Greek', '120.62 ± 237.78', '19.67 ± 8.47', '40', '271'],
  ['English', '195.66 ± 266.51', '23.92 ± 30.45', '111', '2,651'],
  ['French', '129.27 ± 152.93', '18.52 ± 12.33', '55', '823'],
  ['Serbo-Croatian', '130.70 ± 162.29', '23.77 ± 25.12', '40', '405'],
  ['Hindi', '46.95 ± 39.16', '24.20 ± 14.18', '43', '326'],
  ['Hungarian', '127.51 ± 155.68', '10.68 ± 3.60', '55', '111'],
  ['Korean', '95.19 ± 103.14', '9.96 ± 7.19', '48', '172'],
  ['Malay', '146.50 ± 196.29', '13.42 ± 5.61', '50', '576'],
  ['Burmese', '51.91 ± 52.08', '7.78 ± 5.79', '42', '75'],
  ['Dutch', '110.17 ± 113.22', '21.24 ± 18.72', '45', '240'],
  ['Polish', '139.75 ± 173.43', '20.38 ± 15.63', '71', '808'],
  ['Portuguese', '105.28 ± 121.96', '37.29 ± 61.69', '40', '1,242'],
  ['Romanian', '126.65 ± 140.73', '13.78 ± 4.60', '40', '131'],
  ['Slovak', '222.77 ± 562.15', '13.61 ± 8.63', '91', '154'],
  ['Spanish', '91.06 ± 142.76', '20.55 ± 13.08', '61', '366'],
  ['Thai', '82.50 ± 66.99', '4.00 ± 2.92', '55', '137'],
];
