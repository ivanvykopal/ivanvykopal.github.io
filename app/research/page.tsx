import { ResearchCard } from "./ResearchCard";

export default function Page() {
  return (
    <section>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">Publications</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <ul className="list-none list-inline">
          <li>
            <ResearchCard
              title="Large Language Models for Multilingual Previously Fact-Checked Claim Detection"
              authors={["Ivan Vykopal", "Matúš Pikuliak", "Simon Ostermann", "Tatiana Anikina", "Michal Gregor", "Marián Šimko"]}
              abstract="In our era of widespread false information, human fact-checkers often face the challenge of duplicating efforts when verifying claims that may have already been addressed in other countries or languages. As false information transcends linguistic boundaries, the ability to automatically detect previously fact-checked claims across languages has become an increasingly important task. This paper presents the first comprehensive evaluation of large language models (LLMs) for multilingual previously fact-checked claim detection. We assess seven LLMs across 20 languages in both monolingual and cross-lingual settings. Our results show that while LLMs perform well for high-resource languages, they struggle with low-resource languages. Moreover, translating original texts into English proved to be beneficial for low-resource languages. These findings highlight the potential of LLMs for multilingual previously fact-checked claim detection and provide a foundation for further research on this promising application of LLMs."
              publisher="arXiv preprint"
              link="https://arxiv.org/abs/2503.02737"
              pdf="https://arxiv.org/pdf/2503.02737"
              year="2025"
            />
          </li>
          <li>
            <ResearchCard
              title="Small Models, Big Impact: Efficient Corpus and Graph-Based Adaptation of Small Multilingual Language Models for Low-Resource Languages"
              authors={["Daniil Gurgurov", "Ivan Vykopal", "Josef van Genabith", "Simon Ostermann"]}
              abstract="Low-resource languages (LRLs) face significant challenges in natural language processing (NLP) due to limited data. While current state-of-the-art large language models (LLMs) still struggle with LRLs, smaller multilingual models (mLMs) such as mBERT and XLM-R offer greater promise due to a better fit of their capacity to low training data sizes. This study systematically investigates parameter-efficient adapter-based methods for adapting mLMs to LRLs, evaluating three architectures: Sequential Bottleneck, Invertible Bottleneck, and Low-Rank Adaptation. Using unstructured text from GlotCC and structured knowledge from ConceptNet, we show that small adaptation datasets (e.g., up to 1 GB of free-text or a few MB of knowledge graph data) yield gains in intrinsic (masked language modeling) and extrinsic tasks (topic classification, sentiment analysis, and named entity recognition). We find that Sequential Bottleneck adapters excel in language modeling, while Invertible Bottleneck adapters slightly outperform other methods on downstream tasks due to better embedding alignment and larger parameter counts. Adapter-based methods match or outperform full fine-tuning while using far fewer parameters, and smaller mLMs prove more effective for LRLs than massive LLMs like LLaMA-3, GPT-4, and DeepSeek-R1-based distilled models. While adaptation improves performance, pre-training data size remains the dominant factor, especially for languages with extensive pre-training coverage."
              publisher="arXiv preprint"
              link="https://arxiv.org/abs/2502.10140"
              pdf="https://arxiv.org/pdf/2502.10140"
              year="2025"
            />
          </li>
          <li>
            <ResearchCard
              title="Soft Language Prompts for Language Transfer"
              authors={["Ivan Vykopal", "Simon Ostermann", "Marián Šimko"]}
              abstract="Cross-lingual knowledge transfer, especially between high- and low-resource languages, remains challenging in natural language processing (NLP). This study offers insights for improving cross-lingual NLP applications through the combination of parameter-efficient fine-tuning methods. We systematically explore strategies for enhancing cross-lingual transfer through the incorporation of language-specific and task-specific adapters and soft prompts. We present a detailed investigation of various combinations of these methods, exploring their efficiency across 16 languages, focusing on 10 mid- and low-resource languages. We further present to our knowledge the first use of soft prompts for language transfer, a technique we call soft language prompts. Our findings demonstrate that in contrast to claims of previous work, a combination of language and task adapters does not always work best; instead, combining a soft language prompt with a task adapter outperforms most configurations in many cases."
              publisher="arXiv preprint (Accepted at the NAACL 2025 Main Conference)"
              link="https://arxiv.org/abs/2407.02317"
              pdf="https://arxiv.org/pdf/2407.02317"
              year="2024"
            />
          </li>
          <li>
            <ResearchCard
              title="Generative Large Language Models in Automated Fact-Checking: A Survey"
              authors={["Ivan Vykopal", "Matúš Pikuliak", "Simon Ostermann", "Marián Šimko"]}
              abstract="The dissemination of false information on online platforms presents a serious societal challenge. While manual fact-checking remains crucial, Large Language Models (LLMs) offer promising opportunities to support fact-checkers with their vast knowledge and advanced reasoning capabilities. This survey explores the application of generative LLMs in fact-checking, highlighting various approaches and techniques for prompting or fine-tuning these models. By providing an overview of existing methods and their limitations, the survey aims to enhance the understanding of how LLMs can be used in fact-checking and to facilitate further progress in their integration into the fact-checking process."
              publisher="arXiv preprint"
              link="https://arxiv.org/abs/2407.02351"
              pdf="https://arxiv.org/pdf/2407.02351"
              year="2024"
            />
          </li>
          <li>
            <ResearchCard
              title="ExU: AI Models for Examining Multilingual Disinformation Narratives and Understanding their Spread"
              authors={["Jake Vasilakes", "Zhixue Zhao", "Michal Gregor", "Ivan Vykopal", "Martin Hyben", "Carolina Scarton"]}
              abstract="Addressing online disinformation requires analysing narratives across languages to help fact-checkers and journalists sift through large amounts of data. The ExU project focuses on developing AI-based models for multilingual disinformation analysis, addressing the tasks of rumour stance classification and claim retrieval. We describe the ExU project proposal and summarise the results of a user requirements survey regarding the design of tools to support fact-checking."
              publisher="EAMT 2024, European Association for Machine Translation"
              link="https://aclanthology.org/2024.eamt-2.20/"
              pdf="https://aclanthology.org/2024.eamt-2.20.pdf"
              year="2024"
            />
          </li>
          <li>
            <ResearchCard
              title="Disinformation Capabilities of Large Language Models"
              authors={["Ivan Vykopal", "Matúš Pikuliak", "Ivan Srba", "Robert Moro", "Dominik Macko", "Maria Bielikova"]}
              abstract="Automated disinformation generation is often listed as one of the risks of large language models (LLMs). The theoretical ability to flood the information space with disinformation content might have dramatic consequences for democratic societies around the world. This paper presents a comprehensive study of the disinformation capabilities of the current generation of LLMs to generate false news articles in English language. In our study, we evaluated the capabilities of 10 LLMs using 20 disinformation narratives. We evaluated several aspects of the LLMs: how well they are at generating news articles, how strongly they tend to agree or disagree with the disinformation narratives, how often they generate safety warnings, etc. We also evaluated the abilities of detection models to detect these articles as LLM-generated. We conclude that LLMs are able to generate convincing news articles that agree with dangerous disinformation narratives."
              publisher="ACL 2024, Association for Computational Linguistics"
              link="https://aclanthology.org/2024.acl-long.793/"
              pdf="https://aclanthology.org/2024.acl-long.793.pdf"
              year="2024"
            />
          </li>
          <li>
            <ResearchCard
              title="Digital Pathology in Cardiac Transplant Diagnostics: From Biopsies to Algorithms"
              authors={["Martin Kveton", "Lukas Hudec", "Ivan Vykopal", "Matej Halinkovic", "Miroslav Laco", "Andrea Felsoova", "Wanda Benesova", "Ondrej Fabian"]}
              abstract="In the field of heart transplantation, the ability to accurately and promptly diagnose cardiac allograft rejection is crucial. This comprehensive review explores the transformative role of digital pathology and computational pathology, especially through machine learning, in this critical domain. These methodologies harness large datasets to extract subtle patterns and valuable information that extend beyond human perceptual capabilities, potentially enhancing diagnostic outcomes. Current research indicates that these computer-based systems could offer accuracy and performance matching, or even exceeding, that of expert pathologists, thereby introducing more objectivity and reducing observer variability. Despite promising results, several challenges such as limited sample sizes, diverse data sources, and the absence of standardized protocols pose significant barriers to the widespread adoption of these techniques. The future of digital pathology in heart transplantation diagnostics depends on utilizing larger, more diverse patient cohorts, standardizing data collection, processing, and evaluation protocols, and fostering collaborative research efforts. The integration of various data types, including clinical, demographic, and imaging information, could further refine diagnostic precision. As researchers address these challenges and promote collaborative efforts, digital pathology has the potential to become an integral part of clinical practice, ultimately improving patient care in heart transplantation."
              publisher="Cardiovascular Pathology"
              link="https://www.sciencedirect.com/science/article/pii/S1054880723000716"
              year="2023"
            />
          </li>
          <li>
            <ResearchCard
              title="DeepLabV3+ Ensemble for Diagnosis of Cardiac Transplant Rejection"
              authors={["Ivan Vykopal", "Lukas Hudec", "Martin Kveton", "Ondrej Fabian", "Andrea Felsoova", "Wanda Benesova"]}
              abstract="Heart transplantation is a complex procedure, often joined with complications such as cardiac transplant rejection. Current diagnostic methods include regular invasive and time-consuming biopsies followed by histopathological analysis. Deep learning has the potential to significantly enhance speed and objectivity and introduce new information from the obtained sample to increase the chances of predicting rejection. Our study presents several deep-learning approaches for quantitative analysis of histological scans for acquiring supportive information. The proposed segmentation methods focus on inflammation, endocardium, and blood vessels. The study compares the experimental results of multiple methods evaluated using real data from medical experts. This study lays the groundwork for future research and demonstrates the potential of deep learning applied to the prediction of transplant rejection."
              publisher="International Conference on Computer Vision Systems, Springer Nature"
              link="https://link.springer.com/chapter/10.1007/978-3-031-44137-0_10"
              year="2023"
            />
          </li>
          <li>
            <ResearchCard
              title="Multilingual Previously Fact-Checked Claim Retrieval"
              authors={["Matúš Pikuliak", "Ivan Srba", "Robert Moro", "Timo Hromadka", "Timotej Smolen", "Martin Melisek", "Ivan Vykopal", "Jakub Simko", "Juraj Podrouzek", "Maria Bielikova"]}
              abstract="Fact-checkers are often hampered by the sheer amount of online content that needs to be fact-checked. NLP can help them by retrieving already existing fact-checks relevant to the content being investigated. This paper introduces a new multilingual dataset for previously fact-checked claim retrieval. We collected 28k posts in 27 languages from social media, 206k fact-checks in 39 languages written by professional fact-checkers, as well as 31k connections between these two groups. This is the most extensive and the most linguistically diverse dataset of this kind to date. We evaluated how different unsupervised methods fare on this dataset and its various dimensions. We show that evaluating such a diverse dataset has its complexities and proper care needs to be taken before interpreting the results. We also evaluated a supervised fine-tuning approach, improving upon the unsupervised method significantly."
              publisher="EMNLP 2023, Association for Computational Linguistics"
              link="https://aclanthology.org/2023.emnlp-main.1027/"
              pdf="https://aclanthology.org/2023.emnlp-main.1027.pdf"
              year="2023"
            />
          </li>
          <li>
            <ResearchCard
              title="Weakly Supervised Semantic Cell Segmentation Using Knowledge Distillation"
              authors={["Ivana Háberová", "Ivan Vykopal"]}
              abstract="This study proposes a new approach for semantic cell segmentation that combines the use of neural networks and involving humans in the loop with the aim of improving the current state of digital pathology. The goal is to obtain cell segmentation and classification from heart biopsy images based on inaccurate data and simultaneously to reduce the demands on domain experts - doctors. In the first step, the approach utilizes a segmentation model and a combination of different datasets to detect the nuclei of cells in the patches of whole slide images, which are used to increase the amount of data. The proposed approach employs knowledge distillation, a technique that involves training a smaller ”student” model to mimic the output of a larger ”teacher” model and their chaining. This is done to overcome the limitations of having a small amount of accurate data and a high proportion of inaccurate annotations and to remove inaccuracies through chaining. The proposed approach is evaluated against traditional methods and shows that it achieves improved performance in terms of semantic cell segmentation. This demonstrates the potential for the approach to be applied in biomedical image analysis, where accurate and precise segmentation is essential for downstream analysis."
              publisher="CESCG.org"
              link="https://cescg.org/wp-content/uploads/2023/04/Vykopal-Weakly-Supervised-Semantic-Cell-Segmentation-Using-Knowledge-Distillation.pdf"
              pdf="https://cescg.org/wp-content/uploads/2023/04/Vykopal-Weakly-Supervised-Semantic-Cell-Segmentation-Using-Knowledge-Distillation.pdf"
              year="2023"
            />
          </li>
        </ul>
      </div>
    </section>
  );
}
