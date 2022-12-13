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

    public fetch(options: Connection.Resolvable): Promise<Connection>;
    public fetch(): Promise<Connection[]>;
    public fetch(options?: Connection.Resolvable) {
        if (Connection.isResolvable(options)) return this._fetchSingle(options);
        else return this._fetchMany();
    }

    private async _fetchSingle(connection: Connection.Resolvable) {
        const id = Connection.resolveId(connection) ?? 'unknown';
        const path = Routes.userConnection(this.user.id, id);
        const data = await this.client.rest.get(path);
        return this.add(data);
    }

    private async _fetchMany() {
        const path = Routes.userConnections(this.user.id);
        const data = await this.client.rest.get(path);
        return data.items.map((dt: Connection.Entity) => this.add(dt));
    }
}
