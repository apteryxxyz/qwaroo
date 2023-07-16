'use server';

import { Game } from '@qwaroo/database';
import { createServerAction } from 'next-sa/server';

export const GET_game = createServerAction()
    .input(z => z.object({ id: z.string(), recommended: z.boolean() }))
    .cache({ max: 100, ttl: '20m' })
    .definition(async body => {
        const game = await Game.Model.findById(body.id).exec();
        if (!game) return null;

        return {
            game: game.toJSON<Game.Entity>(),
            recommended: [game, game, game, game].map(game => game.toJSON<Game.Entity>()),
        } as const;
    });
