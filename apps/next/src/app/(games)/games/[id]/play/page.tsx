import { appRouter } from '@qwaroo/server';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';
import type { PageProps } from '@/types';
import Content from './content';

export const dynamic = 'force-dynamic';

export default async function Page(p: PageProps<['id']>) {
  const id = p.params.id;
  const session = await getServerSession(authOptions);

  const caller = appRouter.createCaller({ me: session?.user });
  const game = await caller.games.getGame(id).catch(() => void notFound());
  const state = await caller.play.playGame(id);

  return <Content game={game!} state={state} />;
}
