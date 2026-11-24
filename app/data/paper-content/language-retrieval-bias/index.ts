import type { PaperPage } from 'app/data/papers';
import type { DotSeries, DotView, HeatCell } from 'app/components/paper/viz';
import {
  AVERAGE,
  CHINESE,
  FAILURES_BY_LANGUAGE,
  FAILURES_BY_MODEL,
  INSTRUCTION_LANGUAGES,
  LLMS,
  RETRIEVAL_K,
  RETRIEVERS,
  SETTINGS,
  SHORT_STRATEGIES,
  STRATEGIES,
  THEMES,
  THINKING,
  THINKING_STRATEGIES,
  TOP1_CLAIMS,
  TOP20_CLAIMS,
} from './data';

// Source: Vykopal et al., EACL 2026 (aclanthology.org/2026.eacl-long.240). Numbers typed in below come from Table 2
// (language bias), Table 3 (retrieval success), Table 4 (most frequent top-1 claims), Table 5 (LLM re-ranking),
// Table 6 (topics), Tables 7 to 9 and 18 to 21 (Chinese, failures, thinking) and Table 10. Series live in data.ts.

const MODEL_ROWS = [...LLMS, AVERAGE];

/** English instruction first, so the paired line runs from the baseline to the translated instruction. */
const INSTRUCTION_SERIES: DotSeries[] = [
  { label: 'English instruction', tone: 'q3' },
  { label: 'Target-language instruction', tone: 'alt' },
];

/** A row of a paired dot plot: Macro F1 with the English instruction, then with the target-language one. */
const pair = (label: string, english: number, diff: number) => ({
  label,
  values: [
    [english, 0],
    [english + diff, 0],
  ] as [number, number][],
});

const PERCENT_SCALE = (max: number, step: number) => ({
  min: 0,
  max,
  ticks: Array.from({ length: Math.round(max / step) + 1 }, (_, k) => ({ value: k * step, label: `${k * step}%` })),
  decimals: 1,
  labelWidth: 40,
});

const THINKING_VIEWS: DotView[] = SETTINGS.map(({ key, label }) => ({
  label,
  groups: THINKING_STRATEGIES.map((strategy, k) => ({
    label: strategy,
    rows: [
      pair('Thinking off', THINKING[key].offEnglish[k], THINKING[key].off[k]),
      pair('Thinking on', THINKING[key].onEnglish[k], THINKING[key].on[k]),
    ],
  })),
}));

export const languageRetrievalBias: PaperPage = {
  slug: 'language-retrieval-bias',
  publicationTitle: 'Investigating Language and Retrieval Bias in Multilingual Previously Fact-Checked Claim Detection',
  affiliations: [
    'Faculty of Information Technology, Brno University of Technology',
    'Kempelen Institute of Intelligent Technologies, Bratislava',
    'University of Copenhagen',
  ],
  authorAffiliations: {
    'Ivan Vykopal': [1, 2],
    'Antonia Karamolegkou': [3],
    'Jaroslav Kopčan': [2],
    'Qiwei Peng': [3],
    'Tomáš Javůrek': [2],
    'Michal Gregor': [2],
    'Marián Šimko': [2],
  },
  equalContribution: ['Ivan Vykopal', 'Antonia Karamolegkou'],
  tagline:
    'We tested six open LLMs on deciding whether a fact-check fits a social media post, with the instructions translated into every language of the data, and looked at which fact-checks an embedding retriever keeps returning.',
  tldr:
    'Most models do worse when instructed in the post\'s own language than in English, especially with zero-shot or chain-of-thought prompts. A task description or demonstrations close much of the gap, and Gemma3 27B is the one model that gains in every setting. On the retrieval side, a few fact-checks, many of them boilerplate or about COVID-19, come back far more often than their share of the posts would suggest, and the top-ranked fact-check is right for only 38.8% of posts.',
  stats: [
    { value: '6', label: 'open LLMs from Qwen3, Llama3.1 and Gemma3' },
    { value: '21', label: 'languages the instructions were translated into' },
    { value: '38.8%', label: 'of posts get a relevant fact-check at rank 1 with Multilingual E5' },
    { value: '49.5%', label: 'of retrieved claims are about COVID-19, against 23.0% of posts' },
  ],
  lead: {
    type: 'dots',
    title: 'Macro F1 with English and with target-language instructions',
    series: INSTRUCTION_SERIES,
    paired: true,
    domain: [40, 90],
    ticks: [40, 50, 60, 70, 80, 90],
    axisLabel: 'Macro F1',
    switchLabel: 'Pairs',
    views: SETTINGS.map(({ key, label }) => ({
      label,
      groups: STRATEGIES.map((strategy, k) => ({
        label: strategy,
        rows: MODEL_ROWS.map((m) => pair(m.label === 'Average' ? 'Average of the six' : `${m.label} ${m.tag}`, m[key].english[k] as number, m[key].diff[k] as number)),
      })),
    })),
    caption:
      'Table 2 of the paper. Each row joins a model\'s Macro F1 with the English instruction (blue) to its Macro F1 with the instruction in the target language (orange); the line is red where translating the instruction lowered the score. In the cross-lingual views the instruction is in the post language or in the claim language. The paper reports no confidence intervals.',
  },
  overview: [
    'Fact-checkers meet the same claim again and again, in different countries and languages. Previously fact-checked claim detection tries to find the earlier fact-check for a post. A retriever proposes candidates, and an LLM can then judge whether each one is relevant. Both steps can be uneven across languages and across claims.',
    'Language bias is the familiar one: multilingual models do better in English and in other high-resource languages than in the rest. Earlier work gave the models English instructions whatever language the post was in. We translated the prompts into all 20 languages of the data plus Chinese and ran them on AMC-16K, a set of 16,000 annotated post and fact-check pairs. Half the pairs share one language, and half cross languages, so the instruction can be in the post language, the claim language or English.',
    'Retrieval bias is a term we introduce for a retriever that returns some fact-checks more often than others, whether or not they are relevant. It is close to popularity bias in recommender systems. We ran Multilingual E5 and T5 on the 1,239 test pairs of MultiClaim, counted how often each claim came back, and used topic modelling on the claims to see which themes dominate. The study is diagnostic. We do not propose a method, apart from a short test of LLM re-ranking.',
  ],
  approach: [
    {
      type: 'bias-pipeline',
      title: 'Where the two biases sit in claim retrieval',
      strategies: STRATEGIES.map((label, k) => ({ label, tone: ['q3', 'q4', 'q2', 'q7'][k] })),
      languages: INSTRUCTION_LANGUAGES,
      baseline: 'en',
      models: ['Gemma3', 'Qwen3', 'Llama3.1'].map((family) => ({
        family,
        sizes: LLMS.filter((m) => m.label === family)
          .map((m) => m.tag)
          .join(' and '),
      })),
      retrievers: RETRIEVERS.map((r) => r.label),
      topK: 20,
      caption:
        'Redrawn from Figures 1 to 3 of the paper. Top: the existing pipeline and the two biases the paper adds to it. Below: Figure 2 or Figure 3, for the bias picked above. The language-bias runs judge the fixed pairs of AMC-16K, not the output of the retriever.',
    },
    {
      type: 'pipeline',
      title: 'How the study was run',
      steps: [
        {
          title: 'Translate the prompts',
          metric: { value: '21', label: 'instruction languages' },
          detail:
            'The 20 languages of the data plus Chinese. Prompts and task descriptions were translated with the GPT-4.1 API, then reviewed by native or proficient speakers. The answer stays "Yes" or "No" in English. We left out cross-lingual thought from the earlier study, since it translates the texts into English and would hide language effects.',
          chips: ['GPT-4.1', 'Manual review', 'No cross-lingual thought'],
        },
        {
          title: 'Judge the pairs',
          metric: { value: '6', label: 'LLMs, 8B to 70B parameters' },
          detail:
            'Qwen3 8B and 14B, Llama3.1 8B and 70B, Gemma3 12B and 27B, all open. Qwen3 8B was also run in thinking mode, the only one for cost reasons. Temperature was 0 except for thinking mode, which used the settings its authors recommend. The experiments took about 3,250 GPU hours on A40 and H100 cards.',
          chips: ['Qwen3', 'Llama3.1', 'Gemma3', '3,250 GPU hours'],
        },
        {
          title: 'Score',
          metric: { value: 'Macro F1', label: 'only 16% of pairs are relevant' },
          detail:
            'Macro F1 balances the relevant and irrelevant classes. We also report the true negative rate, the share of irrelevant pairs filtered out, and the false negative rate, the share of relevant pairs lost. The bias is the difference in Macro F1 between a target-language and an English instruction.',
          chips: ['Macro F1', 'True negative rate', 'False negative rate'],
        },
        {
          title: 'Retrieve',
          metric: { value: '20', label: 'claims kept per post' },
          detail:
            'Multilingual E5 and T5 embed posts and claims, and cosine similarity ranks the claims. We compute Success@K, MAP and MRR as in the MultiClaim paper, then count how often each claim lands in the top results.',
          chips: ['Multilingual E5', 'T5', 'Cosine similarity'],
        },
        {
          title: 'Model the topics',
          metric: { value: '30', label: 'topics' },
          detail:
            'Claims are embedded with paraphrase-multilingual-MiniLM-L12-v2, and Semantic Signal Separation from the Turftopic library splits them into 30 topics. Each claim goes to its most probable topic, which lets us compare the themes of posts, retrieved claims, and correct and wrong top-1 claims.',
          chips: ['Turftopic', 'Semantic Signal Separation', 'MiniLM'],
        },
      ],
    },
    {
      type: 'prompts',
      title: 'The zero-shot prompt in English, before translation',
      tabs: [
        {
          label: 'System prompt',
          text: 'You are a fact-checker responsible for determining the relevance of previously debunked claims to a given social media post. Your task is to assess if the claim is relevant to the post and whether it is possible to infer main statements from the post from the debunked claim. Based on your analysis, provide one of the following answers:\n- \'Yes\' if the claim is relevant to the social media post.\n- \'No\' if the debunked claim is not relevant to the social media post.',
        },
        {
          label: 'User prompt',
          text: 'Claim: {document}\nPost: {query}\nIs the claim relevant to the social media post? Respond with a single word, either "Yes" or "No", in English only.',
        },
      ],
    },
  ],
  findings: [
    {
      title: 'Instructions in the post\'s language often do worse than English ones',
      summary:
        'On average, translated instructions cost 4.00 Macro F1 at zero-shot on same-language pairs. A task description or demonstrations turn the loss into a small gain, while chain-of-thought still loses 1.31.',
      body: [
        'Zero-shot instructions in the target language lowered Macro F1 for most models, which points to an English default when the model has little context. Adding a task description or ten demonstrations moved the models closer to the English baseline, and on average past it. Qwen3 stayed English-biased at zero-shot and chain-of-thought, with losses of 6.01 and 6.31 points for the 8B model on same-language pairs.',
        'Gemma3 27B is the one model that gained from target-language instructions with every strategy on same-language pairs, by 0.83 to 10.85 points, which we read as strong multilingual ability.',
        'With pairs that cross languages, the post-language instruction helped on average only with a task description or few-shot prompts (+0.34 each), and the claim-language instruction helped a little more (+0.89 and +0.22). Related language pairs such as Slovak and Czech, or Polish and Serbo-Croatian, often did better with the post-language instruction. The per-pair tables are in the appendix of the paper.',
      ],
      viz: [
        {
          type: 'dots',
          title: 'Average Macro F1 of the six models with English and with target-language instructions',
          series: INSTRUCTION_SERIES,
          paired: true,
          domain: [50, 75],
          ticks: [50, 55, 60, 65, 70, 75],
          axisLabel: 'Macro F1',
          views: [
            {
              label: 'Average over six models',
              groups: SETTINGS.map(({ key, label }) => ({
                label,
                rows: STRATEGIES.map((strategy, k) => pair(strategy, AVERAGE[key].english[k] as number, AVERAGE[key].diff[k] as number)),
              })),
            },
          ],
          caption:
            'Average rows of Table 2 of the paper, over the six models and the 20 languages or language pairs. The line is red where the target-language instruction scored lower than English, green where it scored higher. The paper reports no confidence intervals.',
        },
      ],
    },
    {
      title: 'Thinking mode narrows the gap',
      summary:
        'With thinking on, Qwen3 8B loses 2.50 instead of 6.01 Macro F1 at zero-shot when instructed in the target language, and the cross-lingual losses shrink too.',
      body: [
        'Thinking did not make target-language instructions better than English ones. It helped English instructions too, which may mean that its reasoning is tuned more for English. The gap still got smaller, most clearly at zero-shot, and with demonstrations and a task description the differences became marginal. We ran thinking for the 8B model only, without chain-of-thought, because of the compute it needs.',
      ],
      viz: [
        {
          type: 'dots',
          title: 'Qwen3 8B: Macro F1 with English and with target-language instructions, thinking off and on',
          series: INSTRUCTION_SERIES,
          paired: true,
          domain: [50, 85],
          ticks: [50, 55, 60, 65, 70, 75, 80, 85],
          axisLabel: 'Macro F1',
          switchLabel: 'Pairs',
          views: THINKING_VIEWS,
          caption: 'Table 2 of the paper, with Tables 18, 20 and 21 for the per-language detail. No chain-of-thought run exists with thinking.',
        },
      ],
    },
    {
      title: 'Chinese instructions fall behind English ones too',
      summary:
        'Five of six models score lower in Macro F1 on average with Chinese instructions than with English ones. Gemma3 27B is the exception, at +2.75.',
      body: [
        'The losses are largest at zero-shot and with a task description, up to 25.06 points for Llama3.1 8B. English instructions remain the safer choice, probably because pretraining and instruction tuning are mostly English. Gemma3 27B gained with three of the four strategies. A broader language mix in pretraining may help weaker languages and cost English a little.',
      ],
      viz: [
        {
          type: 'heatmap',
          title: 'Change in Macro F1 with Chinese instead of English instructions',
          rows: CHINESE.map((m) => ({ label: `${m.label} ${m.tag}` })),
          columns: STRATEGIES.map((label, k) => ({ label, short: SHORT_STRATEGIES[k] })),
          rowAxis: 'Model',
          columnAxis: 'Prompting strategy',
          scale: { max: 25, tones: ['q3', 'q4'] },
          signed: true,
          views: [{ label: 'All 16K pairs', cells: CHINESE.map((m) => m.diff.map((value): HeatCell => ({ value }))) }],
          caption:
            'Table 7 of the paper. Its printed average for Llama3.1 70B, −1.7, does not match the four values in the row, whose mean is −5.71, so we show the values and not the average.',
        },
      ],
    },
    {
      title: 'Weaker languages and models fail to produce a label more often',
      summary:
        'Burmese stands out: 9.31% of outputs have no parsable label. Llama3.1 8B fails to finish 24.82% of its answers, and Qwen3 8B in thinking mode fails on none.',
      body: [
        'Part of the drop in low-resource languages comes from a failure to follow the output format or from degenerate repetition, and not from a wrong judgement. We found repetitions with a sliding-window check for at least three repeats in a row, and counted outputs without a binary label under language-specific regular expressions as unfinished. These rates cover all 27 model and strategy configurations.',
        'Rates are elevated in several other languages too, such as Malay (2.94%), Korean (2.26%) and English (2.90%). Gemma3 27B fails least of the non-thinking models. The paper reads the thinking result as thinking mode stabilising the output.',
      ],
      viz: [
        {
          type: 'bars',
          title: 'Outputs with no parsable label, by instruction language',
          items: FAILURES_BY_LANGUAGE.map((l) => ({ label: l.label, value: l.unf, highlight: l.label === 'Burmese' })),
          unit: '%',
          max: 10,
          tone: 'danger',
          caption: 'Table 8 of the paper, over all model and prompting combinations including thinking, on the 16K pairs.',
        },
        {
          type: 'bars',
          title: 'Outputs with no parsable label, by model',
          items: FAILURES_BY_MODEL.map((m) => ({ label: m.label, value: m.unf, highlight: m.label.startsWith('Llama') })),
          unit: '%',
          max: 30,
          tone: 'danger',
          caption: 'Table 9 of the paper, over all languages and prompting strategies.',
        },
      ],
    },
    {
      title: 'The top-ranked fact-check is right for fewer than four posts in ten',
      summary:
        'Multilingual E5 reaches Success@1 of 38.8% and Success@20 of 88.5%. T5 is within a few points everywhere. Wrong top-1 matches score about as high on cosine similarity as right ones.',
      body: [
        'Both retrievers behave alike. Figure 4 of the paper shows the top-1 cosine similarity of correct and wrong matches overlapping widely, so a high score is no sign of a correct match. Similar-looking claims are close in the embedding space without being the fact-check for the post. Embedding-only retrieval, by itself, is therefore a weak filter.',
        'Using an LLM to classify each pair as relevant or not in the zero-shot setting raised top-1 accuracy. Qwen3 8B reached 63.12%, against 38.80% for Multilingual E5. Gemma3 12B and Llama3.1 8B improved much less. The paper reads this as LLMs deprioritising frequent but irrelevant claims, with the caveat that mitigation is not the aim of the study.',
      ],
      viz: [
        {
          type: 'grouped',
          title: 'Success@K of the two retrievers on the MultiClaim test split',
          categories: RETRIEVAL_K,
          series: RETRIEVERS.map((r) => ({ label: r.label, tone: r.tone, values: r.success.map((v) => [v, 0] as [number, number]) })),
          scale: PERCENT_SCALE(100, 20),
          caption:
            'Table 3 of the paper, 1,239 posts. Success@K is the share of posts with a relevant claim in the top K. MAP and MRR are 51.23 and 52.43 for T5 and 52.69 and 53.98 for Multilingual E5.',
        },
        {
          type: 'bars',
          title: 'Top-1 accuracy: retrievers against LLM relevance filtering',
          items: [
            { label: 'T5', value: 36.72 },
            { label: 'Multilingual E5', value: 38.8 },
            { label: 'Qwen3 8B', value: 63.12, highlight: true },
            { label: 'Gemma3 12B', value: 42.8, highlight: true },
            { label: 'Llama3.1 8B', value: 38.86, highlight: true },
          ],
          unit: '%',
          max: 100,
          legend: ['LLM filtering of retrieved pairs', 'Retriever alone'],
          caption: 'Table 5 of the paper. The LLMs classify retrieved pairs zero-shot, and top-1 accuracy is the share of posts whose top-scoring relevant claim matches the gold label.',
        },
      ],
    },
    {
      title: 'A few claims come back again and again',
      summary:
        'COVID-19 is 23.0% of the posts but 49.5% of the retrieved claims and 44.8% of the wrong top-1 matches. Boilerplate such as a JavaScript snippet and bare links gets retrieved over and over.',
      body: [
        'Retrieval bias shows as topic skew. High-profile themes are retrieved far more than their share of the posts suggests, and domestic politics is 22.4% of the posts but appears in neither the correct nor the wrong top-1 matches. Retrieval errors may therefore amplify skew that is already in the claim corpus.',
        'Among the claims retrieved at rank 1, ten account for the most hits. Most are readable statements about politics or health, but a truncated JavaScript snippet and a Google Drive link are among them. Over the top 20 results the noise is worse: the JavaScript snippet appears for 159 posts and links to Facebook, Instagram and Google Drive many times each. Dense retrievers match on distributional similarity and cannot tell a malformed entry from a claim, which suggests filtering such entries before retrieval.',
      ],
      viz: [
        {
          type: 'claims',
          title: 'Entries Multilingual E5 returns most often',
          switchLabel: 'Ranking',
          views: [
            { label: 'Ranked first', countLabel: 'Posts it is ranked first for', rows: TOP1_CLAIMS },
            { label: 'In the top 20', countLabel: 'Posts it is in the top 20 for', rows: TOP20_CLAIMS },
          ],
          similarity: { min: 0.75, max: 0.95, ticks: [0.75, 0.85, 0.95] },
          caption:
            'Tables 4 and 10 of the paper, 1,239 test posts. The same JavaScript snippet is the most frequent entry both at rank 1 and in the top 20. At rank 1 the two entries that are not claims have the lowest mean similarity of the ten, so they win without matching any post closely; in the top 20, seven of the ten entries are code or bare links.',
        },
        {
          type: 'grouped',
          title: 'Share of each theme among posts, retrieved claims and top-1 matches',
          categories: THEMES.map((t) => t.label),
          series: [
            { label: 'Posts', tone: 'q4', values: THEMES.map((t) => [t.posts, 0] as [number, number]) },
            { label: 'Retrieved claims', tone: 'q3', values: THEMES.map((t) => [t.claims, 0] as [number, number]) },
            { label: 'Correct top-1 claims', tone: 'q6', values: THEMES.map((t) => [t.tp, 0] as [number, number]) },
            { label: 'Wrong top-1 claims', tone: 'q1', values: THEMES.map((t) => [t.fp, 0] as [number, number]) },
          ],
          scale: PERCENT_SCALE(50, 10),
          caption:
            'Table 6 of the paper, with n = 1,239 posts, 13,861 retrieved claims, and 481 correct and 758 wrong top-1 claims. A bar at 0.0 is a theme outside the top ten topics of that subset, so its share is not reported. This applies to posts for visual and Nigeria themes, correct top-1 matches for Ukraine and politics, and wrong top-1 matches for politics.',
        },
      ],
    },
  ],
  tables: [
    {
      title: 'Models evaluated',
      caption: 'Table 1 of the paper.',
      columns: ['Model', 'Parameters', 'Languages', 'Thinking mode'],
      rows: [
        ['Qwen3', '8B', '100', 'yes'],
        ['Qwen3', '14B', '100', 'no'],
        ['Llama3.1 Instruct', '8B', '8', 'no'],
        ['Llama3.1 Instruct', '70B', '8', 'no'],
        ['Gemma3 IT', '12B', '130', 'no'],
        ['Gemma3 IT', '27B', '130', 'no'],
      ],
    },
    {
      title: 'Generation failures per instruction language',
      caption: 'Table 8 of the paper. Repetitive is degenerate repeated output, unfinished is no parsable label.',
      columns: ['Language', 'Repetitive (%)', 'Unfinished (%)'],
      rows: FAILURES_BY_LANGUAGE.map((l) => [l.label, l.rep.toFixed(2), l.unf.toFixed(2)]),
    },
    {
      title: 'Generation failures per model',
      caption: 'Table 9 of the paper, over all languages and prompting strategies.',
      columns: ['Model', 'Repetitive (%)', 'Unfinished (%)'],
      rows: FAILURES_BY_MODEL.map((m) => [m.label, m.rep.toFixed(2), m.unf.toFixed(2)]),
    },
  ],
  bibtex: `@inproceedings{vykopal-etal-2026-investigating,
  title = "Investigating Language and Retrieval Bias in Multilingual Previously Fact-Checked Claim Detection",
  author = "Vykopal, Ivan and Karamolegkou, Antonia and Kop{\\v{c}}an, Jaroslav and Peng, Qiwei and Jav{\\r{u}}rek, Tom{\\'a}{\\v{s}} and Gregor, Michal and Simko, Marian",
  booktitle = "Proceedings of the 19th Conference of the European Chapter of the Association for Computational Linguistics (Volume 1: Long Papers)",
  month = mar,
  year = "2026",
  address = "Rabat, Morocco",
  publisher = "Association for Computational Linguistics",
  url = "https://aclanthology.org/2026.eacl-long.240/",
  doi = "10.18653/v1/2026.eacl-long.240",
  pages = "5195--5221",
}`,
};
