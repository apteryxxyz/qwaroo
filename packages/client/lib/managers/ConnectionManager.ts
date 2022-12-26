import { Routes } from '@qwaroo/types';
import { MapManager } from './BaseManager';
import { Connection } from '#/structures/Connection';
import type { User } from '#/structures/User';

/** A manager for connections. */
export class ConnectionManager extends MapManager<string, Connection> {
    /** The user the connections belong to. */
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

    /** Fetch a single connection. */
    public async fetchOne(connection: Connection.Resolvable, force = false) {
        const id = Connection.resolveId(connection) ?? 'unknown';

        if (!force) {
            const existing = this.get(id);
            if (existing) return existing;
        }

        const path = Routes.userConnection(this.user.id, id);
        const data = await this.client.rest.get(path);
        return this._add(data);
    }

    /** Fetch all connections. */
    public async fetchAll(): Promise<Connection[]> {
        const path = Routes.userConnections(this.user.id);
        const data = await this.client.rest.get(path);
        return data.items.map((dt: Connection.Entity) => this._add(dt));
    }
}
