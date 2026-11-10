import Link from 'next/link';
import { PageTitle } from './components/section';

export default function NotFound() {
  return (
    <PageTitle
      intro={
        <p>
          The link may be old or mistyped. Try the{' '}
          <Link href="/" className="link">
            home page
          </Link>{' '}
          or the{' '}
          <Link href="/research" className="link">
            list of publications
          </Link>
          .
        </p>
      }
    >
      This page doesn’t exist
    </PageTitle>
  );
}
