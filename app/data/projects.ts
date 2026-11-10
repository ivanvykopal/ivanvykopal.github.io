export type Project = {
  name: string;
  description: string;
  url: string;
  /** Where the link goes, shown as the link label. */
  host: 'GitHub' | 'Website';
};

export type ProjectGroup = {
  title: string;
  intro?: string;
  /** Collapsed by default. */
  collapsed?: boolean;
  projects: Project[];
};

export const projectGroups: ProjectGroup[] = [
  {
    title: 'Code for papers',
    intro: 'Repositories released with our papers.',
    projects: [
      {
        name: 'Web search credibility in chat assistants',
        description:
          'Code for evaluating source credibility and response groundedness of GPT-4o, GPT-5, Perplexity and Qwen Chat. EACL 2026.',
        url: 'https://github.com/kinit-sk/web-search-analysis',
        host: 'GitHub',
      },
      {
        name: 'Language and retrieval bias in claim detection',
        description:
          'Code for the multilingual prompting study of six open LLMs across 20 languages on AMC-16K. EACL 2026.',
        url: 'https://github.com/kinit-sk/llms-biases',
        host: 'GitHub',
      },
      {
        name: 'LLMs for previously fact-checked claim detection',
        description:
          'Code for evaluating seven LLMs on 20 languages in monolingual and cross-lingual settings. EMNLP 2025 Findings.',
        url: 'https://github.com/kinit-sk/llms-claim-matching',
        host: 'GitHub',
      },
      {
        name: 'Soft language prompts',
        description:
          'Code for combining language adapters, task adapters and soft prompts for cross-lingual transfer across 16 languages. NAACL 2025.',
        url: 'https://github.com/kinit-sk/adapter-prompt-evaluation',
        host: 'GitHub',
      },
      {
        name: 'Disinformation capabilities of LLMs',
        description:
          'Code for generating and evaluating disinformation news articles with 10 LLMs and 20 narratives. ACL 2024.',
        url: 'https://github.com/kinit-sk/disinformation-capabilities',
        host: 'GitHub',
      },
    ],
  },
  {
    title: 'Tools and resources',
    projects: [
      {
        name: 'Summer and winter schools in AI and NLP',
        description: 'A maintained list and website of AI and NLP summer and winter schools.',
        url: 'https://github.com/ivanvykopal/winter-summer-schools',
        host: 'GitHub',
      },
      {
        name: 'NLP resources for Slovak and Czech',
        description: 'A curated list of datasets and models for Slovak and Czech NLP.',
        url: 'https://github.com/ivanvykopal/nlp-resources',
        host: 'GitHub',
      },
      {
        name: 'XTranslator',
        description:
          'Python package on PyPI that translates text through several translation services, with built-in language detection.',
        url: 'https://github.com/ivanvykopal/xtranslator',
        host: 'GitHub',
      },
      {
        name: 'AISuite with vLLM',
        description:
          'A fork of AISuite with vLLM integration for faster local inference, including quantization and batch inference.',
        url: 'https://github.com/ivanvykopal/aisuite',
        host: 'GitHub',
      },
      {
        name: 'PEFT tutorial, NLP Summer School 2025',
        description:
          'Tutorial code covering the basics of parameter-efficient fine-tuning and how to use it in practice.',
        url: 'https://github.com/ivanvykopal/peft-kinit-2025',
        host: 'GitHub',
      },
      {
        name: 'NLP lecture project, FIT BUT',
        description: 'Project assignment for the NLP course at the Faculty of Information Technology, Brno University of Technology.',
        url: 'https://github.com/ivanvykopal/NLP-Project',
        host: 'GitHub',
      },
      {
        name: 'Task templates',
        description: 'Templates for NLP tasks.',
        url: 'https://github.com/ivanvykopal/tasktemplates',
        host: 'GitHub',
      },
      {
        name: 'arXiv Viewer',
        description:
          'Browse arXiv papers from the last day or week by category, tag and save papers for later, and see upcoming calls for papers from WikiCFP.',
        url: 'https://arxiv-viewer.vercel.app',
        host: 'Website',
      },
    ],
  },
  {
    title: 'Medical imaging',
    intro: 'From my Master’s thesis on segmenting histological images after cardiac biopsy.',
    projects: [
      {
        name: 'MONAILabel extension',
        description:
          'Adds GPU-enabled TensorFlow and three custom models for segmenting higher-level morphological structures. Now part of the QuPath tool, used by doctors and pathologists for histological image analysis.',
        url: 'https://github.com/ivanvykopal/MONAILabel/tree/development',
        host: 'GitHub',
      },
      {
        name: 'MONAILabel extension documentation',
        description: 'Documentation for the extension and its three segmentation models.',
        url: 'https://github.com/ivanvykopal/MONAILabel-docs',
        host: 'GitHub',
      },
      {
        name: 'Cardiac transplant rejection diagnosis',
        description:
          'Thesis code: quantitative analysis with neural networks to support the diagnosis of cardiac transplant rejection.',
        url: 'https://github.com/ivanvykopal/Cardiac-transplant-rejection-diagnosis',
        host: 'GitHub',
      },
    ],
  },
  {
    title: 'Earlier work',
    intro: 'Bachelor’s thesis and university projects.',
    collapsed: true,
    projects: [
      {
        name: 'Error detection system',
        description:
          'Finds weaknesses in variable optimization in C source files. Part of my Bachelor’s thesis, Graph coloring in program analysis.',
        url: 'https://github.com/ivanvykopal/Error-detection-system',
        host: 'GitHub',
      },
      {
        name: 'Information retrieval from Freebase',
        description: 'University project using PyLucene and Spark.',
        url: 'https://github.com/ivanvykopal/VINF',
        host: 'GitHub',
      },
      {
        name: 'Warehouse system',
        description: 'University project in Java on multi-layer application architecture.',
        url: 'https://github.com/ivanvykopal/VAVA-Project',
        host: 'GitHub',
      },
      {
        name: 'Customers and orders app',
        description: 'A React, GraphQL and Grommet app listing customers and their orders.',
        url: 'https://github.com/ivanvykopal/React-App',
        host: 'GitHub',
      },
    ],
  },
];
