import { ServerError as Error, Validate, createRegExp } from '@qwaroo/common';
import type { FetchUsersOptions } from '@qwaroo/types';
import { Connection, User } from '#/utilities/structures';

export class Users extends null {
    /**
     * Create a new user and connection.
     * @note This is not intended to be plugged into an API route.
     */
    public static async ensureAndRefreshUser(
        providerName: string,
        accountId: string,
        accountUsername: string,
        displayName: string,
        avatarUrl: string,
        refreshToken?: string
    ) {
        const connection = await Connection.Model.findOne({
            providerName,
            accountId,
        });

        if (connection) {
            const hasConnectionChanged =
                connection.accountUsername !== accountUsername ||
                (refreshToken && connection.refreshToken !== refreshToken);
            if (hasConnectionChanged)
                await connection.updateOne({
                    accountUsername,
                    refreshToken,
                });

            const user = await connection.getUser();
            const hasUserChanged =
                user.avatarUrl !== avatarUrl ||
                user.displayName !== displayName;
            if (hasUserChanged)
                await user.updateOne({
                    avatarUrl,
                    displayName,
                });

            return user;
        }

        const newUser = new User.Model({
            displayName,
            avatarUrl,
        });

        const newConnection = new Connection.Model({
            userId: newUser.id,
            providerName,
            accountId,
            accountUsername,
            refreshToken,
        });

        await Promise.all([newUser.save(), newConnection.save()]);
        return newUser;
    }

    /** Get an existing user by their ID. */
    public static async getUser(id: string, defaultUser?: User.Document) {
        if (!Validate.ObjectId.test(id))
            throw new Error(404, 'User was not found');

        if (defaultUser && defaultUser.id === id) return defaultUser;

        const user = await User.Model.findById(id).exec();
        if (!user) throw new Error(404, 'User was not found');

        return user;
    }

    /** Get a paged list of all users. */
    public static async getUsers(options: FetchUsersOptions) {
        const limit = Math.min(Math.max(options.limit ?? 20, 0), 100);
        if (typeof limit !== 'number')
            throw new Error(422, 'Limit must be a number');
        const skip = Math.max(options.skip ?? 0, 0);
        if (typeof skip !== 'number')
            throw new Error(422, 'Skip must be a number');

        const query = User.Model.find();

        const ids = Array.from(options.ids ?? []);
        if (ids.length > 0) {
            const validIds = ids.filter(id => Validate.ObjectId.test(id));
            if (validIds.length > 0) void query.where('_id').in(validIds);
        }

        const term = String(options.term ?? '').trim();
        if (term.length > 0) {
            const regex = createRegExp(term, false, 'i');
            void query.where('displayName').regex(regex);
        }

        const sort = String(options.sort ?? 'lastSeenTimestamp').trim();
        if (!['joinedTimestamp', 'lastSeenTimestamp'].includes(sort))
            throw new Error(422, 'Sort is not valid');

        const order = String(options.order ?? 'desc').trim();
        if (!['asc', 'desc'].includes(order))
            throw new Error(422, 'Order is not valid');

        void query.sort({ [sort]: order === 'asc' ? 1 : -1 });

        const total = await User.Model.find()
            .merge(query)
            .countDocuments()
            .exec();
        const users = await query.limit(limit).skip(skip).exec();

        return [{ total, limit, skip }, users] as const;
    }
}
