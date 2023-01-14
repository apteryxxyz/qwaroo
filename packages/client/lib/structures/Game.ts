import {
    type APIGame,
    type APISubmitScore,
    Game as GameEntity,
    Routes,
} from '@qwaroo/types';
import { Base } from './Base';
import type { GameManager } from '#/managers/GameManager';
import { ItemManager } from '#/managers/ItemManager';
import { GameFlagsBitField } from '#/utilities/GameFlagsBitField';

/** A game. */
export class Game<
        M extends GameEntity.Mode = GameEntity.Mode,
        H extends boolean = boolean
    >
    extends Base
    implements APIGame<M>
{
    /** The manager of the game. */
    public games: GameManager;

    public slug!: string;
    public creatorId!: string;
    public sourceSlug?: string;
    public sourceOptions?: Record<string, unknown>;

    public publicFlags!: number;
    public flags!: GameFlagsBitField;

    public mode!: M;
    public title!: string;
    public shortDescription!: string;
    public longDescription!: string;
    public thumbnailUrl!: string;
    public categories!: string[];
    public data!: GameEntity.Data<M>;

    public highScore!: H extends true ? number : undefined;
    public highScoreTime!: H extends true ? number : undefined;
    public highScoreTimestamp!: H extends true ? number : undefined;

    public totalScore!: number;
    public totalTime!: number;
    public totalPlays!: number;

    public createdTimestamp!: number;
    public updatedTimestamp!: number;
    public lastPlayedTimestamp!: number;

    public constructor(games: GameManager, data: APIGame<M>) {
        super(games.client, data);
        this.games = games;
        this._patch(data);
    }

    public override _patch(data: APIGame<M>) {
        this.id = data.id;
        this.slug = data.slug;

        this.creatorId = data.creatorId;

        this.sourceSlug = data.sourceSlug;
        this.sourceOptions = data.sourceOptions;

        this.publicFlags = data.publicFlags;
        this.flags = new GameFlagsBitField(data.publicFlags).freeze();

        this.mode = data.mode;
        this.title = data.title;
        this.shortDescription = data.shortDescription;
        this.longDescription = data.longDescription;
        this.thumbnailUrl = data.thumbnailUrl;
        this.categories = data.categories;
        this.data = data.data;

        type T = H extends true ? number : undefined;
        this.highScore = data.highScore as T;
        this.highScoreTime = data.highScoreTime as T;
        this.highScoreTimestamp = data.highScoreTimestamp as T;

        this.totalScore = data.totalScore;
        this.totalTime = data.totalTime;
        this.totalPlays = data.totalPlays;

        this.createdTimestamp = data.createdTimestamp;
        this.updatedTimestamp = data.updatedTimestamp;
        this.lastPlayedTimestamp = data.lastPlayedTimestamp;

        return super._patch(data);
    }

    /** Check if the game has been fetched. */
    public get partial() {
        return this.slug === undefined;
    }

    /** The date the game was created. */
    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    /** The date the game was last updated. */
    public get updatedAt() {
        return new Date(this.updatedTimestamp);
    }

    public override equals(other: Game | APIGame) {
        return (
            this.id === other.id &&
            this.slug === other.slug &&
            this.creatorId === other.creatorId &&
            this.sourceSlug === other.sourceSlug &&
            JSON.stringify(this.sourceOptions) ===
                JSON.stringify(other.sourceOptions) &&
            this.flags.equals(other.publicFlags) &&
            this.mode === other.mode &&
            this.title === other.title &&
            this.shortDescription === other.shortDescription &&
            this.longDescription === other.longDescription &&
            this.thumbnailUrl === other.thumbnailUrl &&
            JSON.stringify(this.categories) ===
                JSON.stringify(other.categories) &&
            JSON.stringify(this.data) === JSON.stringify(other.data) &&
            this.highScore === other.highScore &&
            this.highScoreTime === other.highScoreTime &&
            this.highScoreTimestamp === other.highScoreTimestamp &&
            this.totalScore === other.totalScore &&
            this.totalTime === other.totalTime &&
            this.totalPlays === other.totalPlays &&
            this.createdTimestamp === other.createdTimestamp &&
            this.updatedTimestamp === other.updatedTimestamp &&
            this.lastPlayedTimestamp === other.lastPlayedTimestamp
        );
    }

    /** Fetch the game. */
    public async fetch(force = true) {
        return this.games.fetchOne(this.id, force);
    }

    /** Fetch the creator of this game. */
    public async fetchCreator(force = true) {
        return this.client.users.fetchOne(this.creatorId, force);
    }

    /** Fetch the statistics of this game. */
    public fetchStatistics() {
        return this.client.games.fetchStatistics(this.id);
    }

    /** Fetch the first set items of this game. */
    public async fetchItems() {
        // Idk why but it doesn't work without the type assertion
        const manager = new ItemManager<M>(this) as ItemManager<M>;
        await manager.fetchMore();
        return manager;
    }

    /** Submit a score. */
    public async submitScore(save: APISubmitScore<M>) {
        const path = Routes.gameScore(this.id);
        await this.client.rest.post(path, undefined, save);

        if (this.client.isLoggedIn()) {
            const scores = await this.client.me.fetchScores();
            const score = scores.find(s => s.gameId === this.id);
            if (score) return score;
        }

        return undefined;
    }

    public override toJSON() {
        return {
            ...super.toJSON(),
            slug: this.slug,
            creatorId: this.creatorId,
            sourceSlug: this.sourceSlug,
            sourceOptions: this.sourceOptions,
            publicFlags: this.publicFlags,
            mode: this.mode,
            title: this.title,
            shortDescription: this.shortDescription,
            longDescription: this.longDescription,
            thumbnailUrl: this.thumbnailUrl,
            categories: this.categories,
            data: this.data,
            highScore: this.highScore,
            highScoreTime: this.highScoreTime,
            highScoreTimestamp: this.highScoreTimestamp,
            totalScore: this.totalScore,
            totalTime: this.totalTime,
            totalPlays: this.totalPlays,
            createdTimestamp: this.createdTimestamp,
            updatedTimestamp: this.updatedTimestamp,
            lastPlayedTimestamp: this.lastPlayedTimestamp,
        };
    }

    public static isResolvable(value: unknown): value is Game.Resolvable {
        return (
            typeof value === 'string' ||
            value instanceof Game ||
            Reflect.has(value ?? {}, 'id')
        );
    }

    public static resolveId(value: unknown) {
        if (Game.isResolvable(value))
            return typeof value === 'string' ? value : value.id;
        return null;
    }
}

export namespace Game {
    export type Resolvable = Game | APIGame | string;
    export const Flags = GameEntity.Flags;
    export type Flags = GameEntity.Flags;
}
