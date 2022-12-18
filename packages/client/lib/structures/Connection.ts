import type {
    APIConnection,
    Connection as ConnectionEntity,
} from '@owenii/types';
import { Base } from './Base';
import type { ConnectionManager } from '#/managers/ConnectionManager';

export class Connection extends Base implements APIConnection {
    public connections: ConnectionManager;
    public userId!: string;
    public providerName!: APIConnection['providerName'];
    public accountId!: string;
    public accountUsername!: string;
    public linkedTimestamp!: number;

    public constructor(
        connections: ConnectionManager,
        data: Partial<Connection.Entity> & { id: string }
    ) {
        super(connections.client, data);
        this.connections = connections;
        this._patch(data);
    }

    public override _patch(data: Partial<Connection.Entity> & { id: string }) {
        if (data.id) this.id = data.id;
        if (data.userId) this.userId = data.userId;
        if (data.providerName) this.providerName = data.providerName;
        if (data.accountId) this.accountId = data.accountId;
        if (data.accountUsername) this.accountUsername = data.accountUsername;
        if (data.linkedTimestamp) this.linkedTimestamp = data.linkedTimestamp;

        return data;
    }

    public get partial() {
        return this.providerName === undefined;
    }

    public get linkedAt() {
        return new Date(this.linkedTimestamp);
    }

    public override equals(other: Connection | Connection.Entity) {
        return (
            other.id === this.id &&
            other.userId === this.userId &&
            other.providerName === this.providerName &&
            other.accountId === this.accountId &&
            other.accountUsername === this.accountUsername &&
            other.linkedTimestamp === this.linkedTimestamp
        );
    }

    public fetch(force = true) {
        return this.connections.fetchOne(this.id, force);
    }

    public fetchUser(force = true) {
        return this.connections.user.fetch(force);
    }

    public override toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            providerName: this.providerName,
            accountId: this.accountId,
            accountUsername: this.accountUsername,
            linkedTimestamp: this.linkedTimestamp,
        };
    }

    public static isResolvable(value: unknown): value is Connection.Resolvable {
        return (
            value instanceof Connection ||
            typeof value === 'string' ||
            Reflect.has(value ?? {}, 'id')
        );
    }

    public static resolveId(value: unknown) {
        if (Connection.isResolvable(value))
            return typeof value === 'string' ? value : value.id;
        return null;
    }
}

export namespace Connection {
    export type Entity = ConnectionEntity;
    export type Resolvable = Connection | Entity | string;
}
