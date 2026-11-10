import { profileLinks } from 'app/data/profile';

export default function SiteFooter() {
  return (
    <footer className="no-print mt-24 flex flex-col gap-3 border-t border-rule pt-6 text-sm text-muted sm:flex-row sm:items-baseline sm:justify-between">
      <p>© {new Date().getFullYear()} Ivan Vykopal</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {profileLinks.map(({ label, href, kind }) => (
          <li key={kind}>
            <a
              href={href}
              {...(href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              className="transition-colors hover:text-accent"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
