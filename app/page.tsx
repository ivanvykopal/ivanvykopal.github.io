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
            {`I'm a Research Assistant and PhD Student at `}
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
            {` and member of the NLP team, focusing on machine learning, deep learning, the analysis of large language models, and computer vision.`}
          </p>
          <p className="prose prose-neutral dark:prose-invert">

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
          I hold a Master's degree in Computer Science from the Faculty of Informatics and Information Technologies at the Slovak University
          of Technology. During my studies, I focused on artificial intelligence, deep learning, participating in several research projects
          related to the application of deep learning and computer vision in the field of medicine. My Master's thesis and research delved
          into deep neural networks in the domain of medical image processing, with a specific focus on the segmentation of higher morphological
          structures for identifying possible cardiac transplant rejection.
        </p>
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <h3 className="dark:prose-invert dark:text-white">
          PhD Topic: Multilingual Natural Language Processing for Supporting Fact-Checking
        </h3>
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          Multilingual natural language processing (NLP) plays a critical role in designing models that can handle multiple languages simultaneously or focus on specific languages. While English dominates the field due to the abundance of available data for training powerful models, expanding NLP capabilities to other languages is essential, particularly for low-resource languages. This expansion becomes even more crucial in the context of false information, where NLP techniques can be used to detect and counter false information proliferating on the internet and social media platforms. As online spaces continue to grow as key sources of information, multilingual NLP emerges as a vital tool in the fight against misinformation, ensuring that fact-checking systems and models are equipped to address global and multilingual content effectively.
        </p>
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          With the recent advancement in large language models (LLM), we identify an opportunity to employ their potential and extensive capabilities in various complex NLP tasks, including fact-checking. Our research aims to evaluate the current capabilities of LLMs for supporting fact-checking and propose new approaches to mitigate the spread of false information in multilingual contexts while assisting fact-checkers in their efforts.
        </p>
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