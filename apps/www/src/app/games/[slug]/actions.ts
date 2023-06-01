'use server';

import { Game } from '@qwaroo/database';
import { z } from 'zod';
import { serverAction } from '@/utilities/serverAction';

export const getGame = serverAction({
    cacheTime: '20s',
    bodySchema: z.object({
        slug: z.string(),
        recommended: z.boolean().default(false),
    }),
})(async body => {
    const game = await Game.Model.findOne({ slug: body.slug }).exec();
    if (!game) return null;

    return {
        game: game.toJSON() as Game.Entity,
        recommended: [game, game, game, game].map(game => game.toJSON() as Game.Entity),
    } as const;
});
