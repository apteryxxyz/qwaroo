import type { User as UserEntity } from '@owenii/types';
import { Base } from './Base';
import type { Client } from '#/client/Client';
import { ConnectionManager } from '#/managers/ConnectionManager';

export class User extends Base {
    public displayName!: string;
    public avatarUrl!: string;
    public joinedTimestamp!: number;
    public seenTimestamp!: number;

    public connections = new ConnectionManager(this);

    public constructor(
        client: Client,
        data: Partial<UserEntity> & { id: string }
    ) {
        super(client, data);
        this._patch(data);
    }

    public override _patch(data: Partial<UserEntity> & { id: string }) {
        if (data.id) this.id = data.id;
        if (data.displayName) this.displayName = data.displayName;
        if (data.avatarUrl) this.avatarUrl = data.avatarUrl;
        if (data.joinedTimestamp) this.joinedTimestamp = data.joinedTimestamp;
        if (data.seenTimestamp) this.seenTimestamp = data.seenTimestamp;

        return data;
    }

    public get partial() {
        return this.displayName === undefined;
    }

    public get joinedAt() {
        return new Date(this.joinedTimestamp);
    }

    public get seenAt() {
        return new Date(this.seenTimestamp);
    }

    public equals(user: User | UserEntity) {
        return (
            user.id === this.id &&
            user.displayName === this.displayName &&
            user.avatarUrl === this.avatarUrl &&
            user.joinedTimestamp === this.joinedTimestamp &&
            user.seenTimestamp === this.seenTimestamp
        );
    }

    public async fetch() {
        await this.client.users.fetch(this.id);
        await this.connections.fetch();
        return this;
    }

    public override toJSON() {
        return {
            id: this.id,
            displayName: this.displayName,
            avatarUrl: this.avatarUrl,
            joinedTimestamp: this.joinedTimestamp,
            seenTimestamp: this.seenTimestamp,
        };
    }
}

export namespace User {
    export type Entity = UserEntity;
}

/*
var id = '6394aafbf92ba0f9dde98a04', token = '8a11178bd8a306b17da44d992f2e036a-ba1c54acac04b1bea7166d9e63fe9dd0c8eed424985fd7396c9b136ba38638b461139932ddc5648d2dbcb380fa7365fcd00cfe81044b64ed495055d507575c4c9f57fa54726f6df6e373c4e96dff6b7f5fc985ede547aae39de228a2eb5d5d0e', url = 'http://localhost:3001';
*/
