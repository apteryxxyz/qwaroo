import type { User } from '@qwaroo/database';
import { Game } from '@qwaroo/database';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/services/trpc';

export const gamesRouter = createTRPCRouter({
  /** Get a game by its ID. */
  getGame: publicProcedure
    .input(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .query(async ({ input: id }) => {
      const game = await Game.Model.findById(id).populate<{
        creator: User.Document;
      }>('creator');

      if (game) return game.toJSON<Game.Entity<'creator'>>();
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Game was not found',
      });
    }),

  /** From a game, get similar ones to it. */
  getSimilarGames: publicProcedure
    .input(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .query(async ({ input: id }) => {
      const game = await Game.Model.findById(id).populate<{
        creator: User.Document;
      }>('creator');
      if (!game)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Game was not found',
        });

      const games = await Game.Model.find({
        _id: { $ne: game._id },
        $text: { $search: game.title },
      })
        .populate<{ creator: User.Document }>('creator')
        .limit(5)
        .exec();

      return games.map((game) => game.toJSON<Game.Entity<'creator'>>());
    }),

  /** Get a list of all games on Qwaroo, paginated. */
  getGames: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(25),
        cursor: z.number().min(0).default(0),
      }),
    )
    .query(async ({ input: { limit, cursor, search } }) => {
      const query = Game.Model.find().populate<{ creator: User.Document }>(
        'creator',
      );

      if (search) void query.where({ $text: { $search: search } });

      const total = await Game.Model.countDocuments(query.getFilter());
      const games = await query.skip(cursor).limit(limit).exec();

      return {
        total,
        games: games.map((game) => game.toJSON<Game.Entity<'creator'>>()),
      };
    }),
});
