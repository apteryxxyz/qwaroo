import { Game } from '@owenii/database';
import { ServerError as Error } from '@owenii/errors';
import { Validate, createRegExp } from '@owenii/validators';

export class Games extends null {
    /** Get a list of all the game categories. */
    public static async getCategories() {
        const games = await Game.find({}).exec();
        const categories = games.flatMap(game => game.categories ?? []);
        return Array.from(new Set(categories));
    }

    /** Get a single game by its ID. */
    public static async getGameById(id: string) {
        const isValidId = Validate.ObjectId.test(id);
        if (!isValidId) throw new Error(422, 'Game ID is invalid');

        const game = await Game.findById(id).exec();
        if (!game) throw new Error(404, 'Game was not found');

        return game;
    }

    /** Get a single game by its slug. */
    public static async getGameBySlug(slug: string) {
        const isValidSlug = Validate.Slug.test(slug);
        if (!isValidSlug) throw new Error(422, 'Game slug is invalid');

        const game = await Game.findOne({ slug }).exec();
        if (!game) throw new Error(404, 'Game was not found');

        return game;
    }

    /** Get a list of all games. */
    public static async getGames(term?: string, limit = 100, skip = 0) {
        if (term && term.length < 1)
            throw new Error(422, 'Search term must be at least 1 character');

        if (typeof limit !== 'number' || Number.isNaN(limit))
            throw new Error(422, 'Limit must be a number');
        if (limit < 1) throw new Error(422, 'Limit must be greater than 0');

        if (typeof skip !== 'number' || Number.isNaN(skip))
            throw new Error(422, 'Skip must be a number');
        if (skip < 0) throw new Error(422, 'Skip must be greater than 0');

        const query = term
            ? Game.where('title').regex(createRegExp(term ?? '', false, 'i'))
            : Game.find({});

        const total = await query.countDocuments().exec();
        const games = await Game.find()
            .merge(query)
            .limit(limit)
            .skip(skip)
            .exec();

        return [{ total, limit, skip }, games] as const;
    }
}
