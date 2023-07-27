import type { User } from '@qwaroo/database';
import { Activity, Game } from '@qwaroo/database';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/services/trpc';

export const activitiesRouter = createTRPCRouter({
  /** Get the scores of a game. */
  getActivities: publicProcedure
    .input(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .query(async ({ input: gameId }) => {
      const game = await Game.Model.findById(gameId);
      if (!game)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Game was not found',
        });

      const activities = await Activity.Model.find({ game })
        .populate<{ user: User.Document }>('user')
        .sort({ highScore: -1 })
        .limit(10);

      return activities.map((score) => score.toJSON<Activity.Entity<'user'>>());
    }),

  getActivity: protectedProcedure
    .input(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .query(async ({ input: gameId, ctx: context }) => {
      const game = await Game.Model.findById(gameId);
      if (!game)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Game was not found',
        });

      const activity = await Activity.Model.findOne({
        user: context.me!.id,
        game: gameId,
      });
      if (activity) return activity.toJSON<Activity.Entity>();
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Activity was not found',
      });
    }),
});
