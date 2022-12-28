import { User as UserEntity } from '@qwaroo/types';
import type { APIUser } from '@qwaroo/types';
import { Base } from './Base';
import type { Client } from '#/client/Client';
import { ConnectionManager } from '#/managers/ConnectionManager';
import { GameManager } from '#/managers/GameManager';
import { ScoreManager } from '#/managers/ScoreManager';
import { UserFlagsBitField } from '#/utilities/UserFlagsBitField';

/** A user. */
export class User extends Base implements APIUser {
    public publicFlags!: number;
    public flags!: UserFlagsBitField;

    public displayName!: string;
    public avatarUrl!: string;

    public joinedTimestamp!: number;
    public seenTimestamp!: number;

    public constructor(client: Client, data: APIUser) {
        super(client, data);
        this._patch(data);
    }

    public override _patch(data: APIUser) {
        this.publicFlags = data.publicFlags;
        this.flags = new UserFlagsBitField(data.publicFlags).freeze();

        this.displayName = data.displayName;
        this.avatarUrl = data.avatarUrl;

        this.joinedTimestamp = data.joinedTimestamp;
        this.seenTimestamp = data.seenTimestamp;

        return super._patch(data);
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

    public override equals(other: User | APIUser) {
        return (
            this.id === other.id &&
            this.flags.equals(other.publicFlags) &&
            this.displayName === other.displayName &&
            this.avatarUrl === other.avatarUrl &&
            this.joinedTimestamp === other.joinedTimestamp &&
            this.seenTimestamp === other.seenTimestamp
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
    export type Resolvable = User | APIUser | string;
    export const Flags = UserEntity.Flags;
    export type Flags = UserEntity.Flags;
}
