import {
    type APIGame,
    type APISubmitScore,
    Game as GameEntity,
    Routes,
} from '@owenii/types';
import { Base } from './Base';
import type { GameManager } from '#/managers/GameManager';
import { ItemManager } from '#/managers/ItemManager';

/** A game. */
export class Game<M extends GameEntity.Mode = GameEntity.Mode>
    extends Base
    implements APIGame<M>
{
    /** The manager of the game. */
    public games: GameManager;

    public slug!: string;
    public creatorId!: string;
    public sourceSlug?: string;
    public sourceOptions?: Record<string, unknown>;
    public mode!: M;
    public title!: string;
    public shortDescription!: string;
    public longDescription!: string;
    public thumbnailUrl!: string;
    public categories!: string[];
    public data!: GameEntity.Data<M>;
    public totalScore!: number;
    public totalTime!: number;
    public totalPlays!: number;
    public createdTimestamp!: number;
    public updatedTimestamp!: number;
    public lastPlayedTimestamp!: number;

    public constructor(
        games: GameManager,
        data: Partial<Game.Entity<M>> & { id: string }
    ) {
        super(games.client, data);
        this.games = games;
        this._patch(data);
    }

    public override _patch(data: Partial<Game.Entity<M>> & { id: string }) {
        if (data.id) this.id = data.id;
        if (data.slug) this.slug = data.slug;

        if (data.creatorId) this.creatorId = data.creatorId;

        if (data.sourceSlug) this.sourceSlug = data.sourceSlug;
        if (data.sourceOptions) this.sourceOptions = data.sourceOptions;

        if (data.mode) this.mode = data.mode;
        if (data.title) this.title = data.title;
        if (data.shortDescription)
            this.shortDescription = data.shortDescription;
        if (data.longDescription) this.longDescription = data.longDescription;
        if (data.thumbnailUrl) this.thumbnailUrl = data.thumbnailUrl;
        if (data.categories) this.categories = data.categories;
        if (data.data) this.data = data.data;

        if (data.totalScore) this.totalScore = data.totalScore;
        if (data.totalTime) this.totalTime = data.totalTime;
        if (data.totalPlays) this.totalPlays = data.totalPlays;

        if (data.createdTimestamp)
            this.createdTimestamp = data.createdTimestamp;
        if (data.updatedTimestamp)
            this.updatedTimestamp = data.updatedTimestamp;
        if (data.lastPlayedTimestamp)
            this.lastPlayedTimestamp = data.lastPlayedTimestamp;

        return data;
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

    public override equals(other: Game | Game.Entity) {
        return (
            other.id === this.id &&
            other.slug === this.slug &&
            other.creatorId === this.creatorId &&
            other.sourceSlug === this.sourceSlug &&
            JSON.stringify(other.sourceOptions) ===
                JSON.stringify(this.sourceOptions) &&
            other.mode === this.mode &&
            other.title === this.title &&
            other.shortDescription === this.shortDescription &&
            other.longDescription === this.longDescription &&
            other.thumbnailUrl === this.thumbnailUrl &&
            JSON.stringify(other.categories) ===
                JSON.stringify(this.categories) &&
            JSON.stringify(other.data) === JSON.stringify(this.data) &&
            other.createdTimestamp === this.createdTimestamp &&
            other.updatedTimestamp === this.updatedTimestamp &&
            other.lastPlayedTimestamp === this.lastPlayedTimestamp
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
            id: this.id,
            slug: this.slug,
            creatorId: this.creatorId,
            sourceSlug: this.sourceSlug,
            sourceOptions: this.sourceOptions,
            mode: this.mode,
            title: this.title,
            shortDescription: this.shortDescription,
            longDescription: this.longDescription,
            thumbnailUrl: this.thumbnailUrl,
            categories: this.categories,
            data: this.data,
            createdTimestamp: this.createdTimestamp,
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
}

export namespace Game {
    export type Entity<M extends Entity.Mode = Entity.Mode> = GameEntity<M>;
    export namespace Entity {
        export const Mode = GameEntity.Mode;
        export type Mode = GameEntity.Mode;
        export type Data<M extends Mode = Mode> = GameEntity.Data<M>;
        export type Item<M extends Mode = Mode> = GameEntity.Item<M>;
        export type Step<M extends Mode = Mode> = GameEntity.Step<M>;
    }

    export type Resolvable = Game | Entity | string;
}
