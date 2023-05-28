'use server';

import { Game } from '@qwaroo/database';
import { isValidObjectId } from 'mongoose';
import { zact } from 'zact/server';
import { z } from 'zod';

export const getGames = zact(
    z.object({
        query: z.string().optional(),

        skip: z.number().default(0),
        limit: z.number().default(12),

        ids: z.array(z.string().refine(isValidObjectId)).optional(),
        categories: z.array(z.string()).optional(),
    })
)(async options => {
    const query = Game.Model.find({
        flags: { $bitsAllSet: Game.Flag.Public },
    });

    if (options.ids) void query.where('_id').in(options.ids);
    if (options.categories) void query.where('categories').in(options.categories);

    const total = await Game.Model.countDocuments(query.getFilter());
    const games = await query.limit(options.limit).skip(options.skip).exec();

    return [
        { total, limit: options.limit, skip: options.skip },
        games.map(game => game.toJSON() as Game.Entity),
    ] as const;
});
