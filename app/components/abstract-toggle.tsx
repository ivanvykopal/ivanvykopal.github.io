'use client';

import { useState, type ReactNode } from 'react';

/** Link row for a publication plus an Abstract button that reveals the abstract below it. */
export function AbstractToggle({
  id,
  abstract,
  children,
}: {
  id: string;
  abstract: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `${id}-abstract`;

  return (
    <>
      <div className="no-print mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
        {children}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="link inline-flex items-baseline gap-1"
        >
          {open ? 'Hide abstract' : 'Abstract'}
          <svg
            aria-hidden
            viewBox="0 0 10 10"
            className={`h-2 w-2 self-center transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      <p
        id={panelId}
        hidden={!open}
        className="mt-3 max-w-[40rem] border-l border-rule pl-4 text-[0.9375rem] leading-relaxed text-ink-2"
      >
        {abstract}
      </p>
    </>
  );
}
