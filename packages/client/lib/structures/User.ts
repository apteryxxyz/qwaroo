import type { APIUser, User as UserEntity } from '@owenii/types';
import { Base } from './Base';
import type { Client } from '#/client/Client';
import { ConnectionManager } from '#/managers/ConnectionManager';
import { ScoreManager } from '#/managers/ScoreManager';

export class User extends Base implements APIUser {
    public displayName!: string;
    public avatarUrl!: string;
    public joinedTimestamp!: number;
    public seenTimestamp!: number;

    public constructor(
        client: Client,
        data: Partial<User.Entity> & { id: string }
    ) {
        super(client, data);
        this._patch(data);
    }

    public override _patch(data: Partial<User.Entity> & { id: string }) {
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

    public override equals(other: User | User.Entity) {
        return (
            other.id === this.id &&
            other.displayName === this.displayName &&
            other.avatarUrl === this.avatarUrl &&
            other.joinedTimestamp === this.joinedTimestamp &&
            other.seenTimestamp === this.seenTimestamp
        );
    }

    public async fetch() {
        return this.client.users.fetchOne(this.id);
    }

    public async fetchConnections() {
        const connections = new ConnectionManager(this);
        await connections.fetchAll();
        return connections;
    }

    public async fetchScores() {
        const scores = new ScoreManager(this);
        await scores.fetchAll();
        return scores;
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

    public static isResolvable(value: unknown): value is User.Resolvable {
        return (
            typeof value === 'string' ||
            value instanceof User ||
            Reflect.has(value ?? {}, 'id')
        );
    }

    public static resolveId(value: unknown) {
        if (User.isResolvable(value))
            return typeof value === 'string' ? value : value.id;
        return null;
    }
}

export namespace User {
    export type Entity = UserEntity;
    export type Resolvable = User | Entity | string;
}
