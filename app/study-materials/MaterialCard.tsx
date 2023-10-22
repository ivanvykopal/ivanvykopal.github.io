import { ArrowIcon } from "app/ArrowIcon";
import { AiFillYoutube } from "react-icons/ai";
import { BsFileEarmarkTextFill } from "react-icons/bs";

interface MaterialCardProps {
  name: string;
  link: string;
  type: string;
}

const ICON_SIZE = 16

export const MaterialCard = ({
  name,
  link,
  type,
}: MaterialCardProps) => {

  const handleType = (type: string): any => {
    if (type === "video") {
      return <AiFillYoutube size={ICON_SIZE} />
    } else if (type === "text") {
      return <BsFileEarmarkTextFill size={ICON_SIZE} />
    }
  }

  return (
    <div className="flex flex-row justify-between m-0 p-0">
      <div className="flex flex-col">
        <span className="text-base m-0 p-0">
          {name}
        </span>
      </div>
      <div className="flex flex-col">
        <div className="flex">
          <span className="pr-2">
            {
              handleType(type)
            }
          </span>
          <a
            className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href={link}
          >
            <ArrowIcon size={ICON_SIZE} />
          </a>
        </div>
      </div>
    </div>
  )
}