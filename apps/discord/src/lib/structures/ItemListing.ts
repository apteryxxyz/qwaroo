import type { Game } from '@qwaroo/server';
import { Items } from '@qwaroo/server';
import type { APIGameItem } from '@qwaroo/types';

export class ItemListing<V extends APIGameItem> extends Array<V> {
    public game: Game.Document;

    public version?: string;
    public seed?: string;
    public total?: number;

    public constructor(game: Game.Document) {
        super();
        this.game = game;
    }

    public async fetchMore() {
        const [meta, items] = await Items.getItems(
            this.game,
            await this._buildOptions()
        );

        if (meta.version) this.version = meta.version;
        if (meta.seed) this.seed = meta.seed;
        if (meta.total) this.total = meta.total;

        for (const raw of items) this.push(raw as unknown as V);
        return this.slice(this.length - items.length, this.length);
    }

    private _generateSeed() {
        return Math.random().toString(36).slice(2);
    }

    private _fetchLatestVersion() {
        return Items.getItemsVersions(this.game) //
            .then(versions => versions.at(-1) ?? '1');
    }

    private async _buildOptions() {
        const seed = this.seed ?? this._generateSeed();
        const version = this.version ?? (await this._fetchLatestVersion());

        return {
            limit: 5,
            skip: this.length,
            seed,
            version,
        } as const;
    }

    public get [Symbol.toStringTag]() {
        return 'ItemListing';
    }
}
