'use server';

import { Game } from '@qwaroo/database';
import { createServerAction } from 'next-sa/server';
import { z } from 'zod';

export const getGame = createServerAction()
    .input(z.object({ slug: z.string(), recommended: z.boolean() }))
    .cache({ max: 100, ttl: '20m' })
    .definition(async body => {
        const game = await Game.Model.findOne({ slug: body.slug }).exec();
        if (!game) throw new Error('Game not found');

        return {
            game: game.toJSON() as Game.Entity,
            recommended: [game, game, game, game].map(game => game.toJSON() as Game.Entity),
        } as const;
    });
