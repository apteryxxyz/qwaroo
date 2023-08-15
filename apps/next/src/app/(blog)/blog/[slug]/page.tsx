import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';
import { Mdx } from '@/components/mdx';
import type { PageProps } from '@/types';
import { formatDate } from '@/utilities/formatters';
import { makeImageUrl } from '@/utilities/og';
import { absoluteUrl } from '@/utilities/url';

function getPostFromParams(p: PageProps<['slug']>) {
  const post = allPosts.find((post) => post.slug === p.params.slug);
  return post ?? null;
}

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata(p: PageProps<['slug']>) {
  const post = getPostFromParams(p);
  if (!post) return { title: 'Post not found' };

  const imageUrl = makeImageUrl({
    type: 'post',
    title: post.title,
    description: post.description,
  });

  return {
    title: { absolute: post.title },
    description: post.description,
    authors: post.authors.map((author) => ({
      name: author.name,
      url: absoluteUrl(`/users/${author.id}`),
    })),

    openGraph: {
      type: 'article',
      siteName: 'Qwaroo',
      title: post.title,
      description: post.description,
      locale: 'en',
      url: absoluteUrl(`/blog/${post.slug}`),
      images: [
        {
          url: imageUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      creator: '@apteryxxyz',
      title: post.title,
      description: post.description,
      images: [
        {
          url: imageUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },
  } satisfies Metadata;
}

export default function Page(p: PageProps<['slug']>) {
  const post = getPostFromParams(p);
  if (!post) notFound();

  return (
    <article className="container relative max-w-3xl space-y-4 py-6 lg:py-10">
      <div>
        {post.publishedAt && (
          <time
            dateTime={post.publishedAt}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(new Date(post.publishedAt), 'full')}
          </time>
        )}

        <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
          {post.title}
        </h1>

        {post.authors.length && (
          <div className="flex space-x-4">
            {post.authors.map((author) => (
              <a
                key={author._id}
                href={`https://github.com/${author.githubUsername}`}
                className="flex items-center space-x-2 text-sm"
              >
                <Image
                  src={`https://github.com/${author.githubUsername}.png`}
                  alt={author.name}
                  width={42}
                  height={42}
                  className="rounded-full bg-white"
                />

                <div className="flex-1 text-left leading-tight">
                  <p className="font-medium">{author.name}</p>
                  <p className="text-[12px] text-muted-foreground">
                    @{author.githubUsername}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {post.coverImage && (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={720}
          height={405}
          className="rounded-md"
          priority
        />
      )}

      <Mdx code={post.body.code} />
    </article>
  );
}
