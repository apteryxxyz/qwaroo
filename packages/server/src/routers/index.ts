import { createTRPCRouter } from '../services/trpc';
import { createRouter } from './create/router';
import { gamesRouter } from './games/router';
import { playRouter } from './play/router';
import { scoresRouter } from './scores/router';

export const appRouter = createTRPCRouter({
  create: createRouter,
  games: gamesRouter,
  play: playRouter,
  scores: scoresRouter,
});

export type AppRouter = typeof appRouter;
