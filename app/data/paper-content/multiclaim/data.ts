import type { DotRow, PairedRow, ScatterPoint } from 'app/components/paper/viz';

// Numbers typed in from Pikuliak et al., EMNLP 2023 (aclanthology.org/2023.emnlp-main.1027). Table 5 gives the
// languages, Table 2 the averaged results per method and Table 11 the per-language results with 95%
// Agresti-Coull confidence half-widths. Pair counts per language are the numbers printed above Figure 3.

/** Table 5: fact-checks and posts per language, for languages with at least 50 of either. */
export const LANGUAGES: PairedRow[] = [
  { label: 'Arabic', code: 'ara', left: 14201, right: 931 },
  { label: 'Assamese', code: 'asm', left: 60, right: 5 },
  { label: 'Azerbaijani', code: 'aze', left: 178, right: 2 },
  { label: 'Bulgarian', code: 'bul', left: 162, right: 114 },
  { label: 'Bengali', code: 'ben', left: 4143, right: 113 },
  { label: 'Catalan', code: 'cat', left: 574, right: 100 },
  { label: 'Czech', code: 'ces', left: 254, right: 265 },
  { label: 'Danish', code: 'dan', left: 648, right: 6 },
  { label: 'German', code: 'deu', left: 4996, right: 932 },
  { label: 'Greek', code: 'ell', left: 1821, right: 175 },
  { label: 'English', code: 'eng', left: 85814, right: 7307 },
  { label: 'Spanish', code: 'spa', left: 14082, right: 7319 },
  { label: 'Farsi', code: 'fas', left: 418, right: 17 },
  { label: 'Finnish', code: 'fin', left: 109, right: 103 },
  { label: 'Tagalog', code: 'tgl', left: 462, right: 439 },
  { label: 'French', code: 'fra', left: 4355, right: 2146 },
  { label: 'Serbo-Croatian', code: 'hbs', left: 2451, right: 481 },
  { label: 'Hindi', code: 'hin', left: 7149, right: 833 },
  { label: 'Hungarian', code: 'hun', left: 139, right: 113 },
  { label: 'Italian', code: 'ita', left: 3047, right: 65 },
  { label: 'Hebrew', code: 'heb', left: 202, right: 2 },
  { label: 'Japanese', code: 'jpn', left: 62, right: 7 },
  { label: 'Khmer', code: 'khm', left: 144, right: 6 },
  { label: 'Korean', code: 'kor', left: 510, right: 474 },
  { label: 'Macedonian', code: 'mkd', left: 1125, right: 1 },
  { label: 'Malayalam', code: 'mal', left: 1206, right: 4 },
  { label: 'Malay', code: 'msa', left: 8424, right: 1389 },
  { label: 'Myanmar', code: 'mya', left: 92, right: 172 },
  { label: 'Dutch', code: 'nld', left: 1232, right: 257 },
  { label: 'Norwegian', code: 'nor', left: 440, right: 5 },
  { label: 'Polish', code: 'pol', left: 6912, right: 453 },
  { label: 'Portuguese', code: 'por', left: 21569, right: 3366 },
  { label: 'Romanian', code: 'ron', left: 204, right: 238 },
  { label: 'Russian', code: 'rus', left: 2715, right: 28 },
  { label: 'Sinhala', code: 'sin', left: 825, right: 534 },
  { label: 'Slovak', code: 'slk', left: 260, right: 363 },
  { label: 'Albanian', code: 'sqi', left: 726, right: 1 },
  { label: 'Tamil', code: 'tam', left: 1612, right: 29 },
  { label: 'Telugu', code: 'tel', left: 2450, right: 11 },
  { label: 'Thai', code: 'tha', left: 382, right: 626 },
  { label: 'Turkish', code: 'tur', left: 6676, right: 7 },
  { label: 'Ukrainian', code: 'ukr', left: 68, right: 6 },
  { label: 'Urdu', code: 'urd', left: 0, right: 378 },
  { label: 'Chinese', code: 'zho', left: 2586, right: 595 },
];

/**
 * Table 11, S@10 per language for the four methods of Figure 3, in this order: GTR-T5-Large on the English
 * version, BM25 on the English version, MPNet-Base-Multilingual on the original version, BM25 on the original
 * version. Monolingual pairs search only fact-checks in the post's language; crosslingual pairs search all of them.
 */
export const MONOLINGUAL_ROWS: DotRow[] = [
  { label: 'Spanish', note: '7,528 pairs', values: [[0.84, 0.01], [0.79, 0.01], [0.64, 0.01], [0.76, 0.01]] },
  { label: 'English', note: '6,450 pairs', values: [[0.77, 0.01], [0.62, 0.01], [0.61, 0.01], [0.6, 0.01]] },
  { label: 'Portuguese', note: '3,739 pairs', values: [[0.8, 0.01], [0.78, 0.01], [0.57, 0.02], [0.79, 0.01]] },
  { label: 'French', note: '2,105 pairs', values: [[0.86, 0.01], [0.77, 0.02], [0.73, 0.02], [0.71, 0.02]] },
  { label: 'Malay', note: '1,403 pairs', values: [[0.82, 0.02], [0.74, 0.02], [0.61, 0.03], [0.73, 0.02]] },
  { label: 'German', note: '961 pairs', values: [[0.69, 0.03], [0.7, 0.03], [0.53, 0.03], [0.56, 0.03]] },
  { label: 'Arabic', note: '864 pairs', values: [[0.86, 0.02], [0.82, 0.03], [0.7, 0.03], [0.75, 0.03]] },
  { label: 'Thai', note: '574 pairs', values: [[0.9, 0.02], [0.89, 0.03], [0.86, 0.03], [0.26, 0.04]] },
  { label: 'Serbo-Croatian', note: '490 pairs', values: [[0.74, 0.04], [0.66, 0.04], [0.56, 0.04], [0.47, 0.04]] },
  { label: 'Korean', note: '460 pairs', values: [[0.86, 0.03], [0.81, 0.04], [0.71, 0.04], [0.58, 0.04]] },
  { label: 'Polish', note: '459 pairs', values: [[0.74, 0.04], [0.69, 0.04], [0.6, 0.04], [0.6, 0.04]] },
  { label: 'Slovak', note: '332 pairs', values: [[0.87, 0.04], [0.83, 0.04], [0.79, 0.04], [0.69, 0.05]] },
  { label: 'Dutch', note: '270 pairs', values: [[0.78, 0.05], [0.73, 0.05], [0.66, 0.06], [0.57, 0.06]] },
  { label: 'Romanian', note: '226 pairs', values: [[0.88, 0.04], [0.84, 0.05], [0.84, 0.05], [0.71, 0.06]] },
  { label: 'Greek', note: '222 pairs', values: [[0.83, 0.05], [0.76, 0.06], [0.63, 0.06], [0.66, 0.06]] },
  { label: 'Czech', note: '211 pairs', values: [[0.88, 0.04], [0.85, 0.05], [0.78, 0.06], [0.69, 0.06]] },
  { label: 'Bulgarian', note: '109 pairs', values: [[0.86, 0.06], [0.81, 0.07], [0.81, 0.07], [0.7, 0.08]] },
  { label: 'Hungarian', note: '107 pairs', values: [[0.89, 0.06], [0.81, 0.07], [0.83, 0.07], [0.51, 0.09]] },
  { label: 'Hindi', note: '106 pairs', values: [[0.79, 0.08], [0.73, 0.08], [0.63, 0.09], [0.61, 0.09]] },
  { label: 'Myanmar', note: '102 pairs', values: [[0.88, 0.06], [0.78, 0.08], [0.75, 0.08], [0.32, 0.09]] },
];

/** Post language to English fact-checks, plus every other combination together. */
export const CROSSLINGUAL_ROWS: DotRow[] = [
  { label: 'Hindi to English', note: '819 pairs', values: [[0.51, 0.03], [0.35, 0.03], [0.2, 0.03], [0.04, 0.01]] },
  { label: 'Chinese to English', note: '509 pairs', values: [[0.67, 0.04], [0.46, 0.04], [0.31, 0.04], [0.02, 0.01]] },
  { label: 'Sinhala to English', note: '456 pairs', values: [[0.48, 0.05], [0.32, 0.04], [0.08, 0.03], [0.03, 0.01]] },
  { label: 'Urdu to English', note: '328 pairs', values: [[0.51, 0.05], [0.35, 0.05], [0.23, 0.05], [0.01, 0.01]] },
  { label: 'Tagalog to English', note: '264 pairs', values: [[0.56, 0.06], [0.37, 0.06], [0.1, 0.04], [0.11, 0.04]] },
  { label: 'Malay to English', note: '249 pairs', values: [[0.63, 0.06], [0.45, 0.06], [0.35, 0.06], [0.08, 0.03]] },
  { label: 'Thai to English', note: '202 pairs', values: [[0.59, 0.07], [0.42, 0.07], [0.3, 0.06], [0.09, 0.04]] },
  { label: 'Korean to English', note: '128 pairs', values: [[0.62, 0.08], [0.42, 0.08], [0.18, 0.07], [0.03, 0.03]] },
  { label: 'Myanmar to English', note: '122 pairs', values: [[0.52, 0.09], [0.38, 0.08], [0.16, 0.06], [0.1, 0.05]] },
  { label: 'Other combinations', note: '1,243 pairs', values: [[0.46, 0.03], [0.36, 0.03], [0.27, 0.02], [0.18, 0.02]] },
];

/** Table 2: average S@10 over languages and same-language bias (SLB), one entry per method and dataset version. */
export const METHODS: { id: string; label: string; family: number; mono: number; cross: number; slb: number }[] = [
  { id: 'BM25-En', label: 'BM25, translated text', family: 3, mono: 0.78, cross: 0.39, slb: 0.18 },
  { id: 'BM25-Og', label: 'BM25, original text', family: 4, mono: 0.62, cross: 0.06, slb: 0.69 },
  { id: 'DistilRoBERTa-En', label: 'DistilRoBERTa (82M), translated text', family: 0, mono: 0.76, cross: 0.43, slb: 0.18 },
  { id: 'GTR-T5-Base-En', label: 'GTR-T5-Base (110M), translated text', family: 0, mono: 0.81, cross: 0.51, slb: 0.19 },
  { id: 'GTR-T5-Large-En', label: 'GTR-T5-Large (336M), translated text', family: 0, mono: 0.83, cross: 0.56, slb: 0.20 },
  { id: 'GTR-T5-XL-En', label: 'GTR-T5-XL (1.2B), translated text', family: 0, mono: 0.83, cross: 0.56, slb: 0.20 },
  { id: 'MPNet-Base-En', label: 'MPNet-Base (109M), translated text', family: 0, mono: 0.78, cross: 0.47, slb: 0.18 },
  { id: 'MSMARCO-BERT-Base-En', label: 'MSMARCO-BERT-Base (109M), translated text', family: 0, mono: 0.78, cross: 0.46, slb: 0.18 },
  { id: 'MiniLM-L12-En', label: 'MiniLM-L12 (33M), translated text', family: 0, mono: 0.80, cross: 0.48, slb: 0.18 },
  { id: 'MultiQA-MPNet-Base-En', label: 'MultiQA-MPNet-Base (109M), translated text', family: 0, mono: 0.80, cross: 0.50, slb: 0.18 },
  { id: 'SGPT-125M-En', label: 'SGPT-125M (125M), translated text', family: 0, mono: 0.63, cross: 0.25, slb: 0.14 },
  { id: 'SGPT-2.7B-En', label: 'SGPT-2.7B, translated text', family: 0, mono: 0.77, cross: 0.50, slb: 0.19 },
  { id: 'Sentence-T5-Base-En', label: 'Sentence-T5-Base (110M), translated text', family: 0, mono: 0.73, cross: 0.37, slb: 0.14 },
  { id: 'Sentence-T5-Large-En', label: 'Sentence-T5-Large (336M), translated text', family: 0, mono: 0.75, cross: 0.41, slb: 0.15 },
  { id: 'Sentence-T5-XL-En', label: 'Sentence-T5-XL (1.2B), translated text', family: 0, mono: 0.78, cross: 0.47, slb: 0.16 },
  { id: 'DistilUSE-Base-Multilingual-En', label: 'DistilUSE-Base-Multilingual (135M), translated text', family: 1, mono: 0.74, cross: 0.40, slb: 0.15 },
  { id: 'DistilUSE-Base-Multilingual-Og', label: 'DistilUSE-Base-Multilingual (135M), original text', family: 2, mono: 0.66, cross: 0.20, slb: 0.16 },
  { id: 'LaBSE-En', label: 'LaBSE (472M), translated text', family: 1, mono: 0.63, cross: 0.22, slb: 0.13 },
  { id: 'LaBSE-Og', label: 'LaBSE (472M), original text', family: 2, mono: 0.69, cross: 0.22, slb: 0.17 },
  { id: 'MPNet-Base-Multilingual-En', label: 'MPNet-Base-Multilingual (278M), translated text', family: 1, mono: 0.75, cross: 0.41, slb: 0.16 },
  { id: 'MPNet-Base-Multilingual-Og', label: 'MPNet-Base-Multilingual (278M), original text', family: 2, mono: 0.70, cross: 0.21, slb: 0.17 },
  { id: 'MiniLM-L2-Multilingual-En', label: 'MiniLM-L2-Multilingual (118M), translated text', family: 1, mono: 0.74, cross: 0.38, slb: 0.16 },
  { id: 'MiniLM-L2-Multilingual-Og', label: 'MiniLM-L2-Multilingual (118M), original text', family: 2, mono: 0.63, cross: 0.15, slb: 0.17 },
  { id: 'XLM-R-En', label: 'XLM-R (278M), translated text', family: 1, mono: 0.72, cross: 0.33, slb: 0.15 },
  { id: 'XLM-R-Og', label: 'XLM-R (278M), original text', family: 2, mono: 0.66, cross: 0.15, slb: 0.16 },
];
