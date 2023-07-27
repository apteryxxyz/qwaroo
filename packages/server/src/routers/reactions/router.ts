import { Activity, Game } from '@qwaroo/database';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/services/trpc';

export const reactionsRouter = createTRPCRouter({
  chooseRating: protectedProcedure
    .input(
      z.object({
        gameId: z.string().regex(/^[0-9a-fA-F]{24}$/),
        direction: z.number().min(-1).max(1),
      }),
    )
    .mutation(async ({ input: { gameId, direction }, ctx: context }) => {
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
      if (!activity) return false;

      const oldRating = activity.reaction.rating;
      if (oldRating === direction) return true;

      switch (direction) {
        case 1: {
          activity.reaction.rating = 1;
          game.engagement.likeCount++;
          if (oldRating === -1) game.engagement.dislikeCount--;
          break;
        }

        case -1: {
          activity.reaction.rating = -1;
          game.engagement.dislikeCount++;
          if (oldRating === 1) game.engagement.likeCount--;
          break;
        }

        case 0: {
          activity.reaction.rating = 0;
          if (oldRating === 1) game.engagement.likeCount--;
          if (oldRating === -1) game.engagement.dislikeCount--;
          break;
        }

        default: {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid direction',
          });
        }
      }

      await Promise.all([activity.save(), game.save()]);
      return true;
    }),

  chooseFavourite: protectedProcedure
    .input(
      z.object({
        gameId: z.string().regex(/^[0-9a-fA-F]{24}$/),
        favourited: z.boolean(),
      }),
    )
    .mutation(async ({ input: { gameId, favourited }, ctx: context }) => {
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
      if (!activity) return false;

      const oldFavourited = activity.reaction.favourited;
      if (oldFavourited === favourited) return true;

      if (favourited) {
        activity.reaction.favourited = true;
        game.engagement.favouriteCount++;
      } else {
        activity.reaction.favourited = false;
        game.engagement.favouriteCount--;
      }

      await Promise.all([activity.save(), game.save()]);
      return true;
    }),
});
