import Image from 'next/image';
import kinit from 'public/images/kinit.png';
import ivanvykopal from 'public/images/ivanvykopal.jpeg';
import { ArrowIcon } from './ArrowIcon';
import { Badge } from './Badge';


export default async function Page() {

  return (
    <section>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">
        Hey, I'm Ivan Vykopal 👋
      </h1>
      <div className="rounded-lg flex justify-between items-center">
        <div className="flex-1 text-white pr-9">
          <p className="prose prose-neutral dark:prose-invert">
            {`I'm a Junior Researcher and PhD student at `}
            <span className="not-prose">
              <Badge href="https://kinit.sk/">
                <Image
                  alt="KInIT logo"
                  src={kinit}
                  // priority
                  width={12}
                  height={12}
                  className="rounded object-cover image-icon"
                />
                <span className='ml-1'>Kempelen Institute of Intelligent Technologies</span>
              </Badge>
            </span>
            {`, where I am a third-year PhD student in the NLP team. I build and evaluate `}
            <strong>multilingual fact-checking</strong>
            {` systems with large language models, with a focus on low-resource languages. My work has appeared at ACL, NAACL, EMNLP and EACL, and our team won CLEF 2025 CheckThat! Task 2 (claim normalization).`}
          </p>
        </div>
        <div className="flex-shrink">
          <Image
            alt="Ivan Vykopal"
            src={ivanvykopal}
            priority
            width={150}
            className="rounded object-cover rounded-lg"
          />
        </div>
      </div>
      <div className="prose prose-neutral dark:prose-invert flex justify-between">
        <p>
          Before NLP, I earned my Master's degree in Computer Science at the Faculty of Informatics and Information Technologies, Slovak University
          of Technology, focusing on AI and deep learning. My thesis used deep neural networks for medical image segmentation, identifying
          higher-level morphological structures to detect possible cardiac transplant rejection.
        </p>
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <h3 className="dark:prose-invert dark:text-white">
          PhD Topic: Multilingual Natural Language Processing for Supporting Fact-Checking
        </h3>
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          My PhD asks how to build, transfer, and evaluate multilingual fact-checking systems in the era of large language models.
          Fact-checking resources are overwhelmingly English, yet misinformation spreads in every language, so fact-checkers working in smaller
          languages get the weakest tools. I study how generative LLMs can support them in monolingual and multilingual settings, across{' '}
          <strong>claim detection</strong>, <strong>previously fact-checked claim retrieval</strong> and <strong>claim normalization</strong>,
          and how to close the gap for <strong>low-resource languages</strong> through cross-lingual transfer and parameter-efficient fine-tuning.
        </p>
        <p>
          I also look at the other side: how well LLMs can generate disinformation, and how credible the sources and how grounded the answers
          of web-search-enabled chat assistants are.
        </p>
        <h3 className="dark:prose-invert dark:text-white">Highlights</h3>
        <ul>
          <li>
            <strong>Publications:</strong> ACL'24, NAACL'25, EMNLP'25 Findings, EACL'26 (two papers) and ACL'25 SRW, plus EMNLP'23 and
            IJCNLP-AACL'25 Findings and EMNLP'26 as co-author.
          </li>
          <li>
            <strong>Shared task:</strong> part of the winning team at CLEF 2025 CheckThat! Task 2 (claim normalization), placing 1st in 13 of 20
            languages and 2nd or 3rd in the rest.
          </li>
          <li>
            <strong>Research visit and press:</strong> four weeks at DFKI, Saarbrücken (June 2024); interviewed by MIT Technology Review Germany
            on AI-driven disinformation in elections.
          </li>
          <li>
            <strong>Service:</strong> reviewer for ACL Rolling Review and LowResNLP; volunteer at EACL'26; participant at the Eastern European
            Machine Learning Summer School 2025.
          </li>
        </ul>
      </div>
      <ul className="flex flex-col md:flex-row mt-8 space-x-0 md:space-x-4 space-y-2 md:space-y-0 font-sm text-neutral-600 dark:text-neutral-300">
        <li>
          <a
            className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="mailto:ivan.vykopal@kinit.sk"
          >
            <ArrowIcon size={12} />
            <p className="h-7 ml-2">Email</p>
          </a>
          <a
            className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.linkedin.com/in/ivan-vykopal-668893211/"
          >
            <ArrowIcon size={12} />
            <p className="h-7 ml-2">LinkedIn</p>
          </a>
          <a
            className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/ivanvykopal"
          >
            <ArrowIcon size={12} />
            <p className="h-7 ml-2">GitHub</p>
          </a>
          <a
            className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.researchgate.net/profile/Ivan-Vykopal"
          >
            <ArrowIcon size={12} />
            <p className="h-7 ml-2">ResearchGate</p>
          </a>
          <a
            className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="https://orcid.org/0000-0002-0431-0044"
          >
            <ArrowIcon size={12} />
            <p className="h-7 ml-2">ORCID</p>
          </a>
          <a
            className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="https://scholar.google.com/citations?user=HgsKgYAAAAAJ"
          >
            <ArrowIcon size={12} />
            <p className="h-7 ml-2">Scholar</p>
          </a>
        </li>
      </ul>
    </section>
  );
}