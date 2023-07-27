import { Activity, Game } from '@qwaroo/database';
import type { Source } from '@qwaroo/sources';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { redis } from '@/services/redis';
import { createTRPCRouter, publicProcedure } from '@/services/trpc';
import type { State } from './utilities';
import {
  getGameItems,
  omitValue,
  saveScore,
  shuffleWithSeed,
} from './utilities';

export const playRouter = createTRPCRouter({
  /** Begin playing a game on Qwaroo. */
  playGame: publicProcedure
    .input(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .query(async ({ input: gameId, ctx: context }) => {
      const game = await Game.Model.findById(gameId);
      if (!game)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Game was not found',
        });

      // Ref is a unique identifier for the game session
      const ref = uuid();

      const items = await getGameItems(gameId);
      const shuffledItems = shuffleWithSeed(items, ref);
      const [previousItem, currentItem, ...nextItems] = //
        shuffledItems.slice(0, 7);

      await redis.set(
        `play:${ref}`,
        JSON.stringify({
          gameId: gameId,
          startTime: Date.now(),
          itemValues: [previousItem, currentItem, ...nextItems] //
            .map(({ value }) => value),
          stepsTaken: [],
        } satisfies State),
        { ex: 3600 },
      );

      let highScore;
      if (context.me) {
        const activity = await Activity.Model.findOne({ user: context.me.id });
        if (activity) highScore = activity.score.highScore;
      }

      return {
        ref,
        items: [
          previousItem,
          ...[currentItem, ...nextItems].map(omitValue),
        ] as const,
        highScore,
      };
    }),

  /** A subscription that when closed, saves the game score. */
  beginWatcher: publicProcedure
    .input(z.string().uuid())
    .subscription(({ input: ref, ctx: context }) =>
      observable(
        () => () =>
          (async () => {
            const state = await redis.get<State>(`play:${ref}`);
            // No state indicates that the game has already been saved
            if (!state) return;

            void redis.del(`play:${ref}`);
            void saveScore(state, context.me?.id);
          })(),
      ),
    ),

  /** Prematurely end a game. */
  endGame: publicProcedure
    .input(z.string().uuid())
    .mutation(async ({ input: ref, ctx: context }) => {
      const state = await redis.get<State>(`play:${ref}`);
      if (!state)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Play state was not found',
        });

      void redis.del(`play:${ref}`);
      void saveScore(state, context.me?.id);
    }),

  /** Make a guess within an active play session. */
  makeGuess: publicProcedure
    .input(
      z.object({
        ref: z.string().uuid(),
        direction: z.union([z.literal(-1), z.literal(1)]),
      }),
    )
    .mutation(async ({ input: { ref, direction }, ctx: context }) => {
      const state = await redis.get<State>(`play:${ref}`);
      if (!state)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Play state was not found',
        });

      const { gameId, itemValues, stepsTaken } = state;

      const previousValue = itemValues.at(stepsTaken.length) ?? 0;
      const currentValue = itemValues.at(stepsTaken.length + 1) ?? 0;
      const correctDirection =
        Math.sign(currentValue - previousValue) || direction;
      const isCorrect = correctDirection === direction;

      if (isCorrect) {
        let additionalItems: Source.Item[] = [];
        if (stepsTaken.length + 1 === itemValues.length - 1) {
          // We only add additional items every 5th step
          // Prevents making too many requests to the database
          // TODO: Can be improved by storing the file hash in the state
          const items = await getGameItems(gameId);
          const shuffledItems = shuffleWithSeed(items, ref);
          additionalItems = shuffledItems.slice(0, 5);
        }

        // Update the game state
        await redis.set(
          `play:${ref}`,
          JSON.stringify({
            ...state,
            itemValues: [
              ...itemValues,
              ...additionalItems.map(({ value }) => value),
            ],
            stepsTaken: [...stepsTaken, direction],
          } satisfies State),
          { ex: 3600 },
        );

        return {
          isCorrect: true,
          currentValue,
          nextItems: additionalItems.map(omitValue),
        };
      } else {
        void redis.del(`play:${ref}`);

        void saveScore(state, context.me?.id);

        return {
          isCorrect: false,
          currentValue,
          score: stepsTaken.length,
        };
      }
    }),
});
