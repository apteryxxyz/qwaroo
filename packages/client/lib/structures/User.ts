import type { APIUser, User as UserEntity } from '@qwaroo/types';
import { Base } from './Base';
import type { Client } from '#/client/Client';
import { ConnectionManager } from '#/managers/ConnectionManager';
import { GameManager } from '#/managers/GameManager';
import { ScoreManager } from '#/managers/ScoreManager';

/** A user. */
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

    /** Check if the user has been fetched. */
    public get partial() {
        return this.displayName === undefined;
    }

    /** The date the user joined. */
    public get joinedAt() {
        return new Date(this.joinedTimestamp);
    }

    /** The date the user was last seen. */
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

    /** Fetch the user. */
    public async fetch(force = true) {
        return this.client.users.fetchOne(this.id, force);
    }

    /** Fetch the user's connections. */
    public async fetchConnections() {
        const connections = new ConnectionManager(this);
        await connections.fetchAll();
        return connections;
    }

    /** Fetch the first set of the user's scores. */
    public async fetchScores() {
        const scores = new ScoreManager(this);
        await scores.fetchMany();
        return scores;
    }

    /** Fetch the user's game categories. */
    public async fetchGameCategories() {
        const games = new GameManager(this);
        return games.fetchCategories();
    }

    /** Fetch the first set of the user's games. */
    public async fetchGames() {
        const games = new GameManager(this);
        await games.fetchMany();
        return games;
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
