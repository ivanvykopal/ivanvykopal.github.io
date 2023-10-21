import { ExperienceCard } from "./ExperienceCard"
import { EducationCard } from "./EducationCard";
import { SkillsCard } from "./SkillsCard";


export default function Page() {
  return (
    <section>
      <div className="prose prose-neutral dark:prose-invert">
        <h2 className="dark:prose-invert dark:text-white">
          Experience
        </h2>
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
          <li className="mb-9">
            <ExperienceCard
              position="Administrative Officer"
              company="Datalogic"
              location="Trnava, Slovakia"
              startDate="Jun 2021"
              endDate="Jan 2022"
              description=""
              emplymentType="Part-time"
              url="https://www.datalogic.com/eng/index.html"
            />
          </li>
          <li className="mb-9">
            <ExperienceCard
              position="Administrative Officer"
              company="Datalogic"
              location="Trnava, Slovakia"
              startDate="Jul 2019"
              endDate="Jan 2020"
              description=""
              emplymentType="Part-time"
              url="https://www.datalogic.com/eng/index.html"
            />
          </li>
        </ul>
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <h2 className="dark:prose-invert dark:text-white">
          Education
        </h2>
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
          <li className="mb-9">
            <EducationCard
              faculty="Gymnasium of Ján Hollý"
              school=""
              location="Trnava, Slovakia"
              startDate="Sep 2014"
              endDate="Jun 2018"
              description=""
              url=""
            />
          </li>
        </ul>
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <h2 className="dark:prose-invert dark:text-white">
          Skills
        </h2>
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
              ]}
            />
          </li>
          <li>
            <SkillsCard
              category="Frameworks"
              skills={[
                "React",
                "Next.js",
                "Node.js",
                "Express",
                "Flask",
                "Django",
                "TensorFlow",
                "PyTorch",
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
                "Machine Learning",
                "Deep Learning",
                "Natural Language Processing",
                "Computer Vision",
                "Data Science",
                "Data Analysis",
                "Data Visualization",
                "Software Engineering",
                "Software Development",
                "Image Processing",
                "Large Langage Models",
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
    </section>
  );
}
