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
          PhD topic: Natural Language Processing
        </h3>
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          Multilingual low-resource language processing presents a unique set of challenges and opportunities in the field of natural language processing.
          As our increasingly connected world brings together people from diverse linguistic backgrounds, the need to support multiple languages, especially
          those with limited resources, has become paramount. In this context, the use of advanced machine learning techniques, such as cross-lingual transfer
          learning and multilingual embeddings, has gained prominence. These approaches enable models to leverage knowledge from resource-rich languages to
          improve the performance of low-resource language processing tasks.
        </p>
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          Additionally, when working with low-resource languages, we often encounter linguistic diversity and complexity that demand special attention. Each
          language has its unique features, such as different alphabets, grammar structures, and word forms. Adapting models to these variations is essential
          for accurate understanding and processing. Moreover, as we strive to support low-resource languages, we must address the issue of limited data
          resources. To tackle these challenges, researchers are continually exploring innovative algorithmic approaches, data augmentation methods,
          and collaborative initiatives to expand linguistic resources for underrepresented languages. In this multilingual landscape, the pursuit of
          effective low-resource language processing solutions remains a vital imperative for research and development.
        </p>
      </div>
      <ul className="flex flex-col md:flex-row mt-8 space-x-0 md:space-x-4 space-y-2 md:space-y-0 font-sm text-neutral-600 dark:text-neutral-300">
        <li>
          <a
            className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="ivan.vykopal@kinit.sk"
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
        </li>
      </ul>
    </section>
  );
}