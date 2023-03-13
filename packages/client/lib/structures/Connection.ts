import type * as Types from '@qwaroo/types';
import { Base } from './Base';
import type { User } from './User';

/** A connection. */
export class Connection extends Base {
    public user: User;

    /** The ID of the user that this connection belongs to. */
    public userId!: string;
    /** The name of the provider this connection is for. */
    public providerName!: Connection.ProviderName;
    /** This connections identifier within the provider. */
    public accountId!: string;
    /** This connections username within the provider. */
    public accountUsername!: string;
    /** The timestamp when this connection was linked. */
    public linkedTimestamp!: number;

    public constructor(user: User, data: Types.APIConnection) {
        super(user, data);
        this.user = user;
        this.patch(data);
    }

    public override patch(data: Types.APIConnection) {
        this.userId = data.userId;
        this.providerName = data.providerName;
        this.accountId = data.accountId;
        this.accountUsername = data.accountUsername;
        this.linkedTimestamp = data.linkedTimestamp;

        return super.patch(data);
    }

    /** Check if the connection has been fetched. */
    public get partial() {
        return this.providerName === undefined;
    }

    /** The date the connection was linked. */
    public get linkedAt() {
        return new Date(this.linkedTimestamp);
    }

    /** Fetch this connection. */
    public fetch() {
        return this.user.fetchConnection();
    }

    /** Fetch the user of this connection. */
    public fetchUser(force = true) {
        return this.client.users.fetchOne(this.userId, force);
    }

    public override equals(other: Connection | Types.APIConnection) {
        return (
            super.equals(other) &&
            this.userId === other.userId &&
            this.providerName === other.providerName &&
            this.accountId === other.accountId &&
            this.accountUsername === other.accountUsername &&
            this.linkedTimestamp === other.linkedTimestamp
        );
    }

    public override toJSON() {
        return {
            ...super.toJSON(),
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

    public get [Symbol.toStringTag]() {
        return 'Connection';
    }
}

export namespace Connection {
    export type Resolvable = Connection | Types.APIConnection | Entity | string;
    export type Entity = Types.Connection.Entity;
    export type ProviderName = Types.Connection.ProviderName;
}
