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
              company="KInIT"
              location="Bratislava, Slovakia"
              startDate="Jun 2023"
              endDate="present"
              description="Experience"
              emplymentType="Full-time"
              url="http://kinit.sk/"
            />
          </li>
          <li className="mb-9">
            <ExperienceCard
              position="Research Intern"
              company="KInIT"
              location="Bratislava, Slovakia"
              startDate="Sep 2022"
              endDate="Jun 2023"
              description=""
              emplymentType="Part-time"
              url="http://kinit.sk/"
            />
          </li>
          <li className="mb-9">
            <ExperienceCard
              position="Full Stack Developer"
              company="iteria.io"
              location="Bratislava, Slovakia"
              startDate="Feb 2022"
              endDate="Aug 2022"
              description=""
              emplymentType="Part-time"
              url="https://iteria.app/"
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
