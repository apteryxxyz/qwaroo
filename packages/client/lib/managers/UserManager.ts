import { Routes } from '@owenii/types';
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

    public fetch(options: User.Resolvable): Promise<User>;
    public fetch(options: UserManager.FetchManyOptions): Promise<User[]>;
    public async fetch(
        options: User.Resolvable | UserManager.FetchManyOptions
    ) {
        if (User.isResolvable(options)) return this._fetchSingle(options);
        else return this._fetchMany(options);
    }

    private async _fetchSingle(user: User.Resolvable) {
        const id = User.resolveId(user) ?? 'unknown';
        const data = await this.client.rest.get(Routes.user(id));
        return this._add(data);
    }

    private async _fetchMany(options: UserManager.FetchManyOptions) {
        const data = await this.client.rest.get(Routes.users(), options);
        const items = data.items.map((dt: User.Entity) => this._add(dt));
        return items as User[];
    }
}

export namespace UserManager {
    export interface FetchManyOptions {
        term: string;
        limit?: number;
        skip?: number;
    }
}
