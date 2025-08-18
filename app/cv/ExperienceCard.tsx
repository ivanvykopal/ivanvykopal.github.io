import ReactMarkdown from "react-markdown";

interface ExperienceCardProps {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  activities: string[]; // Activities can be an array of strings
  employmentType: string;
  url: string;
  logo?: string; // Optional logo URL
}

export const ExperienceCard = (
  {
    position,
    company,
    location,
    startDate,
    endDate,
    activities,
    employmentType,
    url,
    logo
  }: ExperienceCardProps,
) => {

  return (
    <div className="bg-gray-300 shadow-sm rounded-2xl p-4 mb-4 border border-gray-700">
      <div className="flex flex-row items-center justify-between gap-4">
        {/* Left: Logo */}
        {logo && (
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt={`${company} logo`}
              className="w-14 h-14 object-contain rounded-xl border border-gray-300 bg-white p-1"
            />
          </div>
        )}

        {/* Middle: Info */}
        <div className="flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900">{position}</h3>
          <h4 className="text-base font-medium text-gray-700">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {company}
              </a>
            ) : (
              company
            )}
          </h4>
          <p className="text-sm text-gray-500">{location}</p>
        </div>

        {/* Right: Dates & Type */}
        <div className="flex flex-col text-right text-sm text-gray-400">
          <div className="whitespace-nowrap">
            <span>{startDate} – {endDate}</span>
          </div>
          <div>
            <p className="italic">{employmentType}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {activities && activities.length > 0 && (
        <div className="mt-4">
          <span className="mt-4 block font-semibold text-gray-900">Activities:</span>
          <ul className="mt-3 list-disc list-inside space-y-1">
            {activities.map((item, idx) => (
              <li key={idx} className="text-gray-700 text-sm leading-relaxed">
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <span className="text-gray-900" {...props} />, // make paragraph inline
                    li: ({node, ...props}) => <li className="text-gray-900" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                    em: ({node, ...props}) => <em {...props} />,
                    a: ({node, ...props}) => <a className="text-gray-900 underline" {...props} />,
                  }}
                >
                  {item}
                </ReactMarkdown>
              </li>
            ))}
        </ul>
        </div>
      )}
    </div>
  )
}