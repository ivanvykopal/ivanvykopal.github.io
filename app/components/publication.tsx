import Link from 'next/link';
import { ME, isFirstAuthor, type Publication } from 'app/data/publications';
import { AbstractToggle } from './abstract-toggle';
import { DatedRow } from './section';

function Authors({ authors }: { authors: string[] }) {
  return (
    <>
      {authors.map((name, i) => (
        <span key={name}>
          {name === ME ? <span className="font-semibold text-ink">{name}</span> : name}
          {i < authors.length - 1 ? ', ' : ''}
        </span>
      ))}
    </>
  );
}

/** Full entry for the Research page; `compact` puts the venue in the left gutter and shortens the author list. */
export function PublicationEntry({ pub, id, compact }: { pub: Publication; id: string; compact?: boolean }) {
  const links = [
    { label: 'Paper', href: pub.url },
    pub.pdf && pub.pdf !== pub.url ? { label: 'PDF', href: pub.pdf } : null,
    pub.code ? { label: 'Code', href: pub.code } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  // Compact lists authors up to and including me, then "et al."
  const shown = compact ? pub.authors.slice(0, pub.authors.indexOf(ME) + 1) : pub.authors;
  const note = [pub.venueNote, isFirstAuthor(pub) ? 'First author' : null].filter(Boolean).join(' · ');

  const body = (
    <article>
      <h3 className="text-[1rem] font-semibold leading-snug text-ink">
        <a
          href={pub.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-accent"
        >
          {pub.title}
        </a>
      </h3>
      <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-2">
        <Authors authors={shown} />
        {shown.length < pub.authors.length ? (shown.length > 1 ? ', et al.' : ' et al.') : null}
      </p>
      <p className="mt-1 text-[0.9375rem] text-ink-2">
        {compact ? (
          <span className="text-muted">{note}</span>
        ) : (
          <>
            <span className="font-semibold text-ink">{pub.venue}</span>
            <span className="text-muted"> · {note}</span>
          </>
        )}
      </p>
      <AbstractToggle id={id} abstract={pub.abstract}>
        {links.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="link">
            {label}
          </a>
        ))}
        {pub.post ? (
          <Link href={pub.post} className="link">
            Blog post
          </Link>
        ) : null}
      </AbstractToggle>
    </article>
  );

  return compact ? (
    <DatedRow date={<span className="font-semibold text-ink">{pub.venue}</span>}>{body}</DatedRow>
  ) : (
    body
  );
}
