'use server';

import { Game } from '@qwaroo/database';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';
import { serverAction } from '@/utilities/serverAction';

export const getGames = serverAction({
    cacheTime: '20s',
    bodySchema: z.object({
        query: z.string().optional(),

        skip: z.number().optional().default(0),
        limit: z.number().optional().default(12),

        ids: z.array(z.string().refine(isValidObjectId)).optional(),
        categories: z.array(z.string()).optional(),
    }),
})(async body => {
    const query = Game.Model.find();

    if (body.ids) void query.where('_id').in(body.ids);
    if (body.categories) void query.where('categories').in(body.categories);

    if (body.query)
        void query.where({
            $text: {
                $search: body.query,
                $caseSensitive: false,
                $diacriticSensitive: false,
            },
        });

    const total = await Game.Model.countDocuments(query.getFilter());
    const games = await query.limit(body.limit).skip(body.skip).exec();

    return [
        { total, limit: body.limit, skip: body.skip },
        games.map(game => game.toJSON() as Game.Entity),
    ] as const;
});
