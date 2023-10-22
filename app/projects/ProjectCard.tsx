interface ProjectCardProps {
  name: string;
  description: string;
  link: string;
  icon: any;
}

export const ProjectCard = (
  {
    name,
    description,
    link,
    icon,
  }: ProjectCardProps
) => {
  return (
    <div className="mb-9 bg-neutral-800 p-3 rounded-lg">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col m-0 p-0">
          <h3 className="text-lg font-semibold m-0 p-0">
            {name}
          </h3>
        </div>
        <div className="pr-2">
          <a href={link}>
            {icon}
          </a>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-base mb-0 pb-0">{description}</p>
      </div>
    </div>
  )

}