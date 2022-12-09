import { User } from '@owenii/database';
import { Validate, createRegExp } from '@owenii/validators';
import { APIError } from '#/utilities/APIError';

export class Users extends null {
    /** Get an existing user by their ID. */
    public static async getUser(id: string) {
        const isValidId = Validate.ObjectId.test(id);
        if (!isValidId) throw new APIError(422, 'User ID is not valid');

        const user = await User.findById(id).exec();
        if (!user) throw new APIError(404, 'User does not exist');

        return user;
    }

    /** Get a list of users using pages. */
    public static async getPaginatedUsers(term: string, page = 1) {
        if (!term) throw new APIError(422, 'Search term is required');
        if (term.length < 1)
            throw new APIError(422, 'Search term must be at least 1 character');

        if (typeof page !== 'number' || Number.isNaN(page))
            throw new APIError(422, 'Page must be a number');
        if (page < 1) throw new APIError(422, 'Page must be greater than 0');

        const displayName = createRegExp(term, false, 'i');
        const query = User.find({ displayName });
        const total = await query.countDocuments().exec();
        const users = await User.find()
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
