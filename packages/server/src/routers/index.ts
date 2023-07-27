import { createTRPCRouter } from '../services/trpc';
import { activitiesRouter } from './activities/router';
import { createRouter } from './create/router';
import { gamesRouter } from './games/router';
import { playRouter } from './play/router';
import { reactionsRouter } from './reactions/router';

export const appRouter = createTRPCRouter({
  create: createRouter,
  games: gamesRouter,
  play: playRouter,
  activities: activitiesRouter,
  reactions: reactionsRouter,
});

export type AppRouter = typeof appRouter;
