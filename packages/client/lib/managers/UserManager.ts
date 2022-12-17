import { type FetchUsersOptions, Routes } from '@owenii/types';
import { MapManager } from './BaseManager';
import { User } from '#/structures/User';

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

    public async fetchOne(user: User.Resolvable) {
        const id = User.resolveId(user) ?? 'unknown';
        const path = Routes.user(id);
        const data = await this.client.rest.get(path);
        return this._add(data);
    }

    public async fetchMany(options: FetchUsersOptions) {
        const data = await this.client.rest.get(Routes.users(), options);
        return data.items.map((dt: User.Entity) => this._add(dt));
    }
}
