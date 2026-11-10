import type { Metadata } from 'next';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi2';
import { notFound } from 'next/navigation';
import { Mdx } from 'app/components/mdx';
import { allBlogs } from 'contentlayer/generated';
import Balancer from 'react-wrap-balancer';

export async function generateMetadata({ params }): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = allBlogs.find((p) => p.slug === slug);
  if (!post) {
    return;
  }

  const { title, publishedAt: publishedTime, summary: description, image } = post;
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `/blog/${slug}`,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}

export async function generateStaticParams() {
  return allBlogs.map((post) => ({ slug: post.slug }));
}

export default async function Blog({ params }) {
  const { slug } = await params;
  const post = allBlogs.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const date = new Date(post.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.structuredData).replace(/</g, '\\u003c') }}
      />
      <Link href="/blog" className="no-print inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent">
        <HiArrowLeft aria-hidden className="h-3.5 w-3.5" />
        All posts
      </Link>
      <h1 className="mt-4 max-w-[38rem] text-[1.75rem] font-semibold leading-tight tracking-tight text-ink">
        <Balancer>{post.title}</Balancer>
      </h1>
      <p className="tabular mt-3 text-sm text-muted">
        <time dateTime={post.publishedAt}>{date}</time>
      </p>
      <Mdx code={post.body.code} />
    </article>
  );
}
