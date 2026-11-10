import './global.css';
import clsx from 'clsx';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import SiteHeader from './components/site-header';
import SiteFooter from './components/site-footer';
import { SITE_URL } from './data/profile';

const graphik = localFont({
  src: [
    {
      path: '../public/fonts/Graphik-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Graphik-Medium.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-graphik',
  display: 'swap',
});

const description =
  'Ivan Vykopal, PhD student and Junior Researcher at KInIT. Multilingual fact-checking with large language models, with a focus on low-resource languages.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ivan Vykopal',
    template: '%s | Ivan Vykopal',
  },
  description,
  openGraph: {
    title: 'Ivan Vykopal',
    description,
    url: SITE_URL,
    siteName: 'Ivan Vykopal',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Ivan Vykopal',
    card: 'summary_large_image',
  },
  verification: {
    google: 'eZSdmzAXlLkKhNJzfgwDqWORghxnJ8qR9_CHdAh5-xw',
    yandex: '14d2e73487fa6c71',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1014' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={clsx('bg-page text-ink', graphik.variable)}>
      <body className="mx-auto max-w-page px-5 pb-16 pt-8 font-sans text-base leading-[1.65] antialiased sm:px-10 sm:pt-12">
        <SiteHeader />
        <main className="mt-12 sm:mt-16">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
