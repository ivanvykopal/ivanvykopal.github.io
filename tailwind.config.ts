import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-graphik)', 'system-ui', 'sans-serif'],
      },
      colors: {
        page: token('page'),
        subtle: token('subtle'),
        ink: token('ink'),
        'ink-2': token('ink-2'),
        muted: token('muted'),
        rule: token('rule'),
        accent: token('accent'),
        'accent-strong': token('accent-strong'),
      },
      maxWidth: {
        page: '62rem',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--ink-2))',
            '--tw-prose-headings': 'rgb(var(--ink))',
            '--tw-prose-lead': 'rgb(var(--ink-2))',
            '--tw-prose-links': 'rgb(var(--accent))',
            '--tw-prose-bold': 'rgb(var(--ink))',
            '--tw-prose-counters': 'rgb(var(--muted))',
            '--tw-prose-bullets': 'rgb(var(--muted))',
            '--tw-prose-hr': 'rgb(var(--rule))',
            '--tw-prose-quotes': 'rgb(var(--ink))',
            '--tw-prose-quote-borders': 'rgb(var(--rule))',
            '--tw-prose-captions': 'rgb(var(--muted))',
            '--tw-prose-code': 'rgb(var(--ink))',
            '--tw-prose-th-borders': 'rgb(var(--rule))',
            '--tw-prose-td-borders': 'rgb(var(--rule))',
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:first-of-type::after': { content: 'none' },
            a: { fontWeight: '400', textUnderlineOffset: '0.2em' },
            'h2, h3': { fontWeight: '600', letterSpacing: '-0.01em' },
          },
        },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography],
} satisfies Config;
