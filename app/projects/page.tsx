import { ProjectCard } from "./ProjectCard";
import { AiFillGithub } from "react-icons/ai";
import { SiArxiv } from "react-icons/si";


export default function Page() {
  return (
    <section>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">Projects</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <div>
          <ul className="list-none list-inline">
            <li>
              <ProjectCard
                name="Large Language Models for Multilingual Previously Fact-Checked Claim Detection"
                description="The repository for the paper 'Large Language Models for Multilingual Previously Fact-Checked Claim Detection'"
                link="https://github.com/kinit-sk/llms-claim-matching"
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="NLP Resources"
                description="A list of resources for NLP tasks. The list includes datasets and modelsfor Slovak and Czech languages."
                link="https://github.com/ivanvykopal/nlp-resources"
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="XTranslator"
                description="Python package for translating text using multiple translation services. The package also include language detection and is available on PyPI."
                link="https://github.com/ivanvykopal/xtranslator"
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="Soft Language Prompts for Language Transfer"
                description="This is the source code for the paper Soft Language Prompts for Language Transfer."
                link="https://github.com/kinit-sk/adapter-prompt-evaluation"
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="Task Templates"
                description="Templates for the NLP tasks."
                link="https://github.com/ivanvykopal/tasktemplates"
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="Project for the NLP Lectures"
                description="Project for NLP Lectures at FIT BUT"
                link="https://github.com/ivanvykopal/NLP-Project"
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="Disinformation Capabilities of Large Language Models"
                description="Source code for the paper 'Disinformation Capabilities of Large Language Models'"
                link="https://github.com/kinit-sk/disinformation-capabilities"
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="ArXiv Viewer"
                description="Implementation of viewer for ArXiv. The application allows you to search for scientific papers from the last day or the last week and also filter by category. In the application, the user can tag some papers and add them to a favorites list to read them later. The application also retrieves data from the Call for papers (WikiCFP)."
                link="https://arxiv-viewer.vercel.app"
                icon={<SiArxiv size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name='Extension of MONAILabel'
                description="In my Master's thesis, I extended the original MONAILabel. As part of the extension, I added GPU-enabled TensorFlow to the MONAILabel and also custom implementations of 3 models aimed at segmenting higher morpological structures in histological images after cardiac biopsy. Currently, the extension is part of the QuPath tool and is used by doctors and pathologists for histological image analysis."
                link='https://github.com/ivanvykopal/MONAILabel/tree/development'
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="MONAILabel Documentation"
                description="Documentation of the extension of MONAILabel with custom implementations of 3 models targeted at segmenting higher morpological structures in histological images after cardiac biopsy."
                link="https://github.com/ivanvykopal/MONAILabel-docs"
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="Quantitative analysis using neural networks to support cardiac transplant rejection diagnostic"
                description="Implementation of Master's Thesis: Quantitative analysis using neural networks to support cardiac transplant rejection diagnostic"
                link="https://github.com/ivanvykopal/Cardiac-transplant-rejection-diagnosis"
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="Error detection system"
                description="A system designed to identify shortcomings in the optimization of variables in source files in the C programming language. This system is part of a Bachelor's thesis titled Graph coloring in program analysis."
                link="https://github.com/ivanvykopal/Error-detection-system"
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="React Application"
                description="The project consist of a list of customers and their orders. The project was implemented using React, GraphQL and Grommet."
                link="https://github.com/ivanvykopal/React-App"
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="School Project for Information Retrieval"
                description="Project related to information retrieval from Freebase database using Pylucene and Spark."
                link="https://github.com/ivanvykopal/VINF"
                icon={<AiFillGithub size={30} />}
              />
            </li>
            <li>
              <ProjectCard
                name="School Project for Application development with multi-layer architecture"
                description="Project focused on the implementation of a warehouse system in Java."
                link="https://github.com/ivanvykopal/VAVA-Project"
                icon={<AiFillGithub size={30} />}
              />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
