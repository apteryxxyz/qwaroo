import type { APIUser, FetchUsersOptions } from '@qwaroo/types';
import { APIRoutes } from '@qwaroo/types';
import { Manager } from './Manager';
import { UserListing } from '#/listings/UserListing';
import { User } from '#/structures/User';

export class UserManager extends Manager<string, User> {
    public append(data: APIUser) {
        if (this.has(data.id)) {
            const existing = this.get(data.id)!;
            return existing._patch(data);
        }

        const entry = new User(this, data);
        this.set(entry.id, entry);
        return entry;
    }

    /** Fetch a single user. */
    public async fetchOne(user: User.Resolvable, force = false) {
        const id = User.resolveId(user) ?? 'unknown';
        if (force && this.has(id)) return this.get(id)!;

        const path = APIRoutes.user(id);
        const data = await this.client.api.get(path);
        return this.append(data);
    }

    /** Fetch a paged user listing. */
    public async fetchMany(options: FetchUsersOptions = {}) {
        const listing = new UserListing(this, options, -1);
        await listing.fetchMore();
        return listing;
    }

    public get [Symbol.toStringTag]() {
        return 'UserManager';
    }
}
