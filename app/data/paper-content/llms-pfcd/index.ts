import type { PaperPage } from 'app/data/papers';
import type { DotSeries } from 'app/components/paper/viz';
import {
  LANGUAGE_STATS,
  LLMS,
  RELEVANT_CROSS,
  RELEVANT_MONO,
  TECHNIQUES,
  averageRows,
  baselineRows,
  classTechniqueRows,
  mean,
} from './data';

// Source: Vykopal et al., Findings of EMNLP 2025 (aclanthology.org/2025.findings-emnlp.852). Numbers typed in below come
// from Table 1 (models), Table 2 (Macro F1), Table 3 (dataset), Table 4 (relevant pairs), Table 5 (retrieval), Table 9
// (output errors) and the running text. Per-model and per-language series live in data.ts next to this file.

const INPUT_SERIES: DotSeries[] = [
  { label: 'Original language', tone: 'q4' },
  { label: 'English translation', tone: 'q3' },
];

const SETTING_VIEWS = [
  { label: 'Same language', setting: 'mono' },
  { label: 'Across languages', setting: 'cross' },
] as const;

const F1_AXIS = { domain: [0.4, 0.9] as [number, number], ticks: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9], axisLabel: 'Macro F1' };

const MODEL_NAMES = LLMS.map((m) => `${m.label} ${m.tag}`);

const SHORT_TECHNIQUES = ['ZS', 'ZS + task', 'FS + task', 'CoT', 'XLT'];

/** Original against English text, for one prompting strategy, one measure per switch position. */
const translationMetrics = [0, 1, 2, 3].map((k) => ({
  label: TECHNIQUES[k],
  hint: 'higher is better',
  min: 0.4,
  max: 0.9,
  a: LLMS.map((m) => (m.og.mono[k] as number) / 100),
  b: LLMS.map((m) => (m.en.mono[k] as number) / 100),
}));

export const llmsPfcd: PaperPage = {
  slug: 'llms-pfcd',
  publicationTitle: 'Large Language Models for Multilingual Previously Fact-Checked Claim Detection',
  affiliations: [
    'Faculty of Information Technology, Brno University of Technology',
    'Kempelen Institute of Intelligent Technologies, Bratislava',
    'German Research Center for Artificial Intelligence (DFKI), Saarbrücken',
    'Centre for European Research in Trusted AI (CERTAIN)',
  ],
  authorAffiliations: {
    'Ivan Vykopal': [1, 2],
    'Matúš Pikuliak': [2],
    'Simon Ostermann': [3, 4],
    'Tatiana Anikina': [3],
    'Michal Gregor': [2],
    'Marián Šimko': [2],
  },
  tagline:
    'We asked seven open LLMs whether a fact-check is relevant to a social media post, in 20 languages and 20 language pairs, on 16,000 post and fact-check pairs that we labelled by hand.',
  tldr:
    'Large models judge relevance well in high-resource languages and fall behind in low-resource ones and in languages with non-Latin scripts. Translating the texts into English helps most for the smaller models and the weaker languages. No prompting strategy wins everywhere: demonstrations suit the large models, step-by-step reasoning suits the small ones.',
  stats: [
    { value: '16,000', label: 'post and fact-check pairs labelled by hand' },
    { value: '7', label: 'open LLMs, from 7B to 123B parameters' },
    { value: '20', label: 'languages, plus 20 language pairs' },
    { value: '16%', label: 'of the pairs are relevant' },
  ],
  lead: {
    type: 'dots',
    title: 'Average Macro F1 of baselines and LLMs on original and translated text',
    series: INPUT_SERIES,
    ...F1_AXIS,
    switchLabel: 'Pairs',
    views: SETTING_VIEWS.map(({ label, setting }) => ({
      label,
      groups: [
        { label: 'Baselines', rows: baselineRows(setting) },
        { label: 'LLMs with 70B or more parameters', rows: averageRows(setting, true) },
        { label: 'LLMs with fewer than 10B parameters', rows: averageRows(setting, false) },
      ],
    })),
    caption:
      'Table 2 of the paper. Each LLM is averaged over its prompting strategies; English input is averaged without cross-lingual thought, which already translates. GTR-T5 reads English only. The paper reports no confidence intervals for these averages.',
  },
  overview: [
    'Fact-checkers often meet a claim that has already been checked, sometimes in another country and another language. Finding the earlier fact-check saves them the work. The task is called previously fact-checked claim detection. A retrieval system proposes fact-checks for a post, and something has to decide which of them are really relevant.',
    'We gave that decision to LLMs. The model sees a post and a fact-checked claim and answers yes or no: is the claim relevant to the post? We call a claim relevant if it helps verify the post, whether it supports or refutes it. That includes entailment and contradiction, but also partial overlap and generalisation. Earlier LLM work used stricter entailment labels or re-ranked retrieved claims, and neither matches how fact-checkers work.',
    'We built the test data from MultiClaim. An embedding model retrieved candidate fact-checks for posts in 20 languages, both in the post\'s own language and across languages, and six annotators judged every pair. We then tested seven LLMs with five prompting strategies, on the original text and on the English translations that ship with MultiClaim, against four baselines.',
    'Figure 1 of the paper shows the task. A French Facebook post complains about "2 billion men for 5 billion women in the world". Multilingual E5 retrieved four fact-checks for it. The two that cite United Nations figures of 5.6 billion women and 2.2 billion men are relevant. The two about Iceland paying immigrants to marry and about Obamacare are not. An embedding model ranks all four as close, and the LLM has to tell them apart.',
  ],
  approach: [
    {
      type: 'flow',
      title: 'The pipeline: retrieve candidates, then let an LLM decide which are relevant',
      stages: [
        {
          label: '1 Retrieval',
          nodes: [
            { title: 'Social media post', sub: 'the query, in one of 20 languages', tone: 'q4' },
            {
              title: 'Retriever',
              sub: 'Multilingual E5 Large embeddings',
              input: { title: 'MultiClaim', sub: 'dataset of 206K fact-checks in 39 languages' },
            },
            {
              title: 'Most similar fact-checks',
              sub: 'top 10 in the post\'s language, or top 100 in other languages',
              tone: 'q3',
            },
          ],
        },
        {
          label: '2 Relevance classification with LLMs',
          nodes: [
            { title: 'Post and fact-checked claim', sub: 'one pair at a time', tone: 'q4' },
            {
              title: 'Prompt',
              sub: 'task description and one of five strategies',
              chips: ['Zero-shot', 'Zero-shot + task', 'Few-shot', 'Chain-of-thought', 'Cross-lingual thought'],
            },
            { title: 'LLM', sub: 'seven open models, 7B to 123B parameters', tone: 'q6' },
          ],
          outcomes: [
            { title: 'Relevant', sub: 'kept for the fact-checker', tone: 'safe' },
            { title: 'Not relevant', sub: 'filtered out', tone: 'idle' },
          ],
        },
      ],
      caption:
        'After Figure 2 of the paper. The retriever returns the closest previously fact-checked claims for a post. The LLM then answers yes or no for each pair and removes the false positives.',
    },
    {
      type: 'pipeline',
      title: 'How the pairs were built and the LLMs tested',
      steps: [
        {
          title: 'Retrieve',
          metric: { value: '16,000', label: 'candidate pairs, 8,000 per setting' },
          detail:
            'For each of 20 languages we took 40 posts and retrieved the 10 closest fact-checks in the same language with Multilingual E5 Large. For 20 language pairs, such as Slovak posts with English fact-checks, we retrieved 100 fact-checks per post in other languages and sampled 400 pairs per pair of languages.',
          chips: ['MultiClaim', 'Multilingual E5 Large', '20 languages', '20 language pairs'],
        },
        {
          title: 'Annotate',
          metric: { value: '6', label: 'annotators, one label per pair' },
          detail:
            'Each pair was labelled relevant, irrelevant or cannot tell, using guidelines we publish with the data. One author resolved every cannot-tell case. Agreement on shared test sets was moderate before annotation (Fleiss\' kappa 0.60) and substantial after it (0.62).',
          chips: ['Original and English text shown', 'Fleiss\' kappa 0.60 and 0.62'],
        },
        {
          title: 'Prompt',
          metric: { value: '5', label: 'prompting strategies' },
          detail:
            'The prompts follow the annotation guidelines. Few-shot prompts carry ten demonstrations, five relevant and five irrelevant, picked by similarity from earlier annotated MultiClaim pairs. Cross-lingual thought asks the model to translate both texts into English first.',
          chips: ['Zero-shot', 'Zero-shot + task description', 'Few-shot', 'Chain-of-thought', 'Cross-lingual thought'],
        },
        {
          title: 'Classify',
          metric: { value: '7', label: 'LLMs and 4 baselines' },
          detail:
            'Four models have 70B or more parameters and three have fewer than 10B. The large ones run quantised. Baselines are two embedding models with a similarity threshold tuned for Youden\'s index and two NLI models that count entailment as relevant.',
          chips: ['Mistral Large', 'Command R+', 'Qwen2.5', 'Llama3.1', 'Mistral 7B'],
        },
        {
          title: 'Score',
          metric: { value: 'Macro F1', label: 'also true and false negative rates' },
          detail:
            'Only 16% of the pairs are relevant, so we report Macro F1. We also report the share of irrelevant pairs filtered out correctly and the share of relevant pairs lost, since a filter that drops good fact-checks is costly. Significance comes from Mann-Whitney U and Kruskal-Wallis tests at p < 0.05.',
          chips: ['Macro F1', 'True negative rate', 'False negative rate'],
        },
      ],
    },
    {
      type: 'prompts',
      title: 'The prompts, as used with Mistral Large',
      tabs: [
        {
          label: 'Zero-shot',
          text: 'Claim: [DOCUMENT]\n\nPost: [QUERY]\n\nIs the claim relevant to the social media post? Respond with a single word, either "Yes" or "No", in English only.',
        },
        {
          label: 'Task description',
          text: 'System: You are a fact-checker responsible for determining the relevance of previously debunked claims to a given social media post. Your task is to assess if the claim is relevant to the post and whether it is possible to infer main statements from the post from the debunked claim.\n\nBased on your analysis, provide one of the following answers:\n- \'Yes\' if the claim is relevant to the social media post.\n- \'No\' if the debunked claim is not relevant to the social media post.\n\nClaim: [DOCUMENT]\n\nPost: [QUERY]\n\nIs the claim relevant to the social media post? Respond with a single word, either "Yes" or "No", in English only.',
        },
        {
          label: 'Few-shot',
          text: 'System: [THE TASK DESCRIPTION, ENDING IN] Respond with a single word, either "Yes" or "No", in English only.\n\nClaim: [DEMONSTRATION CLAIM]\nPost: [DEMONSTRATION POST]\nAnswer: Yes\n\n[TEN DEMONSTRATIONS IN ALL, FIVE YES AND FIVE NO, IN RANDOM ORDER]\n\nClaim: [DOCUMENT]\nPost: [QUERY]\nAnswer: ',
        },
        {
          label: 'Chain-of-thought',
          text: 'System: [THE TASK DESCRIPTION, ENDING IN] First think about the relevance by generating reasoning and then provide the answer as \'Answer: Yes/No\'.\n\nClaim: [DOCUMENT]\n\nPost: [QUERY]\n\n{+Let\'s think step by step.+}',
        },
        {
          label: 'Cross-lingual thought',
          text: 'I want you to act as a fact-checker.\nClaim: [DOCUMENT]\nPost: [QUERY]\n{+You should retell the claim and the post in English.+}\nYou should determine whether the claim is relevant to the social media post.\nYou should step-by-step answer the request.\nYou should tell me Yes if the claim is relevant to the post, otherwise No, in this format \'Answer: Yes/No\'.',
        },
      ],
    },
    {
      type: 'dots',
      title: 'Preliminary zero-shot screen of 16 LLMs, with and without a task description',
      series: [
        { label: 'Zero-shot', tone: 'q4' },
        { label: 'Zero-shot + task description', tone: 'q3' },
      ],
      domain: [0.5, 0.9],
      ticks: [0.5, 0.6, 0.7, 0.8, 0.9],
      axisLabel: 'Macro F1',
      views: [
        {
          label: 'Macro F1',
          groups: [
            {
              rows: (
                [
                  ['Mistral 7B', 0.7, 0.7],
                  ['Qwen2 7B', 0.68, 0.68],
                  ['Qwen2.5 7B', 0.73, 0.81],
                  ['Llama3 8B', 0.68, 0.69],
                  ['Llama3.1 8B', 0.58, 0.72],
                  ['AYA Expanse 8B', 0.72, 0.71],
                  ['AYA Expanse 32B', 0.77, 0.67],
                  ['AYA 35B', 0.72, 0.82],
                  ['C4AI Command R 35B', 0.77, 0.57],
                  ['Llama3 70B', 0.71, 0.7],
                  ['Llama3.1 70B', 0.79, 0.71],
                  ['Llama3.1 Nemotron 70B', 0.79, 0.58],
                  ['Qwen2 72B', 0.79, 0.78],
                  ['Qwen2.5 72B', 0.81, 0.75],
                  ['C4AI Command R+ 104B', 0.84, 0.8],
                  ['Mistral Large 123B', 0.84, 0.74],
                ] as const
              ).map(([label, a, b]) => ({ label, values: [[a, 0], [b, 0]] as [number, number][] })),
            },
          ],
        },
      ],
      caption:
        'Table 6 of the paper, on the 3,390 pairs annotated for the MultiClaim paper. We then dropped the older Llama3 and Qwen2 versions and AYA Expanse 8B, which did worse with a task description, and added the three smaller models. The paper reports no confidence intervals.',
    },
  ],
  findings: [
    {
      title: 'Large models lead, and small ones can keep up with the right prompt',
      summary:
        'The best LLMs reach a Macro F1 above 80%. Models with 70B or more parameters beat the smaller ones significantly, with Mistral Large and Command R+ in front. Llama3.1 8B and Mistral 7B trail the baselines in most strategies.',
      body: [
        'Many models and prompts beat all four baselines. The strongest baselines were Multilingual E5 Large and GTR-T5 on translated text, and DeBERTa v3 Large on original text. DeBERTa is fine-tuned on English NLI data and did well in several languages when post and fact-check shared one, but it struggled with low-resource and non-Latin languages, and the weaker LLMs scored below it.',
        'Training on more languages did not decide the ranking. Command R+, trained on 23 languages, scored well in many of them. Mistral Large, with 11, did as well or better once few-shot or reasoning prompts were used. Among the small models Qwen2.5 7B was the most consistent: with chain-of-thought it scored 0.81 within a language, close to the best large models.',
      ],
      viz: [
        {
          type: 'heatmap',
          title: 'Macro F1 of every model and prompting strategy',
          rows: MODEL_NAMES.map((label, i) => ({ label, separated: i === 4 })),
          columns: TECHNIQUES.map((label, k) => ({ label, short: SHORT_TECHNIQUES[k] })),
          rowAxis: 'Model',
          columnAxis: 'Prompting strategy',
          scale: { max: 0.9, tones: ['q1', 'q3'] },
          decimals: 2,
          switchLabel: 'View',
          views: (
            [
              ['Original, same language', 'og', 'mono'],
              ['Original, across languages', 'og', 'cross'],
              ['English, same language', 'en', 'mono'],
              ['English, across languages', 'en', 'cross'],
            ] as const
          ).map(([label, version, setting]) => ({
            label,
            cells: LLMS.map((m) => m[version][setting].map((x) => ({ value: x === null ? null : x / 100 }))),
          })),
          caption:
            'Table 2 of the paper. ZS is zero-shot, FS few-shot, CoT chain-of-thought and XLT cross-lingual thought. English input has no XLT run, because that strategy already translates. The paper reports no confidence intervals.',
        },
      ],
    },
    {
      title: 'Large models like demonstrations, small ones like reasoning',
      summary:
        'Few-shot prompting gave the best results for Mistral Large and Qwen2.5 72B. The models under 10B did better with chain-of-thought, and a task description alone lifted Llama3.1 8B from 0.49 to 0.71 Macro F1.',
      body: [
        'No strategy was best everywhere. Command R+ was best at zero-shot with a task description, while Mistral Large led with few-shot, chain-of-thought and cross-lingual thought on original text. Chain-of-thought also did well for Llama3.1 and Mistral Large. Few-shot prompting needs demonstrations chosen with care.',
        'Across languages the models lost about 4.5% on average, more for the small ones. Few-shot prompting worked well for multilingual models there, and chain-of-thought narrowed the gap for the small ones, by about 5% against cross-lingual thought.',
      ],
      viz: [
        {
          type: 'dots',
          title: 'Mean Macro F1 of each size class for each prompting strategy',
          series: INPUT_SERIES,
          ...F1_AXIS,
          switchLabel: 'Pairs',
          views: SETTING_VIEWS.map(({ label, setting }) => ({
            label,
            groups: [
              { label: 'LLMs with 70B or more parameters', rows: classTechniqueRows(true, setting) },
              { label: 'LLMs with fewer than 10B parameters', rows: classTechniqueRows(false, setting) },
            ],
          })),
          caption:
            'Computed from the per-model scores in Table 2 of the paper. The paper reports no confidence intervals for these means.',
        },
        {
          type: 'dumbbell',
          title: 'Macro F1 within a language and across languages, per model',
          rows: MODEL_NAMES,
          series: ['Same language', 'Across languages'],
          switchLabel: 'Input',
          metrics: [
            {
              label: 'Original language',
              hint: 'higher is better',
              min: 0.4,
              max: 0.9,
              a: LLMS.map((m) => mean(m.og.mono) / 100),
              b: LLMS.map((m) => mean(m.og.cross) / 100),
            },
            {
              label: 'English translation',
              hint: 'higher is better',
              min: 0.4,
              max: 0.9,
              a: LLMS.map((m) => mean(m.en.mono) / 100),
              b: LLMS.map((m) => mean(m.en.cross) / 100),
            },
          ],
          caption:
            'Table 2 of the paper, averaged over prompting strategies (English input without cross-lingual thought).',
        },
      ],
    },
    {
      title: 'Low-resource and non-Latin languages fall behind',
      summary:
        'LLMs worked well in English and other high-resource languages. They did worse in Slavic languages, Hungarian and Burmese, and in languages with non-Latin scripts.',
      body: [
        'Between languages, high-resource ones scored higher in most cases. The gap is not purely about language: it persisted after we translated everything into English, so the difficulty of the data differs between languages too. Topic mix probably matters, and languages that cover a wider range of topics may be easier.',
        'Some languages lack explicit support in any of the models, yet the models still handle part of the task. We assume the diversity of their training data explains it. The paper concludes that non-English settings need tailored adaptation.',
      ],
    },
    {
      title: 'Translating into English helps most where models are weak',
      summary:
        'English translation raised scores in most settings, most for models with limited multilingual ability and for non-Latin scripts. Llama3.1 gained up to 16% Macro F1 with few-shot prompts.',
      body: [
        'Command R+ is the exception: trained on many languages, it did better on original text. With few-shot prompting the translation even hurt Mistral Large and Qwen2.5 7B.',
        'Chain-of-thought with translation added only a little over chain-of-thought alone, so reasoning in the original language can stand in for translation. Translation remains the safer choice for weak languages and small models.',
      ],
      viz: [
        {
          type: 'dumbbell',
          title: 'Original language against English translation, per model',
          rows: MODEL_NAMES,
          series: ['Original language', 'English translation'],
          switchLabel: 'Strategy',
          metrics: translationMetrics,
          caption:
            'Table 2 of the paper, same-language pairs. The cross-lingual pairs behave the same way. Cross-lingual thought is left out because it translates by itself.',
        },
      ],
    },
    {
      title: 'Models mistake a shared topic for relevance',
      summary:
        'About 65% of the reasoning errors we examined came from judging two texts relevant because they share a topic, mostly COVID-19 and vaccination. The Llama3.1 models also often answered in the wrong language.',
      body: [
        'We read 420 wrong answers from chain-of-thought and cross-lingual thought runs. Around 7% argued against themselves: the model correctly found the statements unrelated and then said yes because the topics matched. Others lacked context, for instance a post that refers to an image or video we could not give the model. We left out posts with links to images, but some posts that mentioned an image without a link remained.',
        'Besides wrong reasoning there were failures of format. Llama3.1 8B repeated sequences 215 times with chain-of-thought, Llama3.1 refused five pairs because of disinformation content, and the Llama3.1 models often answered in a language other than English although asked for English. We counted a response as non-English only when both FastText and langdetect agreed.',
      ],
      viz: [
        {
          type: 'stacked',
          title: 'Why the misclassified samples were wrong',
          segments: [
            { label: 'Judged relevant from topic similarity', tone: 'danger' },
            { label: 'Contradictory reasoning', tone: 'warn' },
            { label: 'Other, including missing context', tone: 'idle' },
          ],
          views: [{ label: 'All', groups: [{ rows: [{ label: 'Reasoning errors', values: [65, 7, 28] }] }] }],
          caption:
            'Section 5.2 of the paper, 420 samples read by hand. The paper gives "around 65%" and "approximately 7%"; the remainder is computed here.',
        },
        {
          type: 'bars',
          title: 'Chain-of-thought answers written in a language other than English',
          items: [
            { label: 'Llama3.1 8B', value: 37, highlight: true },
            { label: 'Llama3.1 70B', value: 28, highlight: true },
          ],
          unit: '%',
          max: 100,
          caption: 'Section 5.1 of the paper, original-language input. Table 9 of the paper counts the errors of every model and strategy.',
        },
      ],
    },
    {
      title: 'Most retrieved fact-checks are not relevant',
      summary:
        'Only 16% of the 16,000 annotated pairs were relevant, and the share varies widely between languages, from 9.5% for Burmese posts to 38.5% for English ones. Pairs across languages were relevant less often than pairs within one.',
      body: [
        'We annotated pairs retrieved by an embedding model, so the relevant share says how much noise an LLM filter would have to remove. In English, Malay, Portuguese and German it exceeded 30%.',
        'Each pair has a single label. To check the labels we measured agreement on shared sets, which reached substantial agreement (kappa 0.62). Posts and claims also differ in length from language to language, as the dataset table below shows.',
      ],
      viz: [
        {
          type: 'bars',
          title: 'Share of relevant pairs among 400 annotated, same-language pairs',
          items: RELEVANT_MONO,
          unit: '%',
          max: 40,
          caption: 'Table 4 of the paper.',
        },
        {
          type: 'bars',
          title: 'Share of relevant pairs among 400 annotated, cross-lingual pairs',
          items: RELEVANT_CROSS,
          unit: '%',
          max: 40,
          caption: 'Table 4 of the paper.',
        },
      ],
    },
  ],
  tables: [
    {
      title: 'Models evaluated',
      caption: 'Table 1 of the paper.',
      columns: ['Model', 'Parameters', 'Languages', 'Organization'],
      rows: [
        ['Mistral Large', '123B', '11', 'Mistral AI'],
        ['C4AI Command R+', '104B', '23', 'Cohere For AI'],
        ['Qwen2.5 Instruct', '72B', '29', 'Alibaba'],
        ['Llama3.1 Instruct', '70B', '8', 'Meta'],
        ['Llama3.1 Instruct', '8B', '8', 'Meta'],
        ['Qwen2.5 Instruct', '7B', '29', 'Alibaba'],
        ['Mistral Instruct v3', '7B', '1', 'Mistral AI'],
      ],
    },
    {
      title: 'AMC-16K statistics per language',
      caption:
        'Table 3 of the paper. Word counts are the mean with the standard deviation. Posts and claims are the numbers of posts and fact-checked claims in the language.',
      columns: ['Language', 'Words per post', 'Words per claim', 'Posts', 'Claims'],
      rows: LANGUAGE_STATS,
    },
    {
      title: 'Quality of the retrieval step',
      caption:
        'Table 5 of the paper: average results over 20 languages on the same posts, within a language. AMC-16K has more known pairs because of our annotation, so scores are higher there.',
      columns: ['Model', 'MultiClaim S@10', 'MAP', 'MRR', 'AMC-16K S@10', 'MAP', 'MRR'],
      rows: [
        ['BGE-M3', '0.73', '0.62', '0.65', '0.77', '0.73', '0.81'],
        ['DistilUSE-Base-Multilingual', '0.58', '0.45', '0.48', '0.57', '0.50', '0.60'],
        ['LaBSE', '0.62', '0.48', '0.51', '0.60', '0.54', '0.64'],
        ['Multilingual E5 Small', '0.70', '0.58', '0.61', '0.73', '0.64', '0.73'],
        ['Multilingual E5 Base', '0.69', '0.58', '0.62', '0.73', '0.66', '0.74'],
        ['Multilingual E5 Large', '0.74', '0.61', '0.65', '0.87', '0.75', '0.80'],
        ['MiniLM-L12-Multilingual', '0.57', '0.43', '0.45', '0.55', '0.47', '0.56'],
        ['MPNet-Base-Multilingual', '0.62', '0.48', '0.51', '0.61', '0.54', '0.63'],
      ],
    },
    {
      title: 'Output errors of the reasoning prompts',
      caption:
        'Table 9 of the paper: counts of responses. Original is the original-language input and English the translated one.',
      columns: ['Model', 'Strategy', 'Incorrect language', 'Repeating sequences', 'Refusals'],
      rows: [
        ['Mistral Large 123B', 'CoT, original', '0', '0', '0'],
        ['Mistral Large 123B', 'CoT, English', '0', '0', '0'],
        ['Mistral Large 123B', 'XLT, original', '0', '16', '0'],
        ['C4AI Command R+ 104B', 'CoT, original', '3', '0', '0'],
        ['C4AI Command R+ 104B', 'CoT, English', '0', '0', '0'],
        ['C4AI Command R+ 104B', 'XLT, original', '0', '4', '0'],
        ['Qwen2.5 72B', 'CoT, original', '0', '0', '0'],
        ['Qwen2.5 72B', 'CoT, English', '0', '0', '0'],
        ['Qwen2.5 72B', 'XLT, original', '8', '11', '0'],
        ['Llama3.1 70B', 'CoT, original', '5,970', '0', '0'],
        ['Llama3.1 70B', 'CoT, English', '1', '2', '0'],
        ['Llama3.1 70B', 'XLT, original', '20', '33', '0'],
        ['Llama3.1 8B', 'CoT, original', '4,556', '215', '1'],
        ['Llama3.1 8B', 'CoT, English', '0', '5', '3'],
        ['Llama3.1 8B', 'XLT, original', '11', '0', '1'],
        ['Qwen2.5 7B', 'CoT, original', '7', '1', '0'],
        ['Qwen2.5 7B', 'CoT, English', '0', '0', '0'],
        ['Qwen2.5 7B', 'XLT, original', '2', '1', '0'],
        ['Mistral 7B v3', 'CoT, original', '0', '0', '0'],
        ['Mistral 7B v3', 'CoT, English', '0', '0', '0'],
        ['Mistral 7B v3', 'XLT, original', '23', '0', '0'],
      ],
    },
  ],
  bibtex: `@inproceedings{vykopal-etal-2025-large,
  title = "Large Language Models for Multilingual Previously Fact-Checked Claim Detection",
  author = "Vykopal, Ivan and Pikuliak, Mat{\\'u}{\\v{s}} and Ostermann, Simon and Anikina, Tatiana and Gregor, Michal and Simko, Marian",
  booktitle = "Findings of the Association for Computational Linguistics: EMNLP 2025",
  year = "2025",
  address = "Suzhou, China",
  publisher = "Association for Computational Linguistics",
  url = "https://aclanthology.org/2025.findings-emnlp.852/",
  doi = "10.18653/v1/2025.findings-emnlp.852",
  pages = "15741--15765",
}`,
};
