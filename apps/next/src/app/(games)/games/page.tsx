import { appRouter } from '@qwaroo/server';
import Content from './content';
import '@qwaroo/database/connect';

export const metadata = {
  title: 'Games',
  description:
    'Browse the many games of Higher or Lower we have to offer, or create your own and share it with your friends!',
};

export default async function Page() {
  const caller = appRouter.createCaller({});
  const { total, games } = await caller.games.getGames({});
  return <Content total={total} games={games} />;
}

Reflect.set(Page, 'fullScreen', true);
