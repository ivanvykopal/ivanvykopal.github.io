import { SITE_URL } from './data/profile';

export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [{ userAgent: '*' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
