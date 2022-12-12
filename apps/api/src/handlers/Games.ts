import { Game } from '@owenii/database';
import { Validate, createRegExp } from '@owenii/validators';
import { APIError } from '#/utilities/APIError';

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
        if (!isValidId) throw new APIError(422, 'Game ID is invalid');

        const game = await Game.findById(id).exec();
        if (!game) throw new APIError(404, 'Game was not found');

        return game;
    }

    /** Get a single game by its slug. */
    public static async getGameBySlug(slug: string) {
        const isValidSlug = Validate.Slug.test(slug);
        if (!isValidSlug) throw new APIError(422, 'Game slug is invalid');

        const game = await Game.findOne({ slug }).exec();
        if (!game) throw new APIError(404, 'Game was not found');

        return game;
    }

    /** Get a list of games using pages. */
    public static async getPaginatedGames(term?: string, page = 1) {
        if (typeof page !== 'number' || Number.isNaN(page))
            throw new APIError(422, 'Page must be a number');
        if (page < 1) throw new APIError(422, 'Page must be greater than 0');

        const query = Game.find(
            term ? { title: createRegExp(term, false, 'i') } : {}
        );
        const total = await query.countDocuments().exec();
        const users = await Game.find()
            .merge(query)
            .skip((page - 1) * 20)
            .limit(20)
            .exec();

        const pageCount = Math.ceil(total / 20);
        const previousPage = page > 1 ? page - 1 : null;
        const nextPage = page < pageCount ? page + 1 : null;

        return {
            previousPage,
            currentPage: page,
            nextPage,
            pageCount,
            itemCount: total,
            items: users,
        };
    }
}
