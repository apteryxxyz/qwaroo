import { Routes } from '@owenii/routes/api';
import { BaseManager } from './BaseManager';
import { Connection } from '#/structures/Connection';
import type { User } from '#/structures/User';

export class ConnectionManager extends BaseManager<string, Connection> {
    public user: User;

    public constructor(user: User) {
        super(user.client);
        this.user = user;
    }

    public add(data: Connection.Entity) {
        const existing = this.get(data.id);

        if (existing) {
            existing._patch(data);
            return existing;
        }

        const entry = new Connection(this.user, data);
        this.set(entry.id, entry);
        return entry;
    }

    public async fetch(connection?: ConnectionResolvable) {
        const id = this.resolveId(connection ?? '');

        if (id) {
            const path = Routes.userConnection(this.user.id, id);
            const data = await this.client.rest.get(path);
            return this.add(data);
        }

        const path = Routes.userConnections(this.user.id);
        const data = await this.client.rest.get(path);
        return data.items.map((dt: Connection.Entity) => this.add(dt));
    }

    public resolve(connection: ConnectionResolvable) {
        return this.get(this.resolveId(connection));
    }

    public resolveId(connection: ConnectionResolvable) {
        if (typeof connection === 'string') return connection;
        if (connection instanceof Connection) return connection.id;
        return connection?.id;
    }
}

export type ConnectionResolvable = Connection | Connection.Entity | string;
