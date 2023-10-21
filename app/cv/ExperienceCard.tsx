interface ExperienceCardProps {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  emplymentType: string;
  url: string;
}

export const ExperienceCard = (
  {
    position,
    company,
    location,
    startDate,
    endDate,
    description,
    emplymentType,
    url,
  }: ExperienceCardProps,
) => {
  return (
    <div className="m-0 p-0">
      <div className="flex flex-row justify-between m-0 p-0">
        <div className="flex flex-col m-0 p-0">
          <h3 className="text-lg font-semibold m-0 p-0">{position}</h3>
          <h4 className="text-base font-semibold m-0 p-0">
            <a href={url}>
              {company}
            </a>
          </h4>
          <h4 className="text-base font-semibold m-0 p-0">{location}</h4>
        </div>
        <div className="flex flex-col m-0 p-0">
          <h4 className="text-base font-semibold m-0 p-0">{startDate} - {endDate}</h4>
          <h4 className="text-base font-semibold m-0 p-0">{emplymentType}</h4>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-base font-semibold mb-0 pb-0">{description}</p>
      </div>
    </div>
  )
}