import { ResearchCard } from "./ResearchCard";

export default function Page() {
  return (
    <section>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">Publications</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <ul className="list-none list-inline">
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
              publisher="Springer Nature"
              link="https://link.springer.com/chapter/10.1007/978-3-031-44137-0_10"
              year="2023"
            />
          </li>
          <li>
            <ResearchCard
              title="Multilingual Previously Fact-Checked Claim Retrieval"
              authors={["Matúš Pikuliak", "Ivan Srba", "Robert Moro", "Timo Hromadka", "Timotej Smolen", "Martin Melisek", "Ivan Vykopal", "Jakub Simko", "Juraj Podrouzek", "Maria Bielikova"]}
              abstract="Fact-checkers are often hampered by the sheer amount of online content that needs to be fact-checked. NLP can help them by retrieving already existing fact-checks relevant to the content being investigated. This paper introduces a new multilingual dataset -- MultiClaim -- for previously fact-checked claim retrieval. We collected 28k posts in 27 languages from social media, 206k fact-checks in 39 languages written by professional fact-checkers, as well as 31k connections between these two groups. This is the most extensive and the most linguistically diverse dataset of this kind to date. We evaluated how different unsupervised methods fare on this dataset and its various dimensions. We show that evaluating such a diverse dataset has its complexities and proper care needs to be taken before interpreting the results. We also evaluated a supervised fine-tuning approach, improving upon the unsupervised method significantly."
              publisher="arXiv preprint"
              link="https://arxiv.org/abs/2305.07991"
              pdf="https://arxiv.org/pdf/2305.07991.pdf"
              year="2023"
            />
          </li>
        </ul>
      </div>
    </section>
  );
}
