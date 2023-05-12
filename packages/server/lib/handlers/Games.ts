import { ServerError as Error, Validate, createRegExp } from '@qwaroo/common';
import type { FetchGamesOptions } from '@qwaroo/types';
import _ from 'lodash';
import type { User } from '#/utilities/structures';
import { Game } from '#/utilities/structures';

const toString = (value: unknown) => {
    if (typeof value === 'number') value = String(value);
    if (typeof value === 'boolean') value = String(value);
    if (typeof value === 'string') return value;
    return '';
};

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
        if (!isPublic && !isCreator) throw new Error(404, 'Game was not found');

        return game;
    }

    public static async isUniqueSlug(slug: string) {
        if (!Validate.Slug.test(slug) || slug === 'create')
            throw new Error(400, 'Game title is invalid');

        const existing = await Game.Model.findOne({ slug }).exec();
        if (existing) throw new Error(400, 'Game title is not unique');

        return true;
    }

    public static async createGame(
        user: User.Document,
        data: Partial<Game.Entity>
    ) {
        const game = new Game.Model({
            creatorId: user.id,
            title: toString(data.title),
            mode: toString(data.mode),
            shortDescription: toString(data.shortDescription),
            longDescription: toString(data.longDescription),
            thumbnailUrl: toString(data.thumbnailUrl),
            categories: Array.isArray(data.categories)
                ? data.categories
                      .filter(cat => Validate.Category.test(cat))
                      .map(cat => _.startCase(toString(cat).toLowerCase()))
                : [],
            sourceSlug: toString(data.sourceSlug),
            sourceProperties: data.sourceProperties,
            extraData: {
                valueVerb: toString(data.extraData?.valueVerb),
                valueNoun: toString(data.extraData?.valueNoun),
                valuePrefix: toString(data.extraData?.valuePrefix),
                valueSuffix: toString(data.extraData?.valueSuffix),
                higherText: toString(data.extraData?.higherText),
                lowerText: toString(data.extraData?.lowerText),
            },
            flags: 0,
            createdTimestamp: Date.now(),
            editedTimestamp: Date.now(),
        });

        await game.save().catch(error => {
            throw new Error(400, error.message);
        });

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
        if (!isPublic && !isCreator) throw new Error(404, 'Game was not found');

        const isEqual = (a: unknown, b: unknown) => a !== undefined && a !== b;

        if (isEqual(data.shortDescription, game.shortDescription))
            game.shortDescription = toString(data.shortDescription);
        if (isEqual(data.longDescription, game.longDescription))
            game.longDescription = toString(data.longDescription);

        if (isEqual(data.thumbnailUrl, game.thumbnailUrl))
            game.thumbnailUrl = toString(data.thumbnailUrl);
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
                      .map(cat => _.startCase(toString(cat).toLowerCase()))
                : [];

        if (game.mode === Game.Mode.HigherOrLower && data.extraData) {
            if (isEqual(data.extraData.valueVerb, game.extraData.valueVerb))
                game.extraData.valueVerb = toString(data.extraData.valueVerb);
            if (isEqual(data.extraData.valueNoun, game.extraData.valueNoun))
                game.extraData.valueNoun = toString(data.extraData.valueNoun);
            if (isEqual(data.extraData.valuePrefix, game.extraData.valuePrefix))
                game.extraData.valuePrefix = toString(
                    data.extraData.valuePrefix
                );
            if (isEqual(data.extraData.valueSuffix, game.extraData.valueSuffix))
                game.extraData.valueSuffix = toString(
                    data.extraData.valueSuffix
                );
            if (isEqual(data.extraData.higherText, game.extraData.higherText))
                game.extraData.higherText = toString(data.extraData.higherText);
            if (isEqual(data.extraData.lowerText, game.extraData.lowerText))
                game.extraData.lowerText = toString(data.extraData.lowerText);

            // Mongoose doesnt detect changes to nested objects, so we have to manually mark it as modified
            game.markModified('extraData');
        }

        if (game.isModified()) {
            game.editedTimestamp = Date.now();
            await game.save().catch(error => {
                throw new Error(400, error.message);
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
            void query.where('flags', { $bitsAllSet: Game.Flags.Public });
        //     void query.where('publicFlags', { $bitsAllSet: Game.Flags.Public });

        const ids = Array.from(options.ids ?? []);
        if (ids.length > 0) {
            const validIds = ids.filter(id => Validate.ObjectId.test(id));
            if (validIds.length > 0) void query.where('_id').in(validIds);
        }

        const term = toString(options.term);
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

        const sort = toString(options.sort ?? 'totalPlays');
        // prettier-ignore
        if (![
            'highScore', 'highScoreTime', 'highScoreTimestamp',
            'totalPlays', 'totalTime', 'totalScore',
            'lastPlayedTimestamp', 'createdTimestamp',
            'editedTimestamp', 'updatedTimestamp',
        ].includes(sort))
            throw new Error(422, 'Sort is not valid');

        const order = toString(options.order ?? 'desc');
        if (!['asc', 'desc'].includes(order))
            throw new Error(422, 'Order is not valid');

        void query.sort({ [sort]: order === 'asc' ? 1 : -1 });

        const total = await Game.Model.find(query).countDocuments().exec();
        const games = await query.limit(limit).skip(skip).exec();

        return [{ total, limit, skip }, games] as const;
    }
}
