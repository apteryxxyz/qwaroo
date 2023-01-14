import { ServerError as Error, Validate, createRegExp } from '@qwaroo/common';
import { Game, type GameDocument, type UserDocument } from '@qwaroo/database';
import { loadItems } from '@qwaroo/sources';
import { type FetchGamesOptions, Game as GameEntity } from '@qwaroo/types';
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

        const game = await Game.findById(id).exec();
        if (
            !game ||
            ((game.publicFlags & GameEntity.Flags.Approved) !== 0 &&
                user &&
                user.id !== game.creatorId)
        )
            throw new Error(404, 'Game was not found');

        return game;
    }

    /** Get a single game by its slug. */
    public static async getGameBySlug(
        user: UserDocument | undefined,
        slug: string
    ) {
        const isValidSlug = Validate.Slug.test(slug);
        if (!isValidSlug) throw new Error(422, 'Game slug is invalid');

        const game = await Game.findOne({ slug }).exec();
        if (
            !game ||
            ((game.publicFlags & GameEntity.Flags.Approved) !== 0 &&
                user &&
                user.id !== game.creatorId)
        )
            throw new Error(404, 'Game was not found');

        return game;
    }

    /** Get a list of all games. */
    public static async getGames(
        me?: UserDocument,
        user?: UserDocument,
        options: FetchGamesOptions = {}
    ) {
        let query = Game.find();

        if (user) query = query.where({ creatorId: user.id });

        if (!me || !user || me.id !== user.id)
            query = query.where('publicFlags', {
                $bitsAllSet: GameEntity.Flags.Approved,
            });

        const term = String(options.term ?? '').trim();
        if (term.length > 0) {
            const regex = createRegExp(term, false, 'i');
            query = query.where({
                $or: [
                    { title: { $regex: regex } },
                    { slug: { $regex: regex } },
                    { shortDescription: { $regex: regex } },
                    { longDescription: { $regex: regex } },
                    { categories: { $regex: regex } },
                ],
            });
        }

        const sort = String(options.sort ?? 'totalPlays').trim();
        // prettier-ignore
        if (![
            'totalPlays', 'totalTime', 'totalScore',
            'lastPlayedTimestamp', 'createdTimestamp', 'updatedTimestamp'
        ].includes(sort))
            throw new Error(422, 'Sort is invalid');

        const order = String(options.order ?? 'desc').trim();
        if (!['asc', 'desc'].includes(order))
            throw new Error(422, 'Order is invalid');

        query = query.sort({ [sort]: order === 'asc' ? 1 : -1 });

        const ids = Array.from(options.ids ?? []);
        const slugs = Array.from(options.slugs ?? []);

        if (ids.length > 0 || slugs.length > 0) {
            const validIds = ids.filter(id => Validate.ObjectId.test(id));
            const validSlugs = slugs.filter(id => Validate.Slug.test(id));

            if (validIds.length > 0 || validSlugs.length > 0)
                query = query.or([
                    { _id: { $in: validIds } },
                    { slug: { $in: validSlugs } },
                ]);
        } else {
            const categories = Array.from(options.categories ?? []);
            if (categories.length > 0)
                query = query.where('categories').in(categories);

            const modes = Array.from(options.modes ?? []);
            if (modes.length > 0) query = query.where('modes').in(modes);
        }

        const limit = Math.min(Math.max(Number(options.limit ?? 20), 1), 100);
        if (Number.isNaN(limit)) throw new Error(422, 'Limit must be a number');

        const skip = Math.max(Number(options.skip ?? 0), 0);
        if (Number.isNaN(skip)) throw new Error(422, 'Skip must be a number');

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
