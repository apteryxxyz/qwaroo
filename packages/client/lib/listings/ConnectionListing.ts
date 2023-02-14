import type { APIConnection } from '@qwaroo/types';
import { APIRoutes } from '@qwaroo/types';
import { Listing } from './Listing';
import { Connection } from '#/structures/Connection';
import type { User } from '#/structures/User';

export class ConnectionListing extends Listing<{}, Connection, APIConnection> {
    public user: User;
    public abortController?: AbortController;

    public constructor(user: User) {
        super(user, {}, -1);
        this.user = user;
    }

    public append(data: APIConnection) {
        const connection = new Connection(this, data);
        this.set(connection.id, connection);
        return connection;
    }

    public async fetchOne(connection: Connection.Resolvable) {
        const id = Connection.resolveId(connection) ?? 'unknown';
        const path = APIRoutes.userConnection(this.user.id, id);
        const data = await this.client.api.get(path);
        return this.append(data);
    }

    public async fetchMore() {
        this.abortController = new AbortController();
        const path = APIRoutes.userConnections(this.user.id);
        const data = await this.client.api.get(
            path,
            {
                limit: 25,
                skip: this.size,
            },
            this.abortController.signal
        );

        return data.items.map((raw: APIConnection) =>
            this.append(raw)
        ) as Connection[];
    }

    public abort() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    public get [Symbol.toStringTag]() {
        return 'ConnectionListing';
    }
}
