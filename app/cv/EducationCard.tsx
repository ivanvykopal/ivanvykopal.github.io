interface EducationCardProps {
  faculty: string,
  school: string,
  location: string,
  startDate: string,
  endDate: string,
  description: string,
  url: string,
}

export const EducationCard = (
  {
    faculty,
    school,
    location,
    startDate,
    endDate,
    description,
    url,
  }: EducationCardProps,
) => {
  return (
    <div className="m-0 p-0">
      <div className="flex flex-row justify-between m-0 p-0">
        <div className="flex flex-col m-0 p-0">
          <h3 className="text-lg font-semibold m-0 p-0">{faculty}</h3>
          <h4 className="text-base font-semibold m-0 p-0">
            <a href={url}>
              {school}
            </a>
          </h4>
          <h4 className="text-base font-semibold m-0 p-0">{location}</h4>
        </div>
        <div className="flex flex-col m-0 p-0">
          <h4 className="text-base font-semibold m-0 p-0">{startDate} - {endDate}</h4>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-base font-semibold mb-0 pb-0">{description}</p>
      </div>
    </div>
  )

}