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
        let query = User.find();

        const term = String(options.term ?? '').trim();
        if (term.length > 0)
            query = query
                .where('displayName')
                .regex(createRegExp(term, false, 'i'));

        const ids = Array.from(options.ids ?? []);
        if (ids.length > 0) {
            const validIds = ids.filter(Validate.ObjectId.test);
            if (validIds.length > 0) query = query.where('_id').in(validIds);
        }

        const limit = Math.min(Math.max(Number(options.limit ?? 20), 1), 100);
        if (Number.isNaN(limit)) throw new Error(422, 'Limit must be a number');

        const skip = Math.max(Number(options.skip ?? 0), 0);
        if (Number.isNaN(skip)) throw new Error(422, 'Skip must be a number');

        const total = await query.countDocuments().exec();
        const users = await query.limit(limit).skip(skip).exec();

        return [{ total, limit, skip }, users] as const;
    }
}
