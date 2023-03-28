import { ServerError as Error, Validate, createRegExp } from '@qwaroo/common';
import type { FetchGamesOptions } from '@qwaroo/types';
import _ from 'lodash';
import type { User } from '#/utilities/structures';
import { Game } from '#/utilities/structures';

export class Games extends null {
    /** Get a list of all the game categories. */
    public static async getCategories(user?: User.Document) {
        const games = await (user ? user.getGames() : Game.Model.find().exec());
        const categories = [...games].flatMap(_ => _.categories ?? []);
        return [...new Set(categories)];
    }

    /** Get a single game by its ID or slug. */
    public static async getGame(
        idOrSlug: string,
        user?: User.Document,
        allowSlug = false
    ) {
        const isId = Validate.ObjectId.test(idOrSlug);
        if (!isId && !allowSlug) throw new Error(422, 'Game was not found');

        const isSlug = !isId && Validate.Slug.test(idOrSlug);
        if (!isSlug && !isId) throw new Error(422, 'Game was not found');

        const game = await Game.Model.findOne({
            ...(isId ? { _id: idOrSlug } : {}),
            ...(isSlug ? { slug: idOrSlug } : {}),
        }).exec();
        if (!game) throw new Error(404, 'Game was not found');

        // If the game is not public, only the creator can see it
        const isPublic = (game.flags & Game.Flags.Public) !== 0;
        const isCreator = user && game.creatorId === user.id;
        if (!isPublic && !isCreator) throw new Error(403, 'Game was not found');

        return game;
    }

    /** Update a game. */
    public static async updateGame(
        game: Game.Document,
        user: User.Document,
        data: Partial<Game.Entity>
    ) {
        const isPublic = (game.flags & Game.Flags.Public) !== 0;
        const isCreator = user.id === game.creatorId;
        if (!isPublic && !isCreator) throw new Error(403, 'Game was not found');

        const isEqual = (a: unknown, b: unknown) => a !== undefined && a !== b;

        if (isEqual(data.shortDescription, game.shortDescription))
            game.shortDescription = String(data.shortDescription ?? '').trim();
        if (isEqual(data.longDescription, game.longDescription))
            game.longDescription = String(data.longDescription ?? '').trim();

        if (isEqual(data.thumbnailUrl, game.thumbnailUrl))
            game.thumbnailUrl = String(data.thumbnailUrl ?? '').trim();
        if (
            data.categories &&
            isEqual(
                JSON.stringify(data.categories),
                JSON.stringify(game.categories)
            )
        )
            game.categories = Array.isArray(data.categories)
                ? data.categories
                      .filter(cat => Validate.Category.test(cat))
                      .map(cat => _.startCase(String(cat).toLowerCase()))
                : [];

        if (game.mode === Game.Mode.HigherOrLower && data.extraData) {
            if (isEqual(data.extraData.valueVerb, game.extraData.valueVerb))
                game.extraData.valueVerb = String(
                    data.extraData.valueVerb ?? ''
                ).trim();
            if (isEqual(data.extraData.valueNoun, game.extraData.valueNoun))
                game.extraData.valueNoun = String(
                    data.extraData.valueNoun ?? ''
                ).trim();
            if (isEqual(data.extraData.valuePrefix, game.extraData.valuePrefix))
                game.extraData.valuePrefix = String(
                    data.extraData.valuePrefix ?? ''
                ).trim();
            if (isEqual(data.extraData.valueSuffix, game.extraData.valueSuffix))
                game.extraData.valueSuffix = String(
                    data.extraData.valueSuffix ?? ''
                ).trim();
            if (isEqual(data.extraData.higherText, game.extraData.higherText))
                game.extraData.higherText = String(
                    data.extraData.higherText ?? ''
                ).trim();
            if (isEqual(data.extraData.lowerText, game.extraData.lowerText))
                game.extraData.lowerText = String(
                    data.extraData.lowerText ?? ''
                ).trim();

            // Mongoose doesnt detect changes to nested objects, so we have to manually mark it as modified
            game.markModified('extraData');
        }

        if (game.isModified()) {
            game.updatedTimestamp = Date.now();
            await game.save().catch(error => {
                console.log(error);
                throw new Error(400, 'Failed to update game');
            });
        }

        return game;
    }

    /** Get a paged list of all games. */
    public static async getGames(
        options: FetchGamesOptions = {},
        user?: User.Document,
        me?: User.Document
    ) {
        const limit = Math.min(Math.max(options.limit ?? 20, 0), 100);
        if (typeof limit !== 'number')
            throw new Error(422, 'Limit must be a number');
        const skip = Math.max(options.skip ?? 0, 0);
        if (typeof skip !== 'number')
            throw new Error(422, 'Skip must be a number');

        const query = Game.Model.find();

        // Getting a specific users games
        if (user) void query.where('creatorId').equals(user.id);
        // Filter out all the private games, unless the user is the creator
        if (!me || !user || me.id !== user.id)
            void query.where('publicFlags', { $bitsAllSet: Game.Flags.Public });

        const ids = Array.from(options.ids ?? []);
        if (ids.length > 0) {
            const validIds = ids.filter(id => Validate.ObjectId.test(id));
            if (validIds.length > 0) void query.where('_id').in(validIds);
        }

        const term = String(options.term ?? '').trim();
        if (term.length > 0) {
            const regex = createRegExp(term, false, 'i');
            void query.where({
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
            'highScore', 'highScoreTime', 'highScoreTimestamp',
            'totalPlays', 'totalTime', 'totalScore',
            'lastPlayedTimestamp', 'createdTimestamp', 'updatedTimestamp'
        ].includes(sort))
            throw new Error(422, 'Sort is not valid');

        const order = String(options.order ?? 'desc').trim();
        if (!['asc', 'desc'].includes(order))
            throw new Error(422, 'Order is not valid');

        void query.sort({ [sort]: order === 'asc' ? 1 : -1 });

        const total = await Game.Model.find(query).countDocuments().exec();
        const games = await query.limit(limit).skip(skip).exec();

        return [{ total, limit, skip }, games] as const;
    }
}
