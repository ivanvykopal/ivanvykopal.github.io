import type { Metadata } from 'next';
import Link from 'next/link';
import { allBlogs } from 'contentlayer/generated';
import { DatedRow, PageTitle } from 'app/components/section';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Plain-language write-ups of my research on fact-checking, disinformation and large language models.',
};

export default function BlogPage() {
  const posts = [...allBlogs].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  return (
    <>
      <PageTitle intro={<p>Plain-language write-ups of our papers and what we learned from them.</p>}>Blog</PageTitle>
      <ol className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <DatedRow
              date={new Date(post.publishedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <h2 className="font-semibold leading-6 text-ink transition-colors group-hover:text-accent">{post.title}</h2>
                <p className="mt-1 text-[0.9375rem] text-ink-2">{post.summary}</p>
              </Link>
            </DatedRow>
          </li>
        ))}
      </ol>
    </>
  );
}
