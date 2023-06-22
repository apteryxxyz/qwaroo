'use server';

import { Game } from '@qwaroo/database';
import { isValidObjectId } from 'mongoose';
import { createServerAction } from 'next-sa/server';

export const getGames = createServerAction()
    .input(z =>
        z.object({
            query: z.string().optional(),

            skip: z.number().optional().default(0),
            limit: z.number().optional().default(12),

            ids: z.array(z.string().refine(isValidObjectId)).optional(),
            categories: z.array(z.string()).optional(),
        })
    )
    .cache({ max: 100, ttl: '20m' })
    .definition(async input => {
        const query = Game.Model.find();

        if (input.ids) void query.where('_id').in(input.ids);
        if (input.categories) void query.where('categories').in(input.categories);

        if (input.query)
            void query.where({
                $text: {
                    $search: input.query,
                    $caseSensitive: false,
                    $diacriticSensitive: false,
                },
            });

        const total = await Game.Model.countDocuments(query.getFilter());
        const games = await query.limit(input.limit).skip(input.skip).exec();

        return [
            { total, limit: input.limit, skip: input.skip },
            games.map(game => game.toJSON() as Game.Entity),
        ] as const;
    });
