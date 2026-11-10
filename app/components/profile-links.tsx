import type { IconType } from 'react-icons';
import { HiOutlineEnvelope } from 'react-icons/hi2';
import {
  SiGithub,
  SiGooglescholar,
  SiLinkedin,
  SiOrcid,
  SiResearchgate,
} from 'react-icons/si';
import { profileLinks, type ProfileLink } from 'app/data/profile';

const icons: Record<ProfileLink['kind'], IconType> = {
  email: HiOutlineEnvelope,
  scholar: SiGooglescholar,
  github: SiGithub,
  linkedin: SiLinkedin,
  orcid: SiOrcid,
  researchgate: SiResearchgate,
};

export function ProfileLinks({ only }: { only?: ProfileLink['kind'][] }) {
  const links = only ? profileLinks.filter((l) => only.includes(l.kind)) : profileLinks;
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
      {links.map(({ label, href, kind }) => {
        const Icon = icons[kind];
        const external = !href.startsWith('mailto:');
        return (
          <li key={kind}>
            <a
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-accent"
            >
              <Icon
                aria-hidden
                className="h-[0.95em] w-[0.95em] text-muted transition-colors group-hover:text-accent"
              />
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
