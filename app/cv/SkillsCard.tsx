interface SkillsCardProps {
  category: string,
  skills: string[]
}

export const SkillsCard = (
  {
    category,
    skills,
  }: SkillsCardProps,
) => {
  return (
    <div className="m-0 p-0">
      <div className="flex flex-row justify-between m-0 p-0">
        <div className="flex flex-col m-0 p-0">
          <h3 className="text-lg font-semibold m-0 p-0">{category}</h3>
        </div>
      </div>
      <div className="flex flex-col ">
        <ul className="list-none list-inline mt-0 pt-0">
          {skills.map((skill) => (
            <li className="mb-1">
              <p className="text-base font-semibold mb-0 pb-0">{skill}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}