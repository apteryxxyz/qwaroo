import * as Types from '@qwaroo/types';
import { Base } from './Base';
import { ItemListing } from '#/listings/ItemListing';
import type { GameManager } from '#/managers/GameManager';
import { ScoreManager } from '#/managers/ScoreManager';
import { GameFlagsBitField } from '#/utilities/GameFlagsBitField';

/** A game. */
export class Game<M extends Game.Mode = Game.Mode> extends Base {
    public manager: GameManager;
    public scores: ScoreManager<Game<M>>;

    /** Short unique slug, intended to be easier to type. */
    public slug!: string;
    /** ID of the user that created this game. */
    public creatorId!: string;
    /** What mode this game is. */
    public mode!: M;
    /** A title for this game. */
    public title!: string;
    /** A short description for this game. */
    public shortDescription!: string;
    /** A long description for this game. */
    public longDescription!: string;
    /** URL to a thumbnail image. */
    public thumbnailUrl!: string;
    /** Categories this game belongs to. */
    public categories!: string[];
    /** The flags for this game. */
    public flags!: GameFlagsBitField;
    /** Additional data properties. */
    public extraData!: Game.Extra<M>;

    /** The slug of the source. */
    public sourceSlug?: string;
    /** Additional properties for the source. */
    public sourceProperties?: Record<string, unknown>;

    /** The highest score this game has gotten. */
    public highScore!: number;
    /** The time it took to get the highest score. */
    public highScoreTime!: number;
    /** The timestamp when the highest score was achieved. */
    public highScorePlayedTimestamp!: number;
    /** The total score. */
    public totalScore!: number;
    /** The total time. */
    public totalTime!: number;
    /** The total number of plays. */
    public totalPlays!: number;
    /** The score this game had. */
    public lastScore!: number;
    /** The time the last game took. */
    public lastTime!: number;
    /** The timestamp when this game was last played. */
    public lastPlayedTimestamp!: number;
    /** When this game was created. */
    public createdTimestamp!: number;
    /** When this game was last edited. */
    public editedTimestamp!: number;
    /** When this game items were last updated. */
    public updatedTimestamp?: number;

    public constructor(manager: GameManager, data: Types.APIGame<M>) {
        super(manager, data);
        this.manager = manager;
        this.scores = new ScoreManager(this);
        this.patch(data);
    }

    public override patch(data: Types.APIGame<M>) {
        this.slug = data.slug;
        this.creatorId = data.creatorId;
        this.mode = data.mode;
        this.title = data.title;
        this.shortDescription = data.shortDescription;
        this.longDescription = data.longDescription;
        this.thumbnailUrl = data.thumbnailUrl;
        this.categories = data.categories;
        this.flags = new GameFlagsBitField(data.flags);
        this.extraData = data.extraData ?? {};
        this.sourceSlug = data.sourceSlug;
        this.sourceProperties = data.sourceProperties;
        this.highScore = data.highScore;
        this.highScoreTime = data.highScoreTime;
        this.highScorePlayedTimestamp = data.highScorePlayedTimestamp;
        this.totalScore = data.totalScore;
        this.totalTime = data.totalTime;
        this.totalPlays = data.totalPlays;
        this.lastScore = data.lastScore;
        this.lastTime = data.lastTime;
        this.lastPlayedTimestamp = data.lastPlayedTimestamp;
        this.createdTimestamp = data.createdTimestamp;
        this.editedTimestamp = data.editedTimestamp;
        this.updatedTimestamp = data.updatedTimestamp;

        return super.patch(data);
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
    public get editedAt() {
        return new Date(this.editedTimestamp);
    }

    /** The date the game's items were last updated. */
    public get updatedAt() {
        return this.updatedTimestamp
            ? new Date(this.updatedTimestamp)
            : undefined;
    }

    /** The human readable name for this games mode. */
    public get modeName() {
        return Game.ModeNames[this.mode];
    }

    /** Fetch the game. */
    public fetch() {
        return this.manager.fetchOne(this.id);
    }

    /** Fetch the creator of this game. */
    public fetchCreator(force = false) {
        return this.client.users.fetchOne(this.creatorId, force);
    }

    /** Submit a score. */
    public async submitScore(save: Types.APISubmitScoreOptions) {
        const path = Types.APIRoutes.gameScores(this.id);
        await this.client.api.post(path, undefined, save);

        if (this.client.me) {
            const score = await this.client.me.scores.fetchOne(this.id);
            if (score) return score;
        }

        return undefined;
    }

    public async edit(changes: Partial<Game.Entity>) {
        if (this.client.id !== this.creatorId) return this;

        const path = Types.APIRoutes.game(this.id);
        const data = await this.client.api.patch(path, undefined, changes);
        return this.patch(data);
    }

    /** Fetch the first set of items for this game. */
    public async fetchItems() {
        const listing = new ItemListing<Game.Item<M>>(
            this,
            {},
            -1
        ) as ItemListing<Game.Item<M>>;
        await listing.fetchMore();
        return listing;
    }

    public async updateItems() {
        const path = Types.APIRoutes.gameItems(this.id);
        const data = await this.client.api.post(path);
        return data.version as string;
    }

    public override equals(other: Game | Types.APIGame) {
        return (
            super.equals(other) &&
            this.slug === other.slug &&
            this.creatorId === other.creatorId &&
            this.mode === other.mode &&
            this.title === other.title &&
            this.shortDescription === other.shortDescription &&
            this.longDescription === other.longDescription &&
            this.thumbnailUrl === other.thumbnailUrl &&
            this.categories === other.categories &&
            this.flags.equals(Number(other.flags)) &&
            JSON.stringify(this.extraData ?? {}) ===
                JSON.stringify(other.extraData ?? {}) &&
            this.sourceSlug === other.sourceSlug &&
            JSON.stringify(this.sourceProperties ?? {}) ===
                JSON.stringify(other.sourceProperties ?? {}) &&
            this.highScore === other.highScore &&
            this.highScoreTime === other.highScoreTime &&
            this.highScorePlayedTimestamp === other.highScorePlayedTimestamp &&
            this.totalScore === other.totalScore &&
            this.totalTime === other.totalTime &&
            this.totalPlays === other.totalPlays &&
            this.lastScore === other.lastScore &&
            this.lastTime === other.lastTime &&
            this.lastPlayedTimestamp === other.lastPlayedTimestamp &&
            this.createdTimestamp === other.createdTimestamp &&
            this.editedTimestamp === other.editedTimestamp &&
            this.updatedTimestamp === other.updatedTimestamp
        );
    }

    public override toJSON() {
        return {
            ...super.toJSON(),
            slug: this.slug,
            creatorId: this.creatorId,
            mode: this.mode,
            title: this.title,
            shortDescription: this.shortDescription,
            longDescription: this.longDescription,
            thumbnailUrl: this.thumbnailUrl,
            categories: this.categories,
            flags: Number(this.flags),
            extraData: this.extraData,
            sourceSlug: this.sourceSlug,
            sourceProperties: this.sourceProperties,
            highScore: this.highScore,
            highScoreTime: this.highScoreTime,
            highScorePlayedTimestamp: this.highScorePlayedTimestamp,
            totalScore: this.totalScore,
            totalTime: this.totalTime,
            totalPlays: this.totalPlays,
            lastScore: this.lastScore,
            lastTime: this.lastTime,
            lastPlayedTimestamp: this.lastPlayedTimestamp,
            createdTimestamp: this.createdTimestamp,
            editedTimestamp: this.editedTimestamp,
            updatedTimestamp: this.updatedTimestamp,
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

    public get [Symbol.toStringTag]() {
        return 'Game';
    }
}

export namespace Game {
    export type Resolvable = Game | Types.APIGame | Entity<Mode> | string;
    export type Entity<M extends Mode = Mode> = Types.Game.Entity<M>;

    export type Mode = Types.Game.Mode;
    export const Mode = Types.Game.Mode;
    export const ModeNames = Types.Game.ModeNames;
    export type Flags = Types.Game.Flags;
    export const Flags = Types.Game.Flags;

    export type Extra<M extends Mode = Mode> = Types.Game.Extra<M>;
    export type Item<M extends Mode = Mode> = Types.Game.Item<M>;
    export type Step<M extends Mode = Mode> = Types.Game.Step<M>;
}
