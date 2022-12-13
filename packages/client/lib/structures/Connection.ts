import type { Connection as ConnectionEntity } from '@owenii/types';
import { Base } from './Base';
import type { User } from './User';

export class Connection extends Base {
    public user: User;
    public userId!: string;
    public providerName!: string;
    public accountId!: string;
    public accountUsername!: string;
    public linkedTimestamp!: number;

    public constructor(
        user: User,
        data: Partial<Connection.Entity> & { id: string }
    ) {
        super(user.client, data);
        this.user = user;
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
