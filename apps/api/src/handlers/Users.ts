import { ServerError as Error, Validate, createRegExp } from '@owenii/common';
import { User } from '@owenii/database';

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
    public static async getUsers(term: string, limit = 100, skip = 0) {
        if (!term) throw new Error(422, 'Search term is required');
        if (term.length < 1)
            throw new Error(422, 'Search term must be at least 1 character');

        if (typeof limit !== 'number' || Number.isNaN(limit))
            throw new Error(422, 'Limit must be a number');
        if (limit < 1) throw new Error(422, 'Limit must be greater than 0');

        if (typeof skip !== 'number' || Number.isNaN(skip))
            throw new Error(422, 'Skip must be a number');
        if (skip < 0) throw new Error(422, 'Skip must be greater than 0');

        const displayName = createRegExp(term, false, 'i');
        const query = User.where('displayName').regex(displayName);

        const total = await query.countDocuments().exec();
        const users = await User.find()
            .merge(query)
            .limit(limit)
            .skip(skip)
            .exec();

        return [{ total, limit, skip }, users] as const;
    }
}
