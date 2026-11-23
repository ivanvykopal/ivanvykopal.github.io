import type { PaperPage } from 'app/data/papers';
import type { DotSeries, ScatterFamily, ScatterPoint } from 'app/components/paper/viz';
import { CROSSLINGUAL_ROWS, LANGUAGES, METHODS, MONOLINGUAL_ROWS } from './multiclaim-data';

// Source: Pikuliak et al., EMNLP 2023 (aclanthology.org/2023.emnlp-main.1027). Numbers typed in below come from
// Table 1 (dataset comparison), Table 3 (data splits), Table 4 (supervised and annotated results) and the running
// text. Per-language and per-method series live in multiclaim-data.ts.

/** The four methods the paper follows through Sections 4 to 6, in the order of the data rows. */
const FOUR_METHODS: DotSeries[] = [
  { label: 'GTR-T5, translated', tone: 'q3' },
  { label: 'BM25, translated', tone: 'q1' },
  { label: 'MPNet, original', tone: 'q6' },
  { label: 'BM25, original', tone: 'q4' },
];

const FAMILIES: ScatterFamily[] = [
  { label: 'English models, translated text', tone: 'q3' },
  { label: 'Multilingual models, translated text', tone: 'q6' },
  { label: 'Multilingual models, original text', tone: 'q6', hollow: true },
  { label: 'BM25, translated text', tone: 'q1' },
  { label: 'BM25, original text', tone: 'q4', hollow: true },
];

/** Short names printed beside a few landmark points. */
const NAMED: Record<string, string> = {
  'GTR-T5-Large-En': 'GTR-T5-Large',
  'MiniLM-L12-En': 'MiniLM-L12',
  'SGPT-125M-En': 'SGPT-125M',
  'BM25-En': 'BM25',
  'BM25-Og': 'BM25',
  'MPNet-Base-Multilingual-Og': 'MPNet',
  'LaBSE-En': 'LaBSE',
};

const point = (m: (typeof METHODS)[number], x: number, y: number): ScatterPoint => ({
  id: m.id,
  label: m.label,
  family: m.family,
  x,
  y,
  named: NAMED[m.id],
});

/** Figure 5 of the paper leaves BM25 out: its same-language bias is built in, not learned. */
const EMBEDDING_MODELS = METHODS.filter((m) => m.family < 3);

/** Row groups of the results table, by index into FAMILIES. */
const METHOD_GROUPS = [
  { label: 'BM25', families: [3, 4] },
  { label: 'English embedding models', families: [0] },
  { label: 'Multilingual embedding models', families: [1, 2] },
];

export const multiclaim: PaperPage = {
  slug: 'multiclaim',
  publicationTitle: 'Multilingual Previously Fact-Checked Claim Retrieval',
  affiliations: ['Kempelen Institute of Intelligent Technologies, Bratislava'],
  tagline:
    'We collected 28k social media posts and 206k fact-checks in dozens of languages, paired by professional fact-checkers, and tested how well retrieval methods find the fact-check that matches a post.',
  tldr:
    'Translating everything into English and searching with an English embedding model worked best in almost every language, and by a wide margin when the post and the fact-check are in different languages. Language filters, the number of fact-checks searched and missing labels all change which method looks best, and a single averaged score hides them.',
  stats: [
    { value: '28,092', label: 'social media posts in 27 languages' },
    { value: '205,751', label: 'fact-checks in 39 languages' },
    { value: '31,305', label: 'post and fact-check pairs' },
    { value: '4,212', label: 'pairs across two languages' },
  ],
  lead: {
    type: 'paired',
    title: 'Fact-checks and posts in each language of MultiClaim',
    left: { label: 'Fact-checks', tone: 'q3' },
    right: { label: 'Posts', tone: 'alt' },
    rows: LANGUAGES,
    caption:
      'Table 5 of the paper: the 44 languages with at least 50 fact-checks or 50 posts. Each side has its own scale. A post can mix two languages and then counts for both, so the posts add up to more than 28,092. Urdu has posts but no fact-checks, so every Urdu post is paired with a fact-check in another language.',
  },
  overview: [
    'Fact-checkers often run into claims that someone has already checked, sometimes in another country and another language. Finding that earlier fact-check saves them from doing the work again. The task is called previously fact-checked claim retrieval: given a social media post, rank a collection of fact-checks so that the ones addressing the claim in the post come first. Before this work it had been studied in English and a handful of other languages, and only with the post and the fact-check in the same language.',
    'We built MultiClaim from fact-checks listed in Google Fact Check Explorer and other large sources such as Snopes, and from the Facebook, Instagram and Twitter posts those fact-checks were attached to. Professional fact-checkers made every pair. We translated all texts into English, then measured how often BM25 and 20 text embedding models put the matching fact-check among their top 10 results, on the original texts and on the translations.',
  ],
  approach: [
    {
      type: 'pipeline',
      title: 'How the dataset was built and tested',
      steps: [
        {
          title: 'Fact-checks',
          metric: { value: '205,751', label: 'fact-checks from 142 organizations' },
          detail:
            'We collected most fact-checks listed in Google Fact Check Explorer and added large sources it was missing. For each one we keep the checked claim, the title, the date and the URL, but not the article itself. The claim is usually a one-sentence summary of what was checked.',
          chips: ['Google Fact Check Explorer', 'Snopes', 'AFP', '39 languages'],
        },
        {
          title: 'Posts',
          metric: { value: '28,092', label: 'social media posts in 27 languages' },
          detail:
            'Posts come from two places. Some fact-checks list the posts they review in their ClaimReview markup. Others link to Facebook or Instagram posts in their text, and those platforms attach warnings to the posts that point back to fact-checks.',
          chips: ['Facebook', 'Instagram', 'Twitter'],
        },
        {
          title: 'Pairs',
          metric: { value: '31,305', label: 'pairs made by fact-checkers' },
          detail:
            'Every post has at least one fact-check. In 4,212 pairs the post and the fact-check are in different languages. We checked 100 random pairs by hand and 87 were correct. In the other 13 the claim was only in an image or a video.',
          chips: ['Monolingual pairs', 'Crosslingual pairs', '87 of 100 valid'],
        },
        {
          title: 'Translate',
          metric: { value: '2', label: 'versions: original and English' },
          detail:
            'We ran OCR on images attached to the posts, detected the language of every text and machine-translated everything into English. The dataset ships both versions.',
          chips: ['Google Vision OCR', 'Google Translate', 'Language identification'],
        },
        {
          title: 'Rank',
          metric: { value: '21', label: 'retrieval methods compared' },
          detail:
            'Each method ranks the fact-checks for each post. We report success at 10 (S@10): the share of pairs whose fact-check lands in the top 10, with 95% confidence intervals.',
          chips: ['15 English embedding models', '5 multilingual embedding models', 'BM25'],
        },
      ],
    },
  ],
  findings: [
    {
      title: 'Translating into English beats multilingual models',
      summary:
        'English embedding models on machine-translated text were the best option both within a language and across languages. The best of them reached an average S@10 of 0.83 within a language and 0.56 across languages, against 0.70 and 0.22 for the best method on original text.',
      body: [
        'Translation also helped BM25 and, in most cases, the multilingual models themselves. Machine translation covers more languages than the multilingual models do: none of the five was trained on Sinhala or Tagalog.',
        'Model size barely mattered. Among the English models, size and S@10 were uncorrelated (Pearson ρ = 0.03), and how a model was trained mattered more. All three GTR-T5 models sit on the size and performance frontier, and the 33M-parameter MiniLM-L12 comes close to models ten times its size. For the English models, monolingual and crosslingual scores were strongly correlated (ρ = 0.98).',
      ],
      viz: [
        {
          type: 'scatter',
          title: 'Average S@10 of every method within and across languages',
          families: FAMILIES,
          views: [
            {
              label: 'All methods',
              x: { label: 'Monolingual S@10', domain: [0.6, 0.85], ticks: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85] },
              y: { label: 'Crosslingual S@10', domain: [0, 0.6], ticks: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6] },
              points: METHODS.map((m) => point(m, m.mono, m.cross)),
            },
          ],
          caption:
            'Table 2 and Figure 2 of the paper. Scores are averaged over languages with more than 100 pairs. Hover a dot for the model, its size and both scores, or hover a legend entry to isolate a group.',
        },
        {
          type: 'scores',
          title: 'Average S@10 of every method',
          columns: [
            { label: 'Monolingual', tone: 'q3', max: 1, better: 'higher', hint: 'S@10 searching only fact-checks in the language of the post' },
            { label: 'Crosslingual', tone: 'q6', max: 1, better: 'higher', hint: 'S@10 searching all fact-checks' },
            { label: 'Same-language bias', tone: 'q4', max: 1, hint: 'Share of top-10 results in the language of the post' },
          ],
          variants: [
            { label: 'Translated into English', short: 'Translated', badge: 'EN' },
            { label: 'Original language', short: 'Original', badge: '文A', hollow: true },
          ],
          groups: METHOD_GROUPS.map(({ label, families }) => ({
            label,
            rows: METHODS.filter((m) => families.includes(m.family)).map((m) => {
              const [name, size] = m.label.replace(/, (translated|original) text$/, '').split(' (');
              return {
                label: name,
                tag: size?.replace(')', ''),
                variant: m.id.endsWith('-En') ? 0 : 1,
                values: [m.mono, m.cross, m.slb],
              };
            }),
          })),
          caption:
            'Table 2 of the paper. Scores are averaged over languages with more than 100 pairs; the best score in each column is in bold. Filled bars are runs on English translations, outlined bars runs on the original text. Click a column heading to rank all methods by it, and click it again to return to the groups.',
        },
      ],
    },
    {
      title: 'Some languages are much harder than others',
      summary:
        'GTR-T5 on translated text led in almost every language. BM25 on the original text kept up in Spanish, Portuguese and Malay, but it failed in Thai and Myanmar, which do not separate words with spaces.',
      body: [
        'Scores of two monolingual languages cannot be compared directly. Each language is searched only among its own fact-checks, and a small pool is easier to search, so languages with few fact-checks look easier than they are.',
        'Almost all crosslingual pairs are posts from South and East Asia matched with English fact-checks. In Europe and the Americas, posts are mostly matched with fact-checks in their own language. The multilingual MPNet fell to 0.08 for Sinhala and 0.10 for Tagalog, two languages it was not trained on. BM25 on the original text cannot match words across languages at all and is shown only for completeness.',
      ],
      viz: [
        {
          type: 'dots',
          title: 'S@10 per language for the four methods followed through the paper',
          series: FOUR_METHODS,
          switchLabel: 'Pairs',
          axisLabel: 'S@10',
          views: [
            { label: 'Same language', groups: [{ rows: MONOLINGUAL_ROWS }] },
            { label: 'Across languages', groups: [{ rows: CROSSLINGUAL_ROWS }] },
          ],
          caption:
            'Figure 3 and Table 11 of the paper, for languages and language pairs with more than 100 pairs. Lines through the dots are 95% confidence intervals. GTR-T5 is GTR-T5-Large and MPNet is MPNet-Base-Multilingual, the best models on the translated and original text.',
        },
      ],
    },
    {
      title: 'Same-language bias and pool size change the ranking',
      summary:
        'BM25 on original text mostly returns fact-checks in the language of the post. When all fact-checks are searched, that built-in filter alone puts it ahead of the multilingual MPNet (S@10 0.52 against 0.39), although MPNet scores higher in many of the individual languages.',
      body: [
        'We call the tendency to retrieve fact-checks in the language of the post same-language bias and measure it as the share of the top 10 results in that language. For BM25 on original text it is 0.69, against 0.20 or less for every embedding model. To keep this from deciding the comparison, monolingual results search only the fact-checks in the post\'s language.',
        'We think some of this bias is healthy. The embedding models with the most of it were also the best across languages. Language carries information: "Educational institutions are reopening from January 18" could be about any country, but in Bengali it is almost certainly about Bangladesh.',
        'Pool size matters too. We took 100 pairs in each of seven large languages and grew the pool they were searched in from 100 to 2,100 fact-checks. As the pool grew, BM25 on original text did better relative to MPNet in Spanish, Portuguese and French (correlation with pool size ρ = 0.89, 0.94 and 0.88). This suggests that MPNet more often gives high scores to wrong fact-checks, which costs more the larger the pool is. So the best method for a language may depend on how many fact-checks exist in it.',
      ],
      viz: [
        {
          type: 'scatter',
          title: 'Same-language bias of each embedding model against its crosslingual S@10',
          families: FAMILIES.slice(0, 3),
          switchLabel: 'Y axis',
          views: [
            {
              label: 'Crosslingual S@10',
              x: { label: 'Same-language bias', domain: [0.12, 0.21], ticks: [0.12, 0.14, 0.16, 0.18, 0.2] },
              y: { label: 'Crosslingual S@10', domain: [0.1, 0.6], ticks: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6] },
              points: EMBEDDING_MODELS.map((m) => point(m, m.slb, m.cross)),
            },
            {
              label: 'Relative to monolingual',
              x: { label: 'Same-language bias', domain: [0.12, 0.21], ticks: [0.12, 0.14, 0.16, 0.18, 0.2] },
              y: { label: 'Crosslingual / monolingual S@10', domain: [0.2, 0.7], ticks: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7] },
              points: EMBEDDING_MODELS.map((m) => point(m, m.slb, Math.round((m.cross / m.mono) * 100) / 100)),
              note: 'The ratio is computed here from the rounded scores in Table 2.',
            },
          ],
          caption:
            'Figure 5 of the paper, from Table 2. Switch the y axis to see that models with more same-language bias also keep more of their monolingual performance across languages.',
        },
      ],
    },
    {
      title: 'COVID-19 posts and edited media are harder to match',
      summary:
        'Within a language, all four methods scored lower on posts about COVID-19, on posts rated as missing context and on altered photos or videos. Across languages the COVID-19 drop holds for every method, while the rating gaps are small. Twitter posts were the easiest overall.',
      body: [
        'Scores dropped for posts from early 2020 onward. We think the cause is the thousands of similar COVID-19 fact-checks, which make the right one hard to pick out, rather than the new topic: BM25 dropped as well, and a word-matching method is less prone to a shift in topic.',
        'Missing context is defined by what a post leaves out, which probably makes it harder to match by text. Altered photos and videos carry their claim in the picture, which text-only methods cannot see. Matching worked best for posts of about 500 characters. Very short posts give too little to go on, and above 500 characters scores fall gradually. The short length of tweets may also explain why Twitter came out on top.',
        'Pairs where the post is older than the fact-check scored the same as pairs where it is newer (monolingual S@10 of 80.02% against 80.04% for GTR-T5), so we could not measure any leak from fact-checkers quoting the post. GTR-T5 lost ground to BM25 over time, but the trend was not significant (ρ = −0.33, P = 0.17).',
      ],
      viz: [
        {
          type: 'dots',
          title: 'S@10 for groups of posts',
          series: FOUR_METHODS,
          switchLabel: 'Pairs',
          axisLabel: 'S@10',
          views: [
            {
              label: 'Same language',
              groups: [
                {
                  label: 'Topic',
                  rows: [
                    { label: 'COVID-19', note: '4,159', values: [[0.72, 0.01], [0.68, 0.01], [0.5, 0.02], [0.6, 0.01]] },
                    { label: 'Other topics', note: '22,615', values: [[0.83, 0.0], [0.75, 0.01], [0.66, 0.01], [0.7, 0.01]] },
                  ],
                },
                {
                  label: 'Fact-checker rating',
                  rows: [
                    { label: 'False information', note: '14,812', values: [[0.82, 0.01], [0.75, 0.01], [0.65, 0.01], [0.69, 0.01]] },
                    { label: 'Partly false', note: '4,498', values: [[0.82, 0.01], [0.75, 0.01], [0.63, 0.01], [0.7, 0.01]] },
                    { label: 'Missing context', note: '1,993', values: [[0.77, 0.02], [0.7, 0.02], [0.61, 0.02], [0.63, 0.02]] },
                    { label: 'Altered photo or video', note: '753', values: [[0.73, 0.03], [0.66, 0.03], [0.52, 0.04], [0.64, 0.03]] },
                  ],
                },
                {
                  label: 'Platform',
                  rows: [
                    { label: 'Facebook', note: '24,668', values: [[0.81, 0.0], [0.74, 0.01], [0.64, 0.01], [0.68, 0.01]] },
                    { label: 'Instagram', note: '1,473', values: [[0.78, 0.02], [0.74, 0.02], [0.56, 0.03], [0.75, 0.02]] },
                    { label: 'Twitter', note: '682', values: [[0.84, 0.03], [0.74, 0.03], [0.69, 0.03], [0.7, 0.03]] },
                  ],
                },
                {
                  label: 'All pairs',
                  rows: [{ label: 'Total', note: '26,774', values: [[0.81, 0.0], [0.74, 0.01], [0.64, 0.01], [0.68, 0.01]] }],
                },
              ],
            },
            {
              label: 'Across languages',
              groups: [
                {
                  label: 'Topic',
                  rows: [
                    { label: 'COVID-19', note: '514', values: [[0.4, 0.04], [0.29, 0.04], [0.17, 0.03], [0.06, 0.02]] },
                    { label: 'Other topics', note: '3,698', values: [[0.55, 0.02], [0.39, 0.02], [0.23, 0.01], [0.08, 0.01]] },
                  ],
                },
                {
                  label: 'Fact-checker rating',
                  rows: [
                    { label: 'False information', note: '2,155', values: [[0.52, 0.02], [0.37, 0.02], [0.22, 0.02], [0.09, 0.01]] },
                    { label: 'Partly false', note: '669', values: [[0.53, 0.04], [0.39, 0.04], [0.21, 0.03], [0.08, 0.02]] },
                    { label: 'Missing context', note: '268', values: [[0.53, 0.06], [0.35, 0.06], [0.19, 0.05], [0.05, 0.03]] },
                    { label: 'Altered photo or video', note: '142', values: [[0.47, 0.08], [0.34, 0.08], [0.17, 0.06], [0.12, 0.05]] },
                  ],
                },
                {
                  label: 'Platform',
                  rows: [
                    { label: 'Facebook', note: '3,927', values: [[0.52, 0.02], [0.37, 0.02], [0.22, 0.01], [0.08, 0.01]] },
                    { label: 'Instagram', note: '44', values: [[0.56, 0.14], [0.37, 0.14], [0.19, 0.11], [0.19, 0.11]] },
                    { label: 'Twitter', note: '244', values: [[0.64, 0.06], [0.49, 0.06], [0.38, 0.06], [0.06, 0.03]] },
                  ],
                },
                {
                  label: 'All pairs',
                  rows: [{ label: 'Total', note: '4,212', values: [[0.53, 0.02], [0.38, 0.01], [0.23, 0.01], [0.08, 0.01]] }],
                },
              ],
            },
          ],
          caption:
            'Table 3 of the paper. The number beside each group is its count of pairs. COVID-19 posts are those containing "corona", "covid" or "korona". Unlike the per-language figure, scores here are averaged over pairs, so common languages weigh more.',
        },
      ],
    },
    {
      title: 'Fine-tuning on MultiClaim helps the multilingual model most',
      summary:
        'Trained on our data, MPNet rose from 0.63 to 0.76 S@10 within languages and from 0.23 to 0.42 across languages, overtaking BM25 on translated text. GTR-T5 gained 0.02 and 0.04.',
      body: [
        'We split the posts 80:10:10 into training, development and test sets and fine-tuned both models with contrastive losses. Pairs from the dataset served as positives and random pairs as negatives. MPNet improved in every language.',
        'The random negatives were too easy: both models reached over 99.5% average precision on the training set within a few epochs. Harder negatives would probably teach them more. GTR-T5 had to be trained with a batch size of 2, which likely held it back.',
      ],
      viz: [
        {
          type: 'dots',
          title: 'Test-set S@10 before and after fine-tuning',
          series: [
            { label: 'Off the shelf', tone: 'q5' },
            { label: 'Fine-tuned on MultiClaim', tone: 'q3' },
          ],
          switchLabel: 'Pairs',
          axisLabel: 'S@10',
          views: [
            {
              label: 'Same language',
              groups: [
                {
                  rows: [
                    { label: 'GTR-T5, translated', values: [[0.82, 0.01], [0.84, 0.01]] },
                    { label: 'MPNet, original', values: [[0.63, 0.02], [0.76, 0.02]] },
                  ],
                },
                {
                  label: 'For reference, not trainable',
                  rows: [
                    { label: 'BM25, translated', values: [[0.74, 0.02], null] },
                    { label: 'BM25, original', values: [[0.68, 0.02], null] },
                  ],
                },
              ],
            },
            {
              label: 'Across languages',
              groups: [
                {
                  rows: [
                    { label: 'GTR-T5, translated', values: [[0.55, 0.05], [0.59, 0.05]] },
                    { label: 'MPNet, original', values: [[0.23, 0.04], [0.42, 0.05]] },
                  ],
                },
                {
                  label: 'For reference, not trainable',
                  rows: [
                    { label: 'BM25, translated', values: [[0.4, 0.05], null] },
                    { label: 'BM25, original', values: [[0.09, 0.03], null] },
                  ],
                },
              ],
            },
          ],
          caption: 'Table 4 of the paper, Section 5 columns. Scores are on the held-out test posts, so they differ slightly from the figures above.',
        },
      ],
    },
    {
      title: 'The dataset holds far more valid pairs than we labelled',
      summary:
        'For the 87 posts whose pairs we had verified by hand, we checked the top 10 results of six methods and found 719 correct fact-checks. Our labels had 105, so the dataset probably holds about seven times more valid pairs than we know of.',
      body: [
        'Three authors judged 3,390 retrieved pairs, with agreement between 82.2% and 92.9%, and a pair counted as correct when at least two agreed. Only 96 of the 719 correct pairs were in our labels, and no method found 9 of the 105 labelled ones.',
        'Measured on the hand labels, every method does better than our labels say: GTR-T5 finds a correct fact-check for 93% of posts, not 70%. For recall it is the other way round. Our labels overstate it, possibly through selection bias, and they favour BM25.',
        'Crosslingual pairs with a fact-check in a language other than English made up nearly half of the correct pairs (336 of 719), but they are almost absent from the dataset.',
      ],
      viz: [
        {
          type: 'dots',
          title: 'Scores measured on our labels and on hand annotation',
          series: [
            { label: 'Measured on dataset labels', tone: 'q5' },
            { label: 'Measured on hand annotation', tone: 'q4' },
          ],
          switchLabel: 'Metric',
          axisLabel: 'Score',
          views: [
            {
              label: 'S@10',
              groups: [
                {
                  label: 'Off the shelf',
                  rows: [
                    { label: 'GTR-T5, translated', values: [[0.7, 0.09], [0.93, 0.05]] },
                    { label: 'BM25, translated', values: [[0.67, 0.1], [0.85, 0.07]] },
                    { label: 'MPNet, original', values: [[0.51, 0.1], [0.7, 0.09]] },
                    { label: 'BM25, original', values: [[0.6, 0.1], [0.71, 0.09]] },
                  ],
                },
                {
                  label: 'Fine-tuned',
                  rows: [
                    { label: 'GTR-T5, translated (tuned)', values: [[0.71, 0.09], [0.92, 0.05]] },
                    { label: 'MPNet, original (tuned)', values: [[0.62, 0.1], [0.85, 0.07]] },
                  ],
                },
              ],
            },
            {
              label: 'R@10',
              groups: [
                {
                  label: 'Off the shelf',
                  rows: [
                    { label: 'GTR-T5, translated', values: [[0.69, 0.09], [0.59, 0.04]] },
                    { label: 'BM25, translated', values: [[0.67, 0.09], [0.48, 0.04]] },
                    { label: 'MPNet, original', values: [[0.47, 0.09], [0.32, 0.03]] },
                    { label: 'BM25, original', values: [[0.58, 0.09], [0.26, 0.03]] },
                  ],
                },
                {
                  label: 'Fine-tuned',
                  rows: [
                    { label: 'GTR-T5, translated (tuned)', values: [[0.7, 0.09], [0.65, 0.03]] },
                    { label: 'MPNet, original (tuned)', values: [[0.6, 0.09], [0.45, 0.04]] },
                  ],
                },
              ],
            },
          ],
          caption:
            'Table 4 of the paper, Section 6 columns, for the 87 posts. S@10 here is the share of posts with at least one correct fact-check in the top 10. R@10 is the share of known correct pairs found in the top 10, so both estimates of it miss pairs that nobody found.',
        },
        {
          type: 'bars',
          title: 'The 719 correct pairs found by hand, by language of post and fact-check',
          items: [
            { label: 'Same language', value: 247 },
            { label: 'English fact-check', value: 136 },
            { label: 'Other fact-check language', value: 336, highlight: true },
          ],
          legend: ['Almost missing from the dataset', 'Kinds of pair the dataset covers'],
          max: 360,
          caption: 'Section 6 of the paper. The two lower bars are crosslingual pairs.',
        },
      ],
    },
  ],
  tables: [
    {
      title: 'Datasets for previously fact-checked claim retrieval',
      caption:
        'Table 1 of the paper. Fact-checked claims are the claims that fact-checks address. NA means the number of input claims could not be determined; it is usually close to the number of pairs. MultiClaim has 27 post languages and 39 fact-check languages.',
      columns: ['Dataset', 'Input claims', 'Fact-checked claims', 'Pairs', 'Languages'],
      rows: [
        ['Kazemi et al., 2021', 'NA', '150,000', '258', '5'],
        ['Jiang et al., 2021', 'NA', '90', '1,573', '1'],
        ['Shaar et al., 2020', 'NA', '27,032', '1,768', '1'],
        ['Shaar et al., 2021', '2,259', '44,164', '2,440', '2'],
        ['Hardalov et al., 2022', '316,564', '10,340', '332,660', '1'],
        ['MultiClaim (ours)', '28,092', '205,751', '31,305', '27 / 39'],
      ],
    },
  ],
  bibtex: `@inproceedings{pikuliak-etal-2023-multilingual,
  title = "Multilingual Previously Fact-Checked Claim Retrieval",
  author = "Pikuliak, Mat{\\'u}{\\v{s}} and Srba, Ivan and Moro, Robert and Hromadka, Timo and Smole{\\v{n}}, Timotej and Meli{\\v{s}}ek, Martin and Vykopal, Ivan and Simko, Jakub and Podrou{\\v{z}}ek, Juraj and Bielikova, Maria",
  booktitle = "Proceedings of the 2023 Conference on Empirical Methods in Natural Language Processing",
  year = "2023",
  address = "Singapore",
  publisher = "Association for Computational Linguistics",
  url = "https://aclanthology.org/2023.emnlp-main.1027/",
  doi = "10.18653/v1/2023.emnlp-main.1027",
  pages = "16477--16500",
}`,
};
