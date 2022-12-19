import { type FetchUsersOptions, Routes } from '@owenii/types';
import { MapManager } from './BaseManager';
import { User } from '#/structures/User';

/** A manager for users. */
export class UserManager extends MapManager<string, User> {
    private _add(data: User.Entity) {
        const existing = this.get(data.id);

        if (existing) {
            existing._patch(data);
            return existing;
        }

        const entry = new User(this.client, data);
        this.set(entry.id, entry);
        return entry;
    }

    /** Fetch a single user. */
    public async fetchOne(user: User.Resolvable, force = false) {
        const id = User.resolveId(user) ?? 'unknown';

        if (!force) {
            const existing = this.get(id);
            if (existing) return existing;
        }

        const path = Routes.user(id);
        const data = await this.client.rest.get(path);
        return this._add(data);
    }

    /** Fetch many users. */
    public async fetchMany(options: FetchUsersOptions): Promise<User[]> {
        const data = await this.client.rest.get(Routes.users(), options);
        return data.items.map((dt: User.Entity) => this._add(dt));
    }
}
