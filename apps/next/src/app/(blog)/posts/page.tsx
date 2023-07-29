import Image from 'next/image';
import Link from 'next/link';
import { allPosts } from 'contentlayer/generated';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/utilities/formatters';

export default function Page() {
  const posts = allPosts.sort((a, b) => {
    return (
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );
  });

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block text-4xl font-bold tracking-tight lg:text-5xl">
            Qwaroo Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Stay up to date with the latest news and updates.
          </p>
        </div>
      </div>
      <hr className="my-8" />

      <div className="grid gap-10 md:grid-cols-2">
        {posts.map((post, index) => (
          <Card key={post._id} className="relative">
            {post.coverImage && (
              <Image
                src={post.coverImage}
                alt={post.title}
                width={804}
                height={452}
                className="rounded-md border bg-muted transition-colors"
                priority={index <= 1}
              />
            )}

            <Card.Header>
              <Card.Title>{post.title}</Card.Title>

              <Card.Description>
                {post.description}
                <time dateTime={post.publishedAt} className="block">
                  {formatDate(new Date(post.publishedAt), 'full')}
                </time>
              </Card.Description>

              <Link href={`/posts/${post.slug}`} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </Card.Header>
          </Card>
        ))}
      </div>
    </div>
  );
}
