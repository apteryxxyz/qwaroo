import { appRouter } from '@qwaroo/server';
import { notFound } from 'next/navigation';
import type { PageProps } from '@/types';
import Content from './content';

export default async function Page(p: PageProps<'id'>) {
  const id = p.params.id;

  const caller = appRouter.createCaller({});
  const game = await caller.games.getGame(id).catch(() => void notFound());
  const state = await caller.play.playGame(id);

  return <Content game={game!} state={state} />;
}
