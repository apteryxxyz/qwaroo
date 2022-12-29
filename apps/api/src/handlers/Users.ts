import { ServerError as Error, Validate, createRegExp } from '@qwaroo/common';
import { User } from '@qwaroo/database';
import type { FetchUsersOptions } from '@qwaroo/types';

export class Users extends null {
    /** Get an existing user by their ID. */
    public static async getUser(id: string) {
        const isValidId = Validate.ObjectId.test(id);
        if (!isValidId) throw new Error(422, 'User ID is invalid');

        const user = await User.findById(id).exec();
        if (!user) throw new Error(404, 'User was not found');

        return user;
    }

    /** Get a list of all users. */
    public static async getUsers(options: FetchUsersOptions = {}) {
        const { term } = options;
        if (term && term.length < 1)
            throw new Error(422, 'Search term must be at least 1 character');

        const { limit = 20, skip = 0 } = options;
        if (typeof limit !== 'number' || Number.isNaN(limit))
            throw new Error(422, 'Limit must be a number');
        if (limit < 1) throw new Error(422, 'Limit must be greater than 0');
        if (typeof skip !== 'number' || Number.isNaN(skip))
            throw new Error(422, 'Skip must be a number');
        if (skip < 0) throw new Error(422, 'Skip must be greater than 0');

        let query = User.find();
        if (term)
            query = query
                .where('displayName')
                .regex(createRegExp(term, false, 'i'));

        const total = await query.countDocuments().exec();
        const users = await query.limit(limit).skip(skip).exec();

        return [{ total, limit, skip }, users] as const;
    }
}
