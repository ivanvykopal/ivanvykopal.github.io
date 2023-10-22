import { ArrowIcon } from "app/ArrowIcon";
import React from "react";
import { BsFileEarmarkPdfFill } from "react-icons/bs"

interface ResearchCardProps {
  title: string;
  authors: string[];
  abstract: string;
  publisher: string;
  link: string;
  doi?: string;
  pdf?: string;
  year: string;
}

export const ResearchCard = ({
  title,
  authors,
  abstract,
  publisher,
  link,
  doi,
  pdf,
  year,
}: ResearchCardProps
) => {

  const formatAuthors = (authors: string[]): string[] => {
    return authors.map(author => {
      let name = author.split(' ')[0];
      let surname = author.split(' ')[1];

      return `${name[0]}. ${surname}`
    })
  }

  const boldMe = (authors: string, myName = "I. Vykopal") => {
    const result = authors.replace(myName, `<strong>${myName}</strong>`);

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  }


  return (
    <div className="mb-9 bg-neutral-800 p-3 rounded-lg">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold m-0 p-0">
            Title: {title}
          </h3>
        </div>
        <div className="flex flex-col m-2">
          <div className="flex">
            {
              pdf &&
              <a
                className="pr-5"
                href={pdf}>
                <BsFileEarmarkPdfFill size={18} />
              </a>
            }
            <a
              className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
              rel="noopener noreferrer"
              target="_blank"
              href={link}
            >
              <ArrowIcon size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-base mt-2 mb-0 pb-0">
          <span className="mt-4 p-0 font-semibold">
            Authors:
          </span>
          {' '}
          {boldMe(formatAuthors(authors).join(', '))}
        </p>
      </div>
      <div className="flex flex-col">
        <span className="mt-4 p-0 font-semibold">
          Abstract:
        </span>
        <p className="text-base mt-2 mb-0 pb-0">{abstract}</p>
      </div>
      <div className="flex flex-col">
        <span className="mb-0 pb-0 mt-6"><span className="font-semibold">Publisher:</span> {publisher}</span>
        <span className="mb-0"><span className="font-semibold">Publication year:</span> {year}</span>
        {
          doi &&
          <span className="mb-0 pb-0 mt-6"><span className="font-semibold">doi:</span> {doi}</span>
        }
      </div>
    </div>
  )
}