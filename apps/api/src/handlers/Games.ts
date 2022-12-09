import { Games as Modes } from '@owenii/games';
import type { Game } from '@owenii/types';
import { Validate } from '@owenii/validators';
import fuzzysort = require('fuzzysort');
import { shuffle } from 'shuffle-seed';
import { APIError } from '#/utilities/APIError';

const games = new Modes();

export class Games extends null {
    /** Get a filtered list of game categories. */
    public static getCategories() {
        const metas = games.getGames().map(game => game.meta);
        const categories = metas.flatMap(meta => meta?.categories ?? []);
        return Array.from(new Set(categories));
    }

    /** Get a paginated list of games. */
    public static async getPaginatedGames(term: string, page = 1) {
        if (typeof page !== 'number' || Number.isNaN(page))
            throw new APIError(422, 'Page must be a number');
        if (page < 1) throw new APIError(422, 'Page must be greater than 0');

        const items = games
            .getGames()
            .map(game => game.meta)
            .filter(Boolean) as Game.Meta<Game.Type>[];
        const filteredGames = term
            ? fuzzysort.go(term, items, { key: 'name' })
            : items;

        const total = filteredGames.length;
        const pageCount = Math.ceil(total / 25);
        const previousPage = page > 1 ? page - 1 : null;
        const nextPage = page < pageCount ? page + 1 : null;
        const currentItems = filteredGames.slice((page - 1) * 25, page * 25);

        return {
            previousPage,
            currentPage: page,
            nextPage,
            pageCount,
            itemCount: total,
            items: currentItems,
        };
    }

    /** Get the meta information for a game. */
    public static getGameMeta(slug: string) {
        const isValidSlug = Validate.Slug.test(slug);
        if (!isValidSlug) throw new APIError(422, 'Game slug is not valid');

        const game = games.getGames().find(game => game.slug === slug);
        if (!game) throw new APIError(404, 'Game does not exist');

        return game.getMeta(games.basePath);
    }

    /** Get a paginated list of all the items for a game, shuffled with a seed. */
    public static async getPaginatedGameItems(
        slug: string,
        seed: string,
        page = 1
    ) {
        const isValidSlug = Validate.Slug.test(slug);
        if (!isValidSlug) throw new APIError(422, 'Game slug is not valid');

        if (typeof seed !== 'string')
            throw new APIError(422, 'Seed must be a string');

        if (typeof page !== 'number' || Number.isNaN(page))
            throw new APIError(422, 'Page must be a number');
        if (page < 1) throw new APIError(422, 'Page must be greater than 0');

        const game = games.getGames().find(game => game.slug === slug);
        if (!game) throw new APIError(404, 'Game does not exist');

        const items = await game.getItems(games.basePath);
        const shuffledItems = shuffle(items, seed);

        const total = shuffledItems.length;
        const pageCount = Math.ceil(total / 10);
        const previousPage = page > 1 ? page - 1 : null;
        const nextPage = page < pageCount ? page + 1 : null;
        const currentItems = shuffledItems.slice((page - 1) * 10, page * 10);

        return {
            previousPage,
            currentPage: page,
            nextPage,
            pageCount,
            itemCount: total,
            items: currentItems,
        };
    }
}
