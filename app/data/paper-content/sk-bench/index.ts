import type { PaperPage } from 'app/data/papers';

// The sk-bench project has its own site, so this entry only lists the paper and links there.
export const skBench: PaperPage = {
  slug: 'sk-bench',
  publicationTitle: 'sk-bench: A Native-First Benchmark for Evaluating Large Language Models in Slovak',
  tagline:
    'We built sk-bench, a Slovak benchmark of 30 datasets across ten skill categories made from native rather than machine-translated data, and evaluated 55 open- and closed-weights models on it.',
  external: 'https://slovak-nlp.github.io/sk-bench/en/',
};
