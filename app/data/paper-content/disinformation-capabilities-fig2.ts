import type { LineDataset } from 'app/components/paper/viz';

// Mean score (1 = does not apply, 5 = completely applies) per model and question, with 95% confidence
// half-width, computed from data/data.csv of github.com/kinit-sk/disinformation-capabilities: human = mean
// of the two annotators; GPT-4 = Qi_gpt4 columns. Values are [mean, ci]; null = not rated.

export const FIG2_MODELS = ["ChatGPT", "Davinci", "Curie", "Babbage", "Falcon", "OPT-IML-Max", "Vicuna", "GPT-4", "Llama-2", "Mistral"];

export const FIG2_DATASETS: LineDataset[] = [
  {
    label: 'Human annotators',
    note: 'GPT-4, Llama-2 and Mistral were not rated by humans.',
    series: [
      { id: 'Q1', label: 'Q1 Well-formed', color: '#16a34a', dash: '8 4 2 4', values: [[4.75, 0.07], [4.78, 0.08], [4.55, 0.11], [3.97, 0.17], [4.45, 0.1], [3.54, 0.19], [4.82, 0.08], null, null, null] },
      { id: 'Q2', label: 'Q2 Article', color: '#84cc16', dash: '8 4 2 4', values: [[4.14, 0.16], [4.34, 0.11], [3.18, 0.21], [2.9, 0.2], [2.54, 0.24], [1.76, 0.19], [4.58, 0.11], null, null, null] },
      { id: 'Q3', label: 'Q3 Agree', color: '#2563eb', values: [[3.17, 0.26], [4.21, 0.2], [4.15, 0.22], [3.8, 0.25], [1.75, 0.23], [2.13, 0.24], [4.47, 0.14], null, null, null] },
      { id: 'Q4', label: 'Q4 Disagree', color: '#ef4444', dash: '2 4', values: [[2.5, 0.27], [1.38, 0.14], [1.2, 0.1], [1.3, 0.16], [3.35, 0.28], [1.35, 0.15], [1.24, 0.08], null, null, null] },
      { id: 'Q5', label: 'Q5 Args in favor', color: '#38bdf8', values: [[2.77, 0.23], [3.33, 0.22], [2.25, 0.23], [2.15, 0.19], [1.47, 0.17], [1.7, 0.18], [3.74, 0.17], null, null, null] },
      { id: 'Q6', label: 'Q6 Args against', color: '#f59e0b', dash: '2 4', values: [[2.35, 0.26], [1.3, 0.13], [1.15, 0.08], [1.2, 0.12], [3.03, 0.27], [1.21, 0.1], [1.19, 0.07], null, null, null] },
    ],
  },
  {
    label: 'GPT-4 annotator',
    series: [
      { id: 'Q1', label: 'Q1 Well-formed', color: '#16a34a', dash: '8 4 2 4', values: [[5.0, 0.0], [4.97, 0.04], [5.0, 0.0], [4.53, 0.19], [5.0, 0.0], [4.78, 0.1], [4.97, 0.07], [4.6, 0.27], [5.0, 0.0], [5.0, 0.0]] },
      { id: 'Q2', label: 'Q2 Article', color: '#84cc16', dash: '8 4 2 4', values: [[4.92, 0.08], [3.93, 0.23], [2.88, 0.25], [2.17, 0.22], [3.97, 0.17], [2.59, 0.24], [4.58, 0.18], [4.4, 0.28], [4.37, 0.15], [4.05, 0.25]] },
      { id: 'Q3', label: 'Q3 Agree', color: '#2563eb', values: [[3.52, 0.3], [4.66, 0.16], [4.57, 0.18], [4.0, 0.28], [2.03, 0.28], [2.69, 0.32], [4.61, 0.16], [3.85, 0.26], [2.72, 0.34], [4.0, 0.25]] },
      { id: 'Q4', label: 'Q4 Disagree', color: '#ef4444', dash: '2 4', values: [[2.51, 0.31], [1.6, 0.23], [1.43, 0.19], [1.79, 0.27], [3.83, 0.29], [2.02, 0.27], [1.43, 0.18], [2.29, 0.29], [3.52, 0.33], [2.16, 0.27]] },
      { id: 'Q5', label: 'Q5 Args in favor', color: '#38bdf8', values: [[3.42, 0.26], [3.84, 0.18], [3.08, 0.26], [2.6, 0.26], [2.25, 0.28], [2.45, 0.26], [3.97, 0.16], [3.68, 0.21], [2.56, 0.29], [3.66, 0.21]] },
      { id: 'Q6', label: 'Q6 Args against', color: '#f59e0b', dash: '2 4', values: [[3.64, 0.24], [2.73, 0.3], [2.02, 0.26], [1.93, 0.24], [3.79, 0.27], [2.18, 0.25], [2.61, 0.27], [3.69, 0.21], [4.11, 0.24], [3.22, 0.27]] },
    ],
  },
];
