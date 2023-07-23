import { appRouter } from '@qwaroo/server';
import { redirect } from 'next/navigation';
import type { PageProps } from '@/types';
import Content from './content';

export default async function Page(p: PageProps<undefined, 'source'>) {
  const caller = appRouter.createCaller({});
  const sources = await caller.create.getSources();

  const source = sources.find((s) => s.slug === p.searchParams.source);
  if (!source) redirect('/games/create');

  return <Content source={source} />;
}
