import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';
import { Mdx } from '@/components/mdx';
import type { PageProps } from '@/types';
import { formatDate } from '@/utilities/formatters';

function getPostFromParams(p: PageProps<'slug'>) {
  const post = allPosts.find((post) => post.slug === p.params.slug);
  return post ?? null;
}

export default function Page(p: PageProps<'slug'>) {
  const post = getPostFromParams(p);
  if (!post) notFound();

  return (
    <article>
      <div className="mb-8">
        {post.publishedAt && (
          <time
            dateTime={post.publishedAt}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(new Date(post.publishedAt))}
          </time>
        )}

        <h1 className="font-heading mt-2 inline-block text-4xl font-bold leading-tight lg:text-5xl">
          {post.title}
        </h1>

        <Link
          href="https://github.com/apteryxxyz"
          className="flex items-center space-x-2 text-sm"
        >
          <Image
            src="https://github.com/apteryxxyz.png"
            alt="apteryxxyz"
            width={42}
            height={42}
            className="rounded-full bg-white"
          />

          <div className="flex-1 text-left leading-tight">
            <p className="font-medium">Apteryx</p>
            <p className="text-[12px] text-muted-foreground">@apteryxxyz</p>
          </div>
        </Link>
      </div>

      {post.coverImage && (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={720}
          height={405}
          className="mb-8 rounded-md border bg-muted transition-colors"
          priority
        />
      )}

      <Mdx code={post.body.code} />
      <hr className="mt-8" />
    </article>
  );
}
