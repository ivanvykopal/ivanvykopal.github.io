import { ExperienceCard } from "./ExperienceCard"
import { EducationCard } from "./EducationCard";
import { SkillsCard } from "./SkillsCard";


export default function Page() {
  return (
    <section>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">Experience</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <ul className="list-none list-inline">
          <li className="mb-9">
            <ExperienceCard
              position="Research Assistant"
              company="Kempelen Institute of Intelligent Technologies (KInIT)"
              location="Bratislava, Slovakia"
              startDate="Jun 2023"
              endDate="present"
              activities={[
                "Research in the field of multilingual natural language processing, focusing on low-resource languages, multilinguality and fact-checking.",
                "Development of methods for fact-checking and analyzing capabilities of large language models for fact-checking tasks.",
                "Participating in [**DisAI-AMPLIFIED**](https://kinit.sk/project/disai-amplified/), [**DisAI**](https://kinit.sk/project/disai-improving-scientific-excellence-of-kinit/) and [**ExU**](https://kinit.sk/project/exu-ai-models-for-examining-multilingual-disinformation-narratives-and-understanding-their-spread/) projects.",
              ]}
              employmentType="Full-time"
              url="http://kinit.sk/"
              logo="https://avatars.githubusercontent.com/u/76482031"
            />
          </li>
          <li className="mb-9">
            <ExperienceCard
              position="Visiting Researcher"
              company="Deutsches Forschungszentrum für Künstliche Intelligenz (DFKI)"
              location="Saarbrücken, Germany"
              startDate="Jun 2024"
              endDate="Jul 2024"
              activities={[
                "One month research stay at DFKI, working on multilingual natural language processing, low-resource settings and fact-checking.",
                "Research stay as part of the [**DisAI**](https://kinit.sk/project/disai-improving-scientific-excellence-of-kinit/) project.",
              ]}
              employmentType="Full-time"
              url="https://www.dfki.de/"
              logo="https://upload.wikimedia.org/wikipedia/commons/3/31/DFKI_logo_since_2023.png"
            />
          </li>
          <li className="mb-9">
            <ExperienceCard
              position="Research Intern"
              company="Kempelen Institute of Intelligent Technologies (KInIT)"
              location="Bratislava, Slovakia"
              startDate="Sep 2022"
              endDate="Jun 2023"
              activities={[
                "Conductin experiments and evaluation the potential misuses of large language models for spreading disinformation.",
                "Partcipating in [**veraAI**](https://kinit.sk/project/vera-ai-verification-assisted-by-artificial-intelligence/) and [**CEDMO**](https://kinit.sk/project/cedmo-central-european-digital-media-observatory/) projects.",
                "Conducting experiments within [**CEDMO**](https://kinit.sk/project/cedmo-central-european-digital-media-observatory/) project."
              ]}
              employmentType="Part-time"
              url="http://kinit.sk/"
              logo="https://avatars.githubusercontent.com/u/76482031"
            />
          </li>
          <li className="mb-9">
            <ExperienceCard
              position="Full Stack Developer"
              company="iteria.io"
              location="Bratislava, Slovakia"
              startDate="Feb 2022"
              endDate="Aug 2022"
              activities={[]}
              employmentType="Part-time"
              url="https://iteria.app/"
              logo="https://media.licdn.com/dms/image/v2/C4E0BAQEeLXzQ43ZKwg/company-logo_200_200/company-logo_200_200/0/1668068922952/iteria_io_logo?e=2147483647&v=beta&t=vofULSCGGTG85TCVLdRMuPkH2KKVbkGY6FMqdCpl3mg"
            />
          </li>
        </ul>
      </div>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">Education</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <ul className="list-none list-inline">
          <li className="mb-9">
            <EducationCard
              faculty="Faculty of Information Technology"
              school="Brno University of Technology"
              location="Brno, Czech Republic"
              startDate="Sep 2023"
              endDate="present"
              description="PhD. in Informatics"
              url="https://www.fit.vut.cz/.en"
              logo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJo7uBA2tBMbzG50FPG8gFmNdK608vrv-irw&s"
            />
          </li>
          <li className="mb-9">
            <EducationCard
              faculty="Faculty of Informatics and Information Technologies"
              school="Slovak University of Technology"
              location="Bratislava, Slovakia"
              startDate="Sep 2021"
              endDate="Jun 2023"
              description="MSc. in Computer Science"
              url="https://www.fiit.stuba.sk/en"
              logo="https://upload.wikimedia.org/wikipedia/commons/3/3b/Logo_Slovenskej_technickej_univerzity_v_Bratislave.jpg"
            />
          </li>
          <li className="mb-9">
            <EducationCard
              faculty="Faculty of Informatics and Information Technologies"
              school="Slovak University of Technology"
              location="Bratislava, Slovakia"
              startDate="Sep 2018"
              endDate="Jun 2021"
              description="BSc. in Computer Science"
              url="https://www.fiit.stuba.sk/en"
              logo="https://upload.wikimedia.org/wikipedia/commons/3/3b/Logo_Slovenskej_technickej_univerzity_v_Bratislave.jpg"
            />
          </li>
        </ul>
      </div>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">Skills</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <ul className="list-none list-inline">
          <li>
            <SkillsCard
              category="Languages"
              skills={[
                "Slovak (native)",
                "English (B2)",
              ]}
            />
          </li>
          <li>
            <SkillsCard
              category="Programming Languages"
              skills={[
                "Python",
                "JavaScript",
                "TypeScript",
                "C",
                "C++",
                "Java",
                "R",
                "SQL",
                "HTML",
                "CSS",
                "Svelte",
                "MATLAB",
                "XML",
                "Bash"
              ]}
            />
          </li>
          <li>
            <SkillsCard
              category="Frameworks"
              skills={[
                "PyTorch",
                "Transformers",
                "TensorFlow",
                "React",
                "Next.js",
                "Node.js",
                "Express",
                "Flask",
                "Django",
              ]}
            />
          </li>
          <li>
            <SkillsCard
              category="Tools"
              skills={[
                "Git",
                "Docker",
                "Kubernetes",
                "Elasticsearch",
                "Neo4j",
                "PostGiS",
                "MongoDB",
                "PostgreSQL",
                "GraphQL",
                "Linux",
                "Windows",
              ]}
            />
          </li>
          <li>
            <SkillsCard
              category="Other"
              skills={[
                "Natural Language Processing",
                "Large Langage Models",
                "Fact-Checking",
                "Low-Resource Languages",
                "Machine Learning",
                "Deep Learning",
                "Computer Vision",
                "Data Science",
                "Data Analysis",
                "Data Visualization",
                "Software Engineering",
                "Software Development",
                "Image Processing",
              ]}
            />
          </li>
          <li>
            <SkillsCard
              category="Interpersonal skills"
              skills={[
                "Teamwork",
                "Time management",
                "Problem solving",
                "Organization skills",
              ]}
            />
          </li>
        </ul>
      </div>
    </section >
  );
}
