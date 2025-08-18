interface EducationCardProps {
  faculty: string,
  school: string,
  location: string,
  startDate: string,
  endDate: string,
  description: string,
  url: string,
  logo?: string // Optional logo URL
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
    logo
  }: EducationCardProps,
) => {
  return (
    <div className="bg-gray-300 shadow-sm rounded-2xl p-4 mb-4 border border-gray-700">
      <div className="flex flex-row items-center justify-between gap-4">
        {logo && (
            <div className="flex-shrink-0">
              <img
                src={logo}
                alt={`${faculty} logo`}
                className="w-12 h-12 object-contain rounded"
                // add white background for the image with padding
                style={{ backgroundColor: 'white', padding: '4px' }}
              />
            </div>
          )}

        <div className="flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900">{faculty}</h3>
          <h4 className="text-base font-medium text-gray-700">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {faculty}
              </a>
            ) : (
              faculty
            )}
          </h4>
          <p className="text-sm text-gray-500">{location}</p>
        </div>

        <div className="flex flex-col text-right text-sm text-gray-400">
          <div className="whitespace-nowrap">
            <span>{startDate} – {endDate}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col ml-16">
        <p className="text-base font-semibold mb-0 pb-0 text-gray-700">{description}</p>
      </div>
    </div>
  )

}