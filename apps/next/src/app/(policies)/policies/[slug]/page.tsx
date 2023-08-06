import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allPolicies } from 'contentlayer/generated';
import { Mdx } from '@/components/mdx';
import type { PageProps } from '@/types';
import { formatDate } from '@/utilities/formatters';
import { absoluteUrl } from '@/utilities/url';

function getPolicyFromParams(p: PageProps<['slug']>) {
  const policy = allPolicies.find((policy) => policy.slug === p.params.slug);
  return policy ?? null;
}

export function generateStaticParams() {
  return allPolicies.map((policy) => ({ slug: policy.slug }));
}

export function generateMetadata(p: PageProps<['slug']>) {
  const policy = getPolicyFromParams(p);
  if (!policy) return { title: 'policy not found' };

  return {
    title: policy.title,

    openGraph: {
      type: 'article',
      siteName: 'Qwaroo',
      title: policy.title,
      locale: 'en',
      url: absoluteUrl(`/policys/${policy.slug}`),
    },

    twitter: {
      card: 'summary',
      creator: '@apteryxxyz',
      title: policy.title,
    },
  } satisfies Metadata;
}

export default function Page(p: PageProps<['slug']>) {
  const policy = getPolicyFromParams(p);
  if (!policy) notFound();

  return (
    <article className="container relative max-w-3xl space-y-4 py-6 lg:py-10">
      <div>
        <time
          dateTime={policy.updatedAt}
          className="block text-sm text-muted-foreground"
        >
          Updated on {formatDate(new Date(policy.updatedAt), 'full')}
        </time>

        <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
          {policy.title}
        </h1>
      </div>

      <Mdx code={policy.body.code} />
      <hr />
    </article>
  );
}
