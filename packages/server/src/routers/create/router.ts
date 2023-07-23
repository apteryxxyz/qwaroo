import { Game, User } from '@qwaroo/database';
import { env } from '@qwaroo/env/core';
import { sources } from '@qwaroo/sources';
import { GameCreateSchema } from '@qwaroo/validators';
import { TRPCError } from '@trpc/server';
import type { Observer } from '@trpc/server/observable';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';
import { bucket } from '@/services/bucket';
import { imgur } from '@/services/imgur';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/services/trpc';

export const createRouter = createTRPCRouter({
  /** Get all the public data sources. */
  getSources: publicProcedure.query(() =>
    Object.values(sources)
      .filter((source) => source.isPublic)
      .map((source) => source.toJSON()),
  ),

  /** Get a single data source by its slug. */
  getSource: publicProcedure.input(z.string()).query(({ input: slug }) => {
    const source = sources[slug as keyof typeof sources];
    if (source) return source.toJSON();
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Source was not found',
    });
  }),

  /** Validate the source properties. */
  validateProperties: publicProcedure
    .input(z.object({ slug: z.string().min(0), properties: z.record(z.any()) }))
    .query(async ({ input: { slug, properties } }) => {
      if (!(slug in sources))
        throw new Error(`No source was found for "${slug}".`);
      const source = sources[slug as keyof typeof sources];
      return source.validateProperties(properties).catch((error: Error) => {
        throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });
      });
    }),

  /** Create a new game, takes the game data and starts a websocket subscription. */
  createGame: protectedProcedure
    .input(GameCreateSchema)
    .subscription(({ input: payload, ctx: context }) => {
      const source = sources[payload.sourceSlug as keyof typeof sources];
      if (!source)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid source' });

      async function run(
        observer: Observer<
          {
            type: 'progress' | 'done';
            message: string;
          },
          TRPCError
        >,
      ) {
        const progress = (message: string) =>
          observer.next({ type: 'progress', message });

        // Validate that the source properties are, well, valid
        progress('Validating source properties');
        await source
          .validateProperties(payload.sourceProperties)
          .catch((reason: Error) => {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: reason.message,
            });
          });

        // Fetch the game data from the source
        progress('Getting data for your game');
        const itemsResult = await source
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
          .fetchItems(payload.sourceProperties as any)
          .catch((reason: Error) => {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: reason.message,
            });
          });

        // Upload the thumbnail to imgur
        progress("Saving the game's thumbnail image");
        await imgur
          .upload({
            type: 'stream',
            image: Buffer.from(payload.thumbnailBinary, 'binary'),
          })
          .then(({ data, success }) => {
            if (data.nsfw)
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Thumbnail image is not allowed',
              });
            if (!success)
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to save thumbnail image',
              });
            // Set the thumbnail URL to the imgur link
            // * thumbnailUrl is not a property of GameCreateSchema but is on GameSchema
            Reflect.set(payload, 'thumbnailUrl', data.link);
          });

        // TODO: Should probably ensure the user actually exists
        const userId = context?.me?.id;
        const user = (await User.Model.findById(userId))!;
        const game = new Game.Model({ creator: user, ...payload });

        // Save the game items to the bucket
        progress('Saving game items');
        const data = Buffer.from(JSON.stringify(itemsResult));
        const bucketResult = await bucket.createFile(user, data, {
          gameId: game.id as string,
        });
        if (!bucketResult) return;

        progress('Saving game');
        await game.save();

        observer.next({
          type: 'done',
          message: game.id as string,
        });
        observer.complete();
      }

      return observable((observer) => {
        void run(observer).catch((error: TRPCError | Error) => {
          if (error instanceof TRPCError) {
            observer.error(error);
          } else {
            observer.error(
              new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message:
                  env.NODE_ENV === 'development'
                    ? error.message
                    : 'Hidden in production',
              }),
            );
          }
        });

        // ? Do we want to return a teardown function?
      });
    }),
});
