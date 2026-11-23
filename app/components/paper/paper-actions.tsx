import type { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import {
  HiOutlineArrowDownTray,
  HiOutlineBookOpen,
  HiOutlineCodeBracket,
  HiOutlineDocumentText,
  HiOutlineNewspaper,
} from 'react-icons/hi2';
import type { Publication } from 'app/data/publications';

type Action = { label: string; href: string; icon: ReactNode; external?: boolean; primary?: boolean };

const icon = 'h-4 w-4 shrink-0';

/** Button row under the paper header: the paper itself is the primary action. */
export function PaperActions({ pub, hasBibtex }: { pub: Publication; hasBibtex: boolean }) {
  const actions: (Action | null)[] = [
    { label: 'Read the paper', href: pub.url, icon: <HiOutlineDocumentText aria-hidden className={icon} />, external: true, primary: true },
    pub.pdf && pub.pdf !== pub.url
      ? { label: 'PDF', href: pub.pdf, icon: <HiOutlineArrowDownTray aria-hidden className={icon} />, external: true }
      : null,
    pub.code
      ? { label: 'Code and data', href: pub.code, icon: <HiOutlineCodeBracket aria-hidden className={icon} />, external: true }
      : null,
    pub.post ? { label: 'Blog post', href: pub.post, icon: <HiOutlineNewspaper aria-hidden className={icon} /> } : null,
    hasBibtex ? { label: 'Cite', href: '#cite', icon: <HiOutlineBookOpen aria-hidden className={icon} /> } : null,
  ];

  return (
    <div className="no-print mt-6 flex flex-wrap gap-2.5">
      {actions.filter((a): a is Action => a !== null).map((a) => {
        const className = clsx(
          'inline-flex items-center gap-2 rounded-md border px-4 py-2 text-[0.9375rem] font-medium leading-none transition-colors duration-150 motion-reduce:transition-none',
          a.primary
            ? 'border-accent bg-accent text-page hover:border-accent-strong hover:bg-accent-strong'
            : 'border-rule bg-subtle text-ink hover:border-accent hover:text-accent'
        );
        return a.external ? (
          <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer" className={className}>
            {a.icon}
            {a.label}
          </a>
        ) : (
          <Link key={a.label} href={a.href} className={className}>
            {a.icon}
            {a.label}
          </Link>
        );
      })}
    </div>
  );
}
