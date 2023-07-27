import { appRouter } from '@qwaroo/server';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';
import type { PageProps } from '@/types';
import { Content } from './content';

export default async function Page(p: PageProps<'id'>) {
  const gameId = p.params.id;

  const session = await getServerSession(authOptions);
  const caller = appRouter.createCaller({ me: session?.user });

  const game = await caller.games.getGame(gameId).catch(() => notFound());
  const similarGames = await caller.games.getSimilarGames(gameId);

  const userActivity =
    (session?.user &&
      (await caller.activities.getActivity(gameId).catch(() => null))) ??
    null;
  const gameActivities = await caller.activities.getActivities(gameId);

  return (
    <Content
      game={game}
      similarGames={similarGames}
      userActivity={userActivity}
      gameActivities={gameActivities}
    />
  );
}
