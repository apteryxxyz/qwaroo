import { Game } from '@owenii/database';
import { createRegExp } from '@owenii/validators';
import { APIError } from '#/utilities/APIError';

export class Games extends null {
    /** Get an existing user by their ID. */
    public static async getCategories() {
        const games = await Game.find({}).exec();
        const categories = games.flatMap(game => game.categories ?? []);
        return Array.from(new Set(categories));
    }

    /** Get a list of users using pages. */
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
