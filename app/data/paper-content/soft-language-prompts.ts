import type { PaperPage } from 'app/data/papers';
import type { BarItem, DotRow, DotSeries, HeatCell, HeatView } from 'app/components/paper/viz';
import { AVERAGE, CONFIGS, CWCD, NER, NLI, QA, SEEDS, SOURCES, TARGETS, type ResultTable } from './soft-language-prompts-data';

// Source: Vykopal, Ostermann and Šimko, NAACL 2025 (aclanthology.org/2025.naacl-long.517). Charts read the
// appendix tables in soft-language-prompts-data.ts; counts of wins and the per-target shares are computed here
// from those tables. Running-text numbers come from Sections 3 to 6 and Appendices A, C, D and F.

/** Column index of the average over target languages in every table row. */
const AVG = TARGETS.length;
/** Indices into CONFIGS. */
const TASK_ADAPTER = 0;
const MADX = 2;
const LANG_ADAPTER_TASK_PROMPT = 3;
const LANG_PROMPT_TASK_ADAPTER = 4;

const TASKS: { label: string; table: ResultTable; metric: string }[] = [
  { label: 'All tasks', table: AVERAGE, metric: 'mean of the four task scores' },
  { label: 'QA', table: QA, metric: 'F1' },
  { label: 'NER', table: NER, metric: 'F1' },
  { label: 'NLI', table: NLI, metric: 'accuracy' },
  { label: 'Claims', table: CWCD, metric: 'F1' },
];

const fmt = (v: number) => v.toFixed(2);

/** Index of the configuration with the highest score at one target, or null where the task has no data. */
function winner(table: ResultTable, source: (typeof SOURCES)[number]['code'], c: number) {
  const scores = table.rows[source].map((row) => row[c]);
  if (scores.some((v) => v === null)) return null;
  return (scores as number[]).reduce((best, v, k, all) => (v > all[best] ? k : best), 0);
}

/** One view of the winner grid: the best configuration for every source and target pair of one table. */
function winnerView({ label, table, metric }: (typeof TASKS)[number]): HeatView {
  return {
    label,
    cells: SOURCES.map(({ code }) =>
      TARGETS.map((_, c): HeatCell => {
        const best = winner(table, code, c);
        if (best === null) return { value: null };
        const scores = table.rows[code].map((row, k) => ({ k, v: row[c] as number })).sort((a, b) => b.v - a.v);
        const base = table.baseline?.[c];
        return {
          value: scores[0].v,
          cls: best,
          detail: [
            ...scores.map(({ k, v }) => ({ label: CONFIGS[k].label, value: fmt(v), tone: CONFIGS[k].tone, strong: k === best })),
            ...(base === undefined || base === null ? [] : [{ label: 'mT0-BASE alone', value: fmt(base), muted: true }]),
            { label: `Score: ${metric}`, value: '', muted: true },
          ],
        };
      })
    ),
  };
}

/** Rows of a per-target dot plot for one source language and a few configurations, with an optional baseline. */
function targetRows(table: ResultTable, source: (typeof SOURCES)[number]['code'], configs: number[], baseline = false): DotRow[] {
  return TARGETS.map((t, c) => ({
    label: t.label,
    values: [
      ...(baseline ? [table.baseline?.[c] ?? null] : []),
      ...configs.map((k) => table.rows[source][k][c]),
    ].map((v) => (v === null ? null : ([v, 0] as [number, number]))),
  }));
}

const series = (configs: number[]): DotSeries[] => configs.map((k) => ({ label: CONFIGS[k].label, tone: CONFIGS[k].tone }));

/** Per target: how often, over the four tasks and six sources, the best configuration had no language representation. */
const LANGUAGE_FREE: BarItem[] = TARGETS.map((t, c) => {
  let wins = 0;
  let pairs = 0;
  for (const { table } of TASKS.slice(1)) {
    for (const { code } of SOURCES) {
      const best = winner(table, code, c);
      if (best === null) continue;
      pairs += 1;
      if (CONFIGS[best].language === null) wins += 1;
    }
  }
  return { label: `${t.label} (${wins} of ${pairs})`, value: Math.round((wins / pairs) * 100), highlight: wins * 2 >= pairs };
}).sort((a, b) => b.value - a.value);

/** Order of the source languages in Figure 3 of the paper. */
const FIGURE_3_ORDER = ['en', 'de', 'es', 'ar', 'ru', 'zh'] as const;

export const softLanguagePrompts: PaperPage = {
  slug: 'soft-language-prompts',
  publicationTitle: 'Soft Language Prompts for Language Transfer',
  affiliations: [
    'Faculty of Information Technology, Brno University of Technology',
    'Kempelen Institute of Intelligent Technologies, Bratislava',
    'German Research Center for Artificial Intelligence (DFKI), Saarbrücken',
    'Centre for European Research in Trusted AI (CERTAIN), Saarbrücken',
  ],
  authorAffiliations: {
    'Ivan Vykopal': [1, 2],
    'Simon Ostermann': [3, 4],
    'Marián Šimko': [2],
  },
  tagline:
    'We trained soft prompts that carry a language rather than a task, and compared them with language adapters for transfer from six high-resource languages to ten mid- and low-resource ones, on four tasks.',
  tldr:
    'A soft language prompt combined with a task adapter gave the best average for four of the six source languages, and it beat the usual pairing of a language adapter with a task adapter (MAD-X) in 47 of 60 language pairs. No configuration wins everywhere, though: the best choice depends on the task and the target language, and Swahili, Telugu and Urdu often did as well without any language representation.',
  stats: [
    { value: '6', label: 'high-resource source languages' },
    { value: '10', label: 'mid- and low-resource target languages' },
    { value: '4', label: 'tasks: QA, NER, NLI and check-worthy claims' },
    { value: '6', label: 'combinations of adapters and soft prompts' },
  ],
  lead: {
    type: 'grouped',
    title: 'Average score of each configuration by source language',
    categories: FIGURE_3_ORDER.map((code) => SOURCES.find((s) => s.code === code)!.label),
    series: CONFIGS.map((config, k) => ({
      label: config.label,
      tone: config.tone,
      soft: k !== LANG_PROMPT_TASK_ADAPTER,
      values: FIGURE_3_ORDER.map((code) => [AVERAGE.rows[code][k][AVG] as number, 0]),
    })),
    scale: {
      min: 40,
      max: 65,
      ticks: [40, 45, 50, 55, 60, 65].map((v) => ({ value: v, label: `${v}` })),
      decimals: 0,
      labelWidth: 44,
    },
    caption:
      'Figure 3 of the paper, with the exact values of Table 3 on hover. Each bar is the mean over the four tasks and the ten target languages for task representations trained in that source language. The axis starts at 40, as in the paper.',
  },
  overview: [
    'Multilingual language models know much less about low-resource languages than about English or Spanish, and labelled data in those languages is scarce. A common workaround is cross-lingual transfer: train a model on a task in a high-resource language and use it in another language. One popular way to help the transfer is MAD-X, which trains a small language adapter on unlabelled text in each language, stacks a task adapter on top of it and swaps the language adapter at test time. Earlier work reported this pairing as the one to use.',
    'We tested whether a soft prompt can do the language adapter\'s job. A soft prompt is a short sequence of trained vectors put in front of the input. Prompt tuning had been used for tasks, but not, to our knowledge, for languages. We call these soft language prompts. We trained language adapters and soft language prompts for 16 languages on Wikipedia, trained task adapters and soft task prompts in six high-resource languages, and evaluated all six combinations on ten mid- and low-resource languages. The base model, mT0-BASE, stayed frozen throughout.',
    'mT0 is mT5 after instruction tuning. We started with mT5-BASE itself, but prompt tuning alone could not get it to produce meaningful outputs, while the instruction-tuned mT0 worked even on tasks it had not been tuned on, such as NER and check-worthy claim detection.',
  ],
  approach: [
    {
      type: 'pipeline',
      title: 'How the study was run',
      steps: [
        {
          title: 'Languages',
          metric: { value: '16', label: 'languages with a trained language adapter and prompt' },
          detail:
            'For each language we trained a language adapter and a soft language prompt of 50 vectors on Wikipedia (November 2023 dump), with span corruption: 15% of the tokens are masked and the model learns to restore them. The prompt starts from the embedded instruction "Generate the output in {Language}:", repeated to fill 50 vectors.',
          chips: ['Wikipedia', 'Span corruption', '100,000 steps', '50-vector prompts'],
        },
        {
          title: 'Tasks',
          metric: { value: '4', label: 'tasks in 6 high-resource languages' },
          detail:
            'On top of the frozen language representation of the training language, we trained a task adapter or a soft task prompt in Arabic, German, English, Spanish, Russian and Chinese. Only the task part is updated. When both are prompts, the language and task prompts are concatenated.',
          chips: ['Question answering', 'Named entities', 'Natural language inference', 'Check-worthy claims'],
        },
        {
          title: 'Combine',
          metric: { value: '6', label: 'configurations compared' },
          detail:
            'A task adapter or a task prompt can be used alone, or on top of a language adapter or a soft language prompt. A language adapter with a task adapter is MAD-X. The three baselines are task adapters, task prompts and MAD-X.',
          chips: CONFIGS.map((c) => c.label),
        },
        {
          title: 'Transfer',
          metric: { value: '10', label: 'mid- and low-resource target languages' },
          detail:
            'At test time the language representation of the training language is replaced with the one of the target language. Czech, Greek, Romanian and Slovenian count as mid-resource; Bulgarian, Malayalam, Slovak, Swahili, Telugu and Urdu as low-resource. Where no dataset existed we machine-translated one: Slovak NLI from Czech, and the check-worthy claims from English. Bulgarian has no QA dataset.',
          chips: TARGETS.map((t) => t.label),
        },
      ],
    },
    {
      type: 'architecture',
      title: 'Where each representation sits in the model',
      configs: CONFIGS.map(({ label, short, language, task, tone }, k) => {
        const wins = SOURCES.flatMap(({ code }) => TARGETS.map((_, c) => winner(AVERAGE, code, c))).filter((w) => w === k).length;
        const mean = SOURCES.reduce((sum, { code }) => sum + (AVERAGE.rows[code][k][AVG] as number), 0) / SOURCES.length;
        return {
          label,
          short,
          language,
          task,
          tone,
          facts: [
            { value: `${wins} of 60`, label: 'language pairs where it scores best over all tasks' },
            { value: mean.toFixed(2), label: 'mean score over all pairs and tasks' },
          ],
        };
      }),
      languageTone: 'q4',
      taskTone: 'q1',
      example: { source: 'Spanish', target: 'Bulgarian' },
      caption:
        'After Figure 2 of the paper, with its colours: red for the language representation, green for the task. Pick a configuration in the grid; dashed slots are parts it does not use. Adapters are bottlenecks added to every transformer layer; soft prompts are 50 trained vectors put in front of the embedded input. The two results are computed from Table 3 of the paper and use the colour of the configuration in the result charts.',
    },
  ],
  findings: [
    {
      title: 'A soft language prompt with a task adapter wins most often',
      summary:
        'Averaged over the four tasks, the soft language prompt with a task adapter scored best in 22 of the 60 source and target pairs, ahead of the task adapter alone (12) and MAD-X (9). It also gave the best average for Arabic, German, Spanish and Russian as source languages.',
      body: [
        'The highest average of all, 60.96, came from task representations trained in Spanish with this configuration. English did best with a task adapter alone (55.31), and Chinese with two soft prompts (52.17). Chinese gave the lowest average for five of the six configurations.',
        'On NER the soft language prompt with a task adapter won 20 of 60 pairs. On NLI the task adapter alone won 33 of 60, and it also won most often on QA and check-worthy claims.',
      ],
      viz: [
        {
          type: 'heatmap',
          title: 'Best configuration for each source and target language',
          rows: SOURCES.map((s) => ({ label: s.label })),
          columns: TARGETS.map((t) => ({ label: t.label, short: t.code })),
          rowAxis: 'Source',
          columnAxis: 'target',
          classes: CONFIGS.map((c) => ({ label: c.label, tone: c.tone })),
          views: TASKS.map(winnerView),
          switchLabel: 'Task',
          caption:
            'Computed from Tables 3 to 7 of the paper. Each cell is coloured by the configuration with the highest score for that pair and shows that score; the numbers beside the legend count the pairs each configuration wins. Hover a cell for all six scores, or a legend entry to keep only its cells. Bulgarian has no QA dataset.',
        },
      ],
    },
    {
      title: 'A soft language prompt beats MAD-X in 47 of 60 pairs',
      summary:
        'Swapping MAD-X\'s language adapter for a soft language prompt raised the four-task average in 47 of 60 language pairs, and in every one of the six source languages on average.',
      body: [
        'Task by task, the soft language prompt with a task adapter beat MAD-X in 36 of 54 QA pairs, 46 of 60 NER pairs, 41 of 60 NLI pairs and 36 of 60 check-worthy claim pairs. On check-worthy claims MAD-X still had the higher average when the source language was English, Russian or Chinese.',
        'Both configurations train the same task adapter. They differ only in how the language is represented.',
      ],
      viz: [
        {
          type: 'dumbbell',
          title: 'MAD-X against a soft language prompt with a task adapter',
          rows: SOURCES.map((s) => s.label),
          series: [CONFIGS[MADX].label, CONFIGS[LANG_PROMPT_TASK_ADAPTER].label],
          tones: [CONFIGS[MADX].tone, CONFIGS[LANG_PROMPT_TASK_ADAPTER].tone],
          switchLabel: 'Task',
          metrics: [
            { label: 'All tasks', hint: 'mean score, higher is better', min: 40, max: 65 },
            { label: 'QA', hint: 'F1, higher is better', min: 15, max: 35 },
            { label: 'NER', hint: 'F1, higher is better', min: 20, max: 65 },
            { label: 'NLI', hint: 'accuracy, higher is better', min: 45, max: 65 },
            { label: 'Claims', hint: 'F1, higher is better', min: 65, max: 95 },
          ].map((m, i) => ({
            ...m,
            a: SOURCES.map(({ code }) => TASKS[i].table.rows[code][MADX][AVG] as number),
            b: SOURCES.map(({ code }) => TASKS[i].table.rows[code][LANG_PROMPT_TASK_ADAPTER][AVG] as number),
          })),
          caption:
            'Average columns of Tables 3 to 7 of the paper: each dot is the mean over the target languages for task representations trained in that source language. The axis range changes with the task.',
        },
      ],
    },
    {
      title: 'QA transfer helps from English, German and Spanish and hurts from the other sources',
      summary:
        'Compared with mT0-BASE used as it is, the soft language prompt with a task adapter raised QA F1 in all nine targets when trained on English, but lowered it in every target when trained on Arabic, Russian or Chinese.',
      body: [
        'German (seven of nine targets) and Spanish (five of nine) also mostly helped. The gains were largest for targets written in Latin script, with English to Slovenian the largest at +5.78, and the losses were largest for Russian and Chinese to Czech, at −9.28 and −9.13. We think the script of the source language plays a part.',
        'QA scores are low overall. mT0-BASE alone reaches 57.00 F1 in Greek and Romanian but under 4 in Malayalam and Swahili. For Telugu and Urdu, the task adapter alone was the best configuration for three and four of the six source languages.',
      ],
      viz: [
        {
          type: 'heatmap',
          title: 'Change in QA F1 over mT0-BASE alone',
          rows: SOURCES.map((s) => ({ label: s.label })),
          columns: TARGETS.filter((t) => t.code !== 'bg').map((t) => ({ label: t.label, short: t.code })),
          rowAxis: 'Source',
          columnAxis: 'target',
          scale: { max: 10, tones: ['q3', 'q4'] },
          signed: true,
          views: [
            {
              label: 'Lang. prompt + task adapter',
              cells: SOURCES.map(({ code }) =>
                TARGETS.flatMap((t, c): HeatCell[] => {
                  if (t.code === 'bg') return [];
                  const score = QA.rows[code][LANG_PROMPT_TASK_ADAPTER][c] as number;
                  const base = QA.baseline![c] as number;
                  const diff = Math.round((score - base) * 100) / 100;
                  return [
                    {
                      value: diff,
                      detail: [
                        { label: CONFIGS[LANG_PROMPT_TASK_ADAPTER].label, value: fmt(score), tone: CONFIGS[LANG_PROMPT_TASK_ADAPTER].tone },
                        { label: 'mT0-BASE alone', value: fmt(base), muted: true },
                        { label: 'Change', value: `${diff > 0 ? '+' : ''}${fmt(diff)}`.replace('-', '\u2212'), strong: true },
                      ],
                    },
                  ];
                })
              ),
            },
          ],
          caption:
            'Figure 4 of the paper, from the F1 scores in Table 4. Red cells gained over mT0-BASE without any trained language or task representation, blue cells lost. Hover a cell for both scores.',
        },
      ],
    },
    {
      title: 'Soft language prompts help NER the most',
      summary:
        'The largest gap on NER was Russian to Telugu: the soft language prompt with a task adapter reached 55.41 F1, against 18.41 for MAD-X.',
      body: [
        'MAD-X stayed between 5.56 and 24.52 F1 on Telugu NER, whatever the source language, while the soft language prompt with a task adapter reached between 28.76 and 55.41. The best NER average in the study, 60.25, also came from this configuration, trained on Spanish; the next best was 56.57.',
        'mT0-BASE was never trained on NER and scores 0 without a task representation, so the chart leaves it out.',
      ],
      viz: [
        {
          type: 'dots',
          title: 'NER F1 per target language',
          series: series([TASK_ADAPTER, MADX, LANG_PROMPT_TASK_ADAPTER]),
          switchLabel: 'Source',
          axisLabel: 'F1',
          domain: [0, 100],
          ticks: [0, 25, 50, 75, 100],
          views: SOURCES.map(({ code, label }) => ({
            label,
            groups: [{ rows: targetRows(NER, code, [TASK_ADAPTER, MADX, LANG_PROMPT_TASK_ADAPTER]) }],
          })),
          caption: 'Table 5 of the paper, three of the six configurations. Pick the language the task representation was trained in; hover a row for the scores.',
        },
      ],
    },
    {
      title: 'A task adapter alone wins most NLI pairs',
      summary:
        'For NLI, a task adapter alone scored best in 33 of 60 language pairs. MAD-X broke down on Slovenian, where it scored between 0.20 and 16.13 against 68.74 for mT0-BASE alone, 63 points lower on average.',
      body: [
        'Only one of the 36 trained configurations beat mT0-BASE alone on Slovenian: a language adapter with a task prompt trained on Chinese, at 98.20. Czech and Slovak, where the data is adversarial NLI, stayed between 33.33 and 38.75 for every configuration, close to chance for three classes.',
        'Romanian rose from 4.98 to as much as 90.09. We put this down to Romanian being in the pre-training data of mT5 but not in the instruction tuning of mT0.',
      ],
      viz: [
        {
          type: 'dots',
          title: 'NLI accuracy per target language',
          series: [{ label: 'mT0-BASE alone', tone: 'idle-ink' }, ...series([TASK_ADAPTER, MADX, LANG_ADAPTER_TASK_PROMPT])],
          switchLabel: 'Source',
          axisLabel: 'Accuracy',
          domain: [0, 100],
          ticks: [0, 25, 50, 75, 100],
          views: SOURCES.map(({ code, label }) => ({
            label,
            groups: [{ rows: targetRows(NLI, code, [TASK_ADAPTER, MADX, LANG_ADAPTER_TASK_PROMPT], true) }],
          })),
          caption:
            'Table 6 of the paper, the untrained baseline and three of the six configurations. Pick the language the task representation was trained in; hover a row for the scores.',
        },
      ],
    },
    {
      title: 'Swahili, Telugu and Urdu often do best without a language representation',
      summary:
        'For Swahili, Telugu and Urdu, the best configuration had no language representation in more than half of the task and source combinations. For Slovak, Slovenian and Bulgarian it had one in more than three quarters of them.',
      body: [
        'We think the language representations had too little text to learn from: Wikipedia has few articles in the smallest languages.',
      ],
      viz: [
        {
          type: 'bars',
          title: 'Share of wins by configurations without a language representation',
          items: LANGUAGE_FREE,
          max: 100,
          unit: '%',
          legend: ['Half of the combinations or more', 'Fewer than half'],
          caption:
            'Computed from Tables 4 to 7 of the paper. For each target language, the share of the task and source language combinations (24, or 18 for Bulgarian without QA) in which a task adapter or a task prompt alone scored highest.',
        },
      ],
    },
    {
      title: 'Three seeds pick the same winner as one seed for 8 of 10 targets',
      summary:
        'We trained one seed for the main results. With three seeds on German NER, MAD-X was best for five targets and the soft language prompt with a task adapter for the other five.',
      body: [
        'Some configurations vary a lot between seeds: the language adapter with a task prompt has a standard deviation of 14.17 points on Czech, and MAD-X of 11.17 on Urdu. The full study took about 3,200 GPU hours on NVIDIA A10 and A40 cards, which is why the main results use a single seed.',
      ],
      viz: [
        {
          type: 'dots',
          title: 'German NER over three seeds',
          series: series(CONFIGS.map((_, k) => k)),
          axisLabel: 'F1',
          domain: [0, 100],
          ticks: [0, 25, 50, 75, 100],
          views: [
            {
              label: 'German',
              groups: [{ rows: TARGETS.map((t, c) => ({ label: t.label, values: SEEDS.map((row) => row[c]) })) }],
            },
          ],
          caption:
            'Table 8 of the paper. Dots are the mean of three runs and the lines through them span one standard deviation on each side. Hover a row for the values, or a legend entry to isolate one configuration.',
        },
      ],
    },
  ],
  tables: [
    {
      title: 'Datasets',
      caption:
        'Table 1 of the paper. Languages marked with * were machine-translated with Google Translate, from Czech (CS ANLI) or from English (MultiClaim). Bulgarian has no QA dataset.',
      columns: ['Dataset', 'Task', 'Languages', 'Source'],
      rows: [
        ['SQuAD', 'QA', 'en', 'Rajpurkar et al., 2016'],
        ['MLQA', 'QA', 'ar, de, hi, zh, es, vi', 'Lewis et al., 2019'],
        ['XQuAD', 'QA', 'el, ro', 'Artetxe et al., 2020'],
        ['SK-QuAD', 'QA', 'sk', 'Hládek et al., 2023'],
        ['Czech SQuAD', 'QA', 'cs', 'Macková and Straka, 2020'],
        ['TeQuAD', 'QA', 'te', 'Vemula et al., 2022'],
        ['KenSwQuAD', 'QA', 'sw', 'Wanjawa et al., 2023'],
        ['UQA', 'QA', 'ur', 'Arif et al., 2024'],
        ['Slovene SQuAD', 'QA', 'sl', 'Borovič et al., 2022'],
        ['IndicQA', 'QA', 'ml', 'Doddapaneni et al., 2023'],
        ['WikiANN', 'NER', 'ar, bg, cs, de, el, en, es, ml, ro, ru, sl, sk, sw, te, ur, zh', 'Rahimi et al., 2019'],
        ['XNLI', 'NLI', 'ar, bg, de, el, en, es, ru, sw, ur, zh', 'Conneau et al., 2018'],
        ['IndicXNLI', 'NLI', 'ml, te', 'Aggarwal et al., 2022'],
        ['CS ANLI', 'NLI', 'cs, sk*', 'CS-ANLI (Hugging Face)'],
        ['RoNLI', 'NLI', 'ro', 'Poesina et al., 2024'],
        ['Sl-NLI', 'NLI', 'sl', 'Klemen et al., 2024'],
        ['MultiClaim', 'Check-worthy claims', 'ar, bg, cs, de*, el*, en, es, ml*, ro*, ru*, sl*, sk, sw*, te*, ur*, zh*', 'Pikuliak et al., 2023; Hyben et al., 2023'],
      ],
    },
    {
      title: 'Training settings',
      caption: 'Table 2 of the paper. Language representations are trained on Wikipedia and task representations on the task data.',
      columns: ['Setting', 'Language adapter', 'Soft language prompt', 'Task adapter', 'Soft task prompt'],
      rows: [
        ['Learning rate', '5e-5', '5e-1', '5e-5', '5e-1'],
        ['Weight decay', '0', '1e-5', '0', '1e-5'],
        ['Batch size', '32', '32', '32', '32'],
        ['Training steps', '100,000', '100,000', '50,000', '50,000'],
        ['Optimizer', 'AdamW', 'Adafactor', 'AdamW', 'Adafactor'],
        ['Evaluation every', '500 steps', '500 steps', '1,000 steps', '1,000 steps'],
        ['Max input length', '256', '256', '256', '256'],
        ['Prompt length', '–', '50 vectors', '–', '50 vectors'],
      ],
    },
  ],
  bibtex: `@inproceedings{vykopal-etal-2025-soft,
  title = "Soft Language Prompts for Language Transfer",
  author = "Vykopal, Ivan and Ostermann, Simon and Simko, Marian",
  booktitle = "Proceedings of the 2025 Conference of the Nations of the {A}mericas Chapter of the {A}ssociation for {C}omputational {L}inguistics: Human Language Technologies (Volume 1: Long Papers)",
  month = apr,
  year = "2025",
  address = "Albuquerque, New Mexico",
  publisher = "Association for Computational Linguistics",
  url = "https://aclanthology.org/2025.naacl-long.517/",
  doi = "10.18653/v1/2025.naacl-long.517",
  pages = "10294--10313",
}`,
};
