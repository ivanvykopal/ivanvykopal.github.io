'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/research', label: 'Publications' },
  { href: '/cv', label: 'CV' },
  { href: '/projects', label: 'Projects' },
  { href: '/study-materials', label: 'Study materials' },
  { href: '/blog', label: 'Blog' },
];

export default function SiteHeader() {
  const pathname = usePathname() || '/';

  return (
    <header className="no-print flex flex-col gap-3 border-b border-rule pb-5 sm:flex-row sm:items-baseline sm:justify-between">
      <Link
        href="/"
        className="text-[1.0625rem] font-semibold tracking-tight text-ink transition-colors hover:text-accent"
      >
        Ivan Vykopal
      </Link>
      <nav aria-label="Main">
        <ul className="-mx-1.5 flex flex-wrap gap-y-1 text-sm sm:-mx-2 sm:text-[0.9375rem]">
          {navItems.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={clsx(
                    'rounded px-1.5 py-1 underline-offset-[0.45em] transition-colors sm:px-2',
                    active
                      ? 'text-ink underline decoration-ink/40 decoration-1'
                      : 'text-muted hover:text-ink'
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
