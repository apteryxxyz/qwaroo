import type { User } from '@qwaroo/database';
import { Game, Score } from '@qwaroo/database';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/services/trpc';

export const scoresRouter = createTRPCRouter({
  /** Get the scores of a game. */
  getGameScores: publicProcedure
    .input(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .query(async ({ input: id }) => {
      const game = await Game.Model.findById(id);
      if (!game)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Game was not found',
        });

      const scores = await Score.Model.find({ game })
        .populate<{ user: User.Document }>('user')
        .sort({ highScore: -1 })
        .limit(10);

      return scores.map((score) => score.toJSON<Score.Entity<'user'>>());
    }),
});
