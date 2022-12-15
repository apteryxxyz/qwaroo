import { Game as GameEntity } from '@owenii/types';
import { Base } from './Base';
import type { Client } from '#/client/Client';
import { ItemManager } from '#/managers/ItemManager';

export class Game<M extends GameEntity.Mode = GameEntity.Mode> extends Base {
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
    public createdTimestamp!: number;
    public updatedTimestamp!: number;

    public constructor(
        client: Client,
        data: Partial<Game.Entity<M>> & { id: string }
    ) {
        super(client, data);
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
        if (data.createdTimestamp)
            this.createdTimestamp = data.createdTimestamp;
        if (data.updatedTimestamp)
            this.updatedTimestamp = data.updatedTimestamp;

        return data;
    }

    public get partial() {
        return this.slug === undefined;
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get updatedAt() {
        return new Date(this.updatedTimestamp);
    }

    public override equals(other: Game) {
        return (
            other.id === this.id &&
            other.slug === this.slug &&
            other.mode === this.mode &&
            other.title === this.title &&
            other.shortDescription === this.shortDescription &&
            other.longDescription === this.longDescription &&
            other.thumbnailUrl === this.thumbnailUrl &&
            other.categories === this.categories &&
            other.data === this.data &&
            other.createdTimestamp === this.createdTimestamp &&
            other.updatedTimestamp === this.updatedTimestamp
        );
    }

    public async fetch() {
        return this.client.games.fetch(this.id);
    }

    public async fetchCreator() {
        return this.client.users.fetch(this.creatorId);
    }

    public async fetchItems() {
        // Idk why but it doesn't work without the type assertion
        const manager = new ItemManager<M>(this) as ItemManager<M>;
        await manager.fetchMore();
        return manager;
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
