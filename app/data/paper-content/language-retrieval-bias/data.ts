import type { RankedClaim } from 'app/components/paper/viz';

// Numbers typed in from Vykopal et al., EACL 2026 (aclanthology.org/2026.eacl-long.240).
// Table 2 gives Macro F1 with English instructions and the change when the instruction is in the target language, per
// model, prompting strategy and setting; Table 7 the same for Chinese instructions; Tables 8 and 9 generation failures.

export const STRATEGIES = ['Zero-shot', 'Zero-shot + task description', 'Few-shot + task description', 'Chain-of-thought'] as const;
export const SHORT_STRATEGIES = ['ZS', 'ZS + task', 'FS + task', 'CoT'];

export const SETTINGS = [
  { key: 'mono', label: 'Same language' },
  { key: 'post', label: 'Across languages, post language' },
  { key: 'claim', label: 'Across languages, claim language' },
] as const;
export type SettingKey = (typeof SETTINGS)[number]['key'];

type Scores = (number | null)[];
type Setting = { english: Scores; diff: Scores };

export type LlmResult = {
  label: string;
  tag: string;
  /** Macro F1 in percent with English instructions, and the change with target-language instructions, per strategy. */
  mono: Setting;
  post: Setting;
  claim: Setting;
};

/** Table 2. The English-instruction score of the claim-language setting is the same as that of the post-language one. */
const row = (
  label: string,
  tag: string,
  monoEn: Scores,
  monoDiff: Scores,
  postEn: Scores,
  postDiff: Scores,
  claimDiff: Scores
): LlmResult => ({
  label,
  tag,
  mono: { english: monoEn, diff: monoDiff },
  post: { english: postEn, diff: postDiff },
  claim: { english: postEn, diff: claimDiff },
});

export const LLMS: LlmResult[] = [
  row('Qwen3', '8B', [69.7, 77.81, 70.7, 83.07], [-6.01, -1.5, 0.76, -6.31], [60.25, 70.4, 63.84, 76.65], [-4.97, -1.75, 0.51, -8.52], [-1.42, -2.4, 0.98, -4.28]),
  row('Qwen3', '14B', [73.4, 77.08, 74.72, 85.15], [-9.23, 3.19, 0.39, -4.82], [64.12, 70.99, 69.29, 78.24], [-7.67, -0.3, 0.58, -5.69], [-4.94, 0.81, -0.38, -3.11]),
  row('Gemma3', '12B', [56.44, 58.72, 70.07, 58.9], [-3.67, 6.36, 0.26, 1.99], [52.86, 52.22, 65.92, 50.78], [-4.91, 3.18, 0.9, 0.42], [-2.08, 2.6, -1.31, 0.85]),
  row('Gemma3', '27B', [59.35, 55.54, 72.72, 52.41], [1.64, 10.85, 0.83, 5.6], [53.69, 49.54, 64.94, 46.37], [-3.41, 3.61, -1.12, 3.24], [0.5, 4.16, 0.83, 2.09]),
  row('Llama3.1', '8B', [50.46, 71.13, 51.12, 67.18], [-1.55, -7.2, 4.41, -2.34], [45.53, 66.48, 50.56, 58.82], [-2.65, -5.72, 3.97, -3.98], [0.12, -1.31, 1.92, 1.05]),
  row('Llama3.1', '70B', [73.97, 74.38, 54.04, 75.48], [-5.18, 0.48, 0.67, -1.98], [65.57, 65.77, 54.34, 67.66], [0.45, 3.0, -2.82, -1.88], [-1.42, 1.46, -0.74, -2.37]),
];

/** Average over the six models, last row of the first block of Table 2. */
export const AVERAGE: LlmResult = row(
  'Average',
  'six models',
  [63.89, 69.11, 65.56, 70.67],
  [-4.0, 2.03, 1.22, -1.31],
  [57.0, 62.57, 61.48, 63.09],
  [-3.86, 0.34, 0.34, -2.74],
  [-1.54, 0.89, 0.22, -0.96]
);

/**
 * Qwen3 8B with and without thinking, no chain-of-thought run with thinking. Table 2 and Tables 18 to 21: Macro F1 with
 * the English instruction and its change with the target-language one. Without thinking these are the Qwen3 8B rows of
 * Table 2; the English score of the claim-language setting is again that of the post-language one.
 */
export const THINKING = {
  mono: { offEnglish: [69.7, 77.81, 70.7], off: [-6.01, -1.5, 0.76], onEnglish: [77.19, 82.74, 81.27], on: [-2.5, -1.25, -0.96] },
  post: { offEnglish: [60.25, 70.4, 63.84], off: [-4.97, -1.75, 0.51], onEnglish: [66.29, 74.43, 73.22], on: [-2.28, -1.45, -0.15] },
  claim: { offEnglish: [60.25, 70.4, 63.84], off: [-1.42, -2.4, 0.98], onEnglish: [66.29, 74.43, 73.22], on: [-1.09, -2.08, 0.21] },
} as const;
export const THINKING_STRATEGIES = STRATEGIES.slice(0, 3);

/** Table 7: change in Macro F1 with Chinese instead of English instructions, per strategy, all 16K pairs. */
export const CHINESE: { label: string; tag: string; diff: number[] }[] = [
  { label: 'Qwen3', tag: '8B', diff: [-18.4, -9.41, 2.44, -3.63] },
  { label: 'Qwen3', tag: '14B', diff: [-20.46, -3.44, 2.93, -4.37] },
  { label: 'Gemma3', tag: '12B', diff: [-11.07, -5.44, 2.99, -2.25] },
  { label: 'Gemma3', tag: '27B', diff: [-2.11, 5.18, 3.91, 4.0] },
  { label: 'Llama3.1', tag: '8B', diff: [-12.02, -25.06, -2.31, -8.6] },
  { label: 'Llama3.1', tag: '70B', diff: [-11.22, 0.26, -3.86, -8.02] },
];

/** The 20 languages of AMC-16K plus Chinese, the 21 instruction languages, in the order of the flags in Figure 2. */
export const INSTRUCTION_LANGUAGES = [
  { code: 'ar', label: 'Arabic' },
  { code: 'bg', label: 'Bulgarian' },
  { code: 'cs', label: 'Czech' },
  { code: 'de', label: 'German' },
  { code: 'el', label: 'Greek' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'sh', label: 'Serbo-Croatian' },
  { code: 'hi', label: 'Hindi' },
  { code: 'hu', label: 'Hungarian' },
  { code: 'ko', label: 'Korean' },
  { code: 'ms', label: 'Malay' },
  { code: 'my', label: 'Burmese' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pl', label: 'Polish' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ro', label: 'Romanian' },
  { code: 'sk', label: 'Slovak' },
  { code: 'es', label: 'Spanish' },
  { code: 'th', label: 'Thai' },
  { code: 'zh', label: 'Chinese' },
];

/** Table 8: share of outputs in percent that are degenerate repetitions or that give no parsable label, per instruction language. */
export const FAILURES_BY_LANGUAGE: { label: string; rep: number; unf: number }[] = [
  { label: 'Burmese', rep: 1.23, unf: 9.31 },
  { label: 'Malay', rep: 0.2, unf: 2.94 },
  { label: 'English', rep: 0.07, unf: 2.9 },
  { label: 'Korean', rep: 0.3, unf: 2.26 },
  { label: 'Thai', rep: 0.22, unf: 1.49 },
  { label: 'Hindi', rep: 0.31, unf: 1.45 },
  { label: 'Bulgarian', rep: 0.31, unf: 1.37 },
  { label: 'Dutch', rep: 0.08, unf: 1.22 },
  { label: 'Portuguese', rep: 0.11, unf: 1.22 },
  { label: 'German', rep: 0.08, unf: 1.13 },
  { label: 'Hungarian', rep: 0.31, unf: 1.04 },
  { label: 'Slovak', rep: 0.38, unf: 0.99 },
  { label: 'Polish', rep: 0.15, unf: 0.88 },
  { label: 'Romanian', rep: 0.15, unf: 0.84 },
  { label: 'French', rep: 0.07, unf: 0.7 },
  { label: 'Serbo-Croatian', rep: 0.34, unf: 0.61 },
  { label: 'Greek', rep: 0.18, unf: 0.57 },
  { label: 'Arabic', rep: 0.15, unf: 0.55 },
  { label: 'Spanish', rep: 0.18, unf: 0.46 },
  { label: 'Czech', rep: 0.27, unf: 0.35 },
];

/** Table 9: the same two failure types per model, over all languages and strategies. */
export const FAILURES_BY_MODEL: { label: string; rep: number; unf: number }[] = [
  { label: 'Llama3.1 8B', rep: 2.13, unf: 24.82 },
  { label: 'Llama3.1 70B', rep: 1.85, unf: 12.76 },
  { label: 'Gemma3 12B', rep: 0.12, unf: 3.76 },
  { label: 'Qwen3 8B', rep: 1.77, unf: 0.43 },
  { label: 'Qwen3 14B', rep: 0.96, unf: 0.34 },
  { label: 'Gemma3 27B', rep: 0.16, unf: 0.06 },
  { label: 'Qwen3 8B (thinking)', rep: 0.0, unf: 0.0 },
];

/** Table 3: retrieval success on the MultiClaim test split, 1,239 post and claim pairs, in percent. */
export const RETRIEVAL_K = ['Success@1', 'Success@3', 'Success@5', 'Success@10', 'Success@20'];
export const RETRIEVERS = [
  { label: 'T5', tone: 'q4', success: [36.72, 64.41, 74.01, 83.21, 87.49], map: 51.23, mrr: 52.43 },
  { label: 'Multilingual E5', tone: 'q3', success: [38.8, 63.4, 74.4, 82.9, 88.5], map: 52.69, mrr: 53.98 },
];

/**
 * Table 4 (claims Multilingual E5 ranks first most often) and Table 10 (claims it returns most often in the top 20),
 * with the number of posts and the mean cosine similarity. Text truncated as in the paper. `noise` marks entries that
 * are code or a bare link rather than a claim, the paper's "noisy or low-information entries".
 */
export const TOP1_CLAIMS: RankedClaim[] = [
  { text: '(function(d, s, id) { var js, fjs...', kind: 'noise', count: 12, similarity: 0.811 },
  { text: 'New Australian law passed in Parliament...', kind: 'claim', count: 6, similarity: 0.904 },
  { text: "Trump tweets on South Africa's...", kind: 'claim', count: 5, similarity: 0.901 },
  { text: 'https://drive.google.com/file/d/1TF...', kind: 'noise', count: 5, similarity: 0.799 },
  { text: 'South Korean protesters bombed with...', kind: 'claim', count: 5, similarity: 0.909 },
  { text: 'A message is being widely shared on...', kind: 'claim', count: 5, similarity: 0.898 },
  { text: 'Report quotes Duterte saying COVID-19...', kind: 'claim', count: 5, similarity: 0.842 },
  { text: 'Accurate representation of vaccinations...', kind: 'claim', count: 5, similarity: 0.876 },
  { text: 'Alexandre Trudeau, the brother of...', kind: 'claim', count: 4, similarity: 0.946 },
  { text: 'Pictures show Azerbaijan has destroyed...', kind: 'claim', count: 4, similarity: 0.91 },
];
export const TOP20_CLAIMS: RankedClaim[] = [
  { text: '(function(d, s, id) { var js, fjs...', kind: 'noise', count: 159, similarity: 0.778 },
  { text: 'https://scontent.ftxl2-1.fna.fbcdn...', kind: 'noise', count: 64, similarity: 0.78 },
  { text: 'https://drive.google.com/file/d/1T...', kind: 'noise', count: 63, similarity: 0.78 },
  { text: 'https://www.instagram.com/tv/CTjM5...', kind: 'noise', count: 61, similarity: 0.784 },
  { text: '1. All calls will be recorded...', kind: 'claim', count: 44, similarity: 0.779 },
  { text: 'https://www.facebook.com/photo.php...', kind: 'noise', count: 37, similarity: 0.779 },
  { text: 'The corona virus is large in size...', kind: 'claim', count: 33, similarity: 0.816 },
  { text: 'https://www.facebook.com/10007599...', kind: 'noise', count: 30, similarity: 0.786 },
  { text: 'Urgent information on Covid...', kind: 'claim', count: 26, similarity: 0.802 },
  { text: 'https://archive.ph/p0fQB', kind: 'noise', count: 25, similarity: 0.785 },
];

/** Table 6: share of each theme in percent. A theme outside the top-10 topics of a subset is printed as 0.0 with an asterisk. */
export const THEMES: { label: string; posts: number; claims: number; tp: number; fp: number; missing: ('posts' | 'tp' | 'fp')[] }[] = [
  { label: 'COVID and vaccines', posts: 23.0, claims: 49.5, tp: 23.2, fp: 44.8, missing: [] },
  { label: 'Visual and photos', posts: 0, claims: 22.5, tp: 14.7, fp: 12.8, missing: ['posts'] },
  { label: 'Nigeria and Africa', posts: 0, claims: 10.3, tp: 22.5, fp: 7.7, missing: ['posts'] },
  { label: 'Ukraine and war', posts: 9.8, claims: 9.0, tp: 0, fp: 10.7, missing: ['tp'] },
  { label: 'Politics', posts: 22.4, claims: 8.7, tp: 0, fp: 0, missing: ['tp', 'fp'] },
];
