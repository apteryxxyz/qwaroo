import { Routes } from '@owenii/types';
import { MapManager } from './BaseManager';
import { Connection } from '#/structures/Connection';
import type { User } from '#/structures/User';

export class ConnectionManager extends MapManager<string, Connection> {
    public user: User;

    public constructor(user: User) {
        super(user.client);
        this.user = user;
    }

    private _add(data: Connection.Entity) {
        const existing = this.get(data.id);

        if (existing) {
            existing._patch(data);
            return existing;
        }

        const entry = new Connection(this, data);
        this.set(entry.id, entry);
        return entry;
    }

    public async fetchOne(connection: Connection.Resolvable) {
        const id = Connection.resolveId(connection) ?? 'unknown';
        const path = Routes.userConnection(this.user.id, id);
        const data = await this.client.rest.get(path);
        return this._add(data);
    }

    public async fetchAll() {
        const path = Routes.userConnections(this.user.id);
        const data = await this.client.rest.get(path);
        return data.items.map((dt: Connection.Entity) => this._add(dt));
    }
}
