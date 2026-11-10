import { allBlogs } from 'contentlayer/generated';
import { SITE_URL } from './data/profile';

export const dynamic = 'force-static';

export default async function sitemap() {
  const blogs = allBlogs.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt,
  }));

  const routes = ['', '/research', '/cv', '/projects', '/study-materials', '/blog'].map(
    (route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date().toISOString().split('T')[0],
    })
  );

  return [...routes, ...blogs];
}
