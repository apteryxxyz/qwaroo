'use server';

import { Game } from '@qwaroo/database';
import { zact } from 'zact/server';
import { z } from 'zod';

export const getGame = zact(
    z.object({
        slug: z.string(),
        recommended: z.boolean().default(false),
    })
)(async ({ slug }) => {
    const game = await Game.Model.findOne({ slug }).exec();
    if (!game) return null;

    // const recommended = await Game.Model.find({
    //     _id: { $ne: game._id },
    //     categories: { $in: game.categories },
    // }).exec();

    return {
        game: game.toJSON() as Game.Entity,
        recommended: [game, game, game, game].map(game => game.toJSON() as Game.Entity),
    };
});
