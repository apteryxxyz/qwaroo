import * as Types from '@qwaroo/types';
import { Base } from './Base';
import { Connection } from './Connection';
import { GameManager } from '#/managers/GameManager';
import { ScoreManager } from '#/managers/ScoreManager';
import type { UserManager } from '#/managers/UserManager';
import { UserFlagsBitField } from '#/utilities/UserFlagsBitField';

/** A user. */
export class User extends Base {
    public manager: UserManager;
    public games: GameManager;
    public scores: ScoreManager<User>;

    /** A display name, does not need to be unique. */
    public displayName!: string;
    /** A URL to the users avatar. */
    public avatarUrl!: string;
    /** The flags for this user. */
    public flags!: UserFlagsBitField;
    /** The timestamp when this user joined. */
    public joinedTimestamp!: number;
    /** The timestamp when this user last active. */
    public lastSeenTimestamp!: number;

    public constructor(manager: UserManager, data: Types.APIUser) {
        super(manager, data);
        this.manager = manager;
        this.games = new GameManager(this);
        this.scores = new ScoreManager(this);
        this.patch(data);
    }

    public override patch(data: Types.APIUser) {
        this.displayName = data.displayName;
        this.avatarUrl = data.avatarUrl;
        this.flags = new UserFlagsBitField(data.flags);
        this.joinedTimestamp = data.joinedTimestamp;
        this.lastSeenTimestamp = data.lastSeenTimestamp;

        return super.patch(data);
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
    public get lastSeenAt() {
        return new Date(this.lastSeenTimestamp);
    }

    /** Fetch the user. */
    public fetch(force = true) {
        return this.client.users.fetchOne(this, force);
    }

    /** Fetch the users connection. */
    public async fetchConnection() {
        const path = Types.APIRoutes.userConnection(this.id);
        const data = await this.client.api.get(path);
        return new Connection(this, data);
    }

    public override equals(other: User | Types.APIUser) {
        return (
            this.id === other.id &&
            this.displayName === other.displayName &&
            this.avatarUrl === other.avatarUrl &&
            this.flags.equals(Number(other.flags)) &&
            this.joinedTimestamp === other.joinedTimestamp &&
            this.lastSeenTimestamp === other.lastSeenTimestamp
        );
    }

    public override toJSON() {
        return {
            ...super.toJSON(),
            flags: Number(this.flags),
            displayName: this.displayName,
            avatarUrl: this.avatarUrl,
            joinedTimestamp: this.joinedTimestamp,
            lastSeenTimestamp: this.lastSeenTimestamp,
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

    public get [Symbol.toStringTag]() {
        return 'User';
    }
}

export namespace User {
    export type Resolvable = User | Types.APIUser | Entity | string;
    export type Entity = Types.User.Entity;
    export type Flags = Types.User.Flags;
    export const Flags = Types.User.Flags;
}
