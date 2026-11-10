'use client';

import { useEffect } from 'react';
import { PageTitle } from './components/section';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageTitle
      intro={
        <p>
          Something went wrong while showing this page.{' '}
          <button type="button" onClick={reset} className="link">
            Try again
          </button>
          .
        </p>
      }
    >
      This page didn’t load
    </PageTitle>
  );
}
