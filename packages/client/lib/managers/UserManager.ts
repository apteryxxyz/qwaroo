import { Routes } from '@owenii/routes/api';
import { BaseManager } from './BaseManager';
import { User } from '#/structures/User';

export class UserManager extends BaseManager<string, User> {
    public add(data: User.Entity) {
        const existing = this.get(data.id);

        if (existing) {
            existing._patch(data);
            return existing;
        }

        const entry = new User(this.client, data);
        this.set(entry.id, entry);
        return entry;
    }

    public async fetch(user: UserResolvable) {
        const id = this.resolveId(user);
        const data = await this.client.rest.get(Routes.user(id));
        return this.add(data);
    }

    public resolve(user: UserResolvable) {
        return this.get(this.resolveId(user));
    }

    public resolveId(user: UserResolvable) {
        if (typeof user === 'string') return user;
        if (user instanceof User) return user.id;
        return user.id;
    }
}

export type UserResolvable = User | User.Entity | string;
