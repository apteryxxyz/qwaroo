import { ServerError as Error, Validate, createRegExp } from '@owenii/common';
import { Game, type GameDocument, type UserDocument } from '@owenii/database';
import { loadItems } from '@owenii/sources';
import type { FetchGamesOptions } from '@owenii/types';
import { shuffle } from 'shuffle-seed';

export class Games extends null {
    /** Get a list of all the game categories. */
    public static async getCategories(user?: UserDocument) {
        const obj = user ? { creatorId: user.id } : {};
        const games = await Game.find(obj).exec();
        const categories = games.flatMap(game => game.categories ?? []);
        return Array.from(new Set(categories));
    }

    /** Get a single game by its ID. */
    public static async getGameById(
        user: UserDocument | undefined,
        id: string
    ) {
        const isValidId = Validate.ObjectId.test(id);
        if (!isValidId) throw new Error(422, 'Game ID is invalid');

        let query = Game.findById(id);
        if (user) query = query.where({ creatorId: user.id });
        const game = await query.exec();
        if (!game) throw new Error(404, 'Game was not found');

        return game;
    }

    /** Get a single game by its slug. */
    public static async getGameBySlug(
        user: UserDocument | undefined,
        slug: string
    ) {
        const isValidSlug = Validate.Slug.test(slug);
        if (!isValidSlug) throw new Error(422, 'Game slug is invalid');

        let query = Game.findOne({ slug });
        if (user) query = query.where({ creatorId: user.id });
        const game = await query.exec();
        if (!game) throw new Error(404, 'Game was not found');

        return game;
    }

    /** Get a list of all games. */
    public static async getGames(
        user?: UserDocument,
        options: FetchGamesOptions = {}
    ) {
        const { term, limit = 20, skip = 0 } = options;
        if (term && term.length < 1)
            throw new Error(422, 'Search term must be at least 1 character');
        if (typeof limit !== 'number' || Number.isNaN(limit))
            throw new Error(422, 'Limit must be a number');
        if (limit < 1) throw new Error(422, 'Limit must be greater than 0');
        if (typeof skip !== 'number' || Number.isNaN(skip))
            throw new Error(422, 'Skip must be a number');
        if (skip < 0) throw new Error(422, 'Skip must be greater than 0');

        // TODO: Add popular sort
        const sorts = [
            'totalScore',
            'totalTime',
            'totalPlays',
            'lastPlayedTimestamp',
            'createdTimestamp',
            'updatedTimestamp',
        ];
        const { sort = 'totalPlays', order = 'desc' } = options;
        if (!sorts.includes(sort))
            throw new Error(422, `Sort must be one of "${sorts.join('", "')}"`);
        if (order !== 'asc' && order !== 'desc')
            throw new Error(422, 'Order must be "asc" or "desc"');

        const { ids, categories, modes } = options;
        if (ids && !Array.isArray(ids))
            throw new Error(422, 'IDs must be an array of strings');
        if (categories && !Array.isArray(categories))
            throw new Error(422, 'Categories must be an array of strings');
        if (modes && !Array.isArray(modes))
            throw new Error(422, 'Modes must be an array of strings');

        let query = Game.find();

        if (term) {
            const title = createRegExp(term, false, 'i');
            query = query.where({ title });
        }

        if (sort && order) {
            const direction = order === 'asc' ? 1 : -1;
            query = query.sort({ [sort]: direction });
        }

        if (user) query = query.where({ creatorId: user.id });
        if (categories?.length)
            query = query.where({ categories: { $all: categories } });
        if (ids?.length)
            query = query.where({
                $or: [{ _id: { $in: ids } }, { slug: { $in: ids } }],
            });
        if (modes?.length) query = query.where({ mode: { $in: modes } });

        const total = await Game.find().merge(query).countDocuments().exec();
        const games = await query.limit(limit).skip(skip).exec();

        return [{ total, limit, skip }, games] as const;
    }

    /** Get a list of all the items within a game. */
    public static async getGameItems(
        game: GameDocument,
        seed: string,
        limit = 5,
        skip = 0
    ) {
        if (typeof limit !== 'number' || Number.isNaN(limit))
            throw new Error(422, 'Limit must be a number');
        if (limit < 1) throw new Error(422, 'Limit must be greater than 0');

        if (typeof skip !== 'number' || Number.isNaN(skip))
            throw new Error(422, 'Skip must be a number');
        if (skip < 0) throw new Error(422, 'Skip must be greater than 0');

        const list = shuffle(loadItems(game.slug), seed);
        const total = list.length;
        const items = list.slice(skip, skip + limit);

        return [{ total, seed, limit, skip }, items] as const;
    }
}

export interface GameSearchOptions {
    term?: string;
    limit?: number;
    skip?: number;
}
