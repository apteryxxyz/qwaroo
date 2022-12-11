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
        data: Partial<ConnectionEntity> & { id: string }
    ) {
        super(user.client, data);
        this.user = user;
        this._patch(data);
    }

    public override _patch(data: Partial<ConnectionEntity> & { id: string }) {
        if (data.id) this.id = data.id;
        if (data.userId) this.userId = data.userId;
        if (data.providerName) this.providerName = data.providerName;
        if (data.accountId) this.accountId = data.accountId;
        if (data.accountUsername) this.accountUsername = data.accountUsername;
        if (data.linkedTimestamp) this.linkedTimestamp = data.linkedTimestamp;

        return data;
    }

    public get partial() {
        return this.userId === undefined;
    }

    public get linkedAt() {
        return new Date(this.linkedTimestamp);
    }

    public equals(connection: Connection | ConnectionEntity) {
        return (
            connection.id === this.id &&
            connection.userId === this.userId &&
            connection.providerName === this.providerName &&
            connection.accountId === this.accountId &&
            connection.accountUsername === this.accountUsername &&
            connection.linkedTimestamp === this.linkedTimestamp
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
}

export namespace Connection {
    export type Entity = ConnectionEntity;
}
