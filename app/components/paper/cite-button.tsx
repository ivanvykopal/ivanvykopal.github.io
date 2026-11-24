'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { HiOutlineBookOpen, HiOutlineCheck } from 'react-icons/hi2';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API unavailable (insecure context, denied permission): fall back to a hidden textarea.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      return document.execCommand('copy');
    } finally {
      document.body.removeChild(ta);
    }
  }
}

/** Copies the BibTeX entry to the clipboard and confirms it in place. */
export function CiteButton({ bibtex, className }: { bibtex: string; className: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onClick() {
    setState((await copyText(bibtex)) ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2000);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(className, state === 'copied' && 'border-accent text-accent')}
    >
      {state === 'copied' ? (
        <HiOutlineCheck aria-hidden className="h-4 w-4 shrink-0" />
      ) : (
        <HiOutlineBookOpen aria-hidden className="h-4 w-4 shrink-0" />
      )}
      <span aria-live="polite">
        {state === 'copied' ? 'Copied BibTeX' : state === 'failed' ? 'Copy failed, see below' : 'Cite'}
      </span>
    </button>
  );
}
