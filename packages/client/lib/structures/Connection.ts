import type { APIConnection } from '@qwaroo/types';
import { Base } from './Base';
import type { ConnectionManager } from '#/managers/ConnectionManager';

/** A connection. */
export class Connection extends Base implements APIConnection {
    /** The manager of the connection. */
    public connections: ConnectionManager;

    public userId!: string;

    public providerName!: APIConnection['providerName'];
    public accountId!: string;
    public accountUsername!: string;

    public linkedTimestamp!: number;

    public constructor(connections: ConnectionManager, data: APIConnection) {
        super(connections.client, data);
        this.connections = connections;
        this._patch(data);
    }

    public override _patch(data: APIConnection) {
        this.userId = data.userId;

        this.providerName = data.providerName;
        this.accountId = data.accountId;
        this.accountUsername = data.accountUsername;

        this.linkedTimestamp = data.linkedTimestamp;

        return super._patch(data);
    }

    /** Check if the connection has been fetched. */
    public get partial() {
        return this.providerName === undefined;
    }

    /** The date the connection was linked. */
    public get linkedAt() {
        return new Date(this.linkedTimestamp);
    }

    public override equals(other: Connection | APIConnection) {
        return (
            this.id === other.id &&
            this.userId === other.userId &&
            this.providerName === other.providerName &&
            this.accountId === other.accountId &&
            this.accountUsername === other.accountUsername &&
            this.linkedTimestamp === other.linkedTimestamp
        );
    }

    /** Fetch the connection. */
    public fetch(force = true) {
        return this.connections.fetchOne(this.id, force);
    }

    /** Fetch the user of this connection. */
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
    export type Resolvable = Connection | APIConnection | string;
}
