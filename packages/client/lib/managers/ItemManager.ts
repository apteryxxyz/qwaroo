import { Routes } from '@owenii/types';
import { ArrayManager } from './BaseManager';
import type { Game } from '#/structures/Game';

export class ItemManager<
    M extends Game.Entity.Mode = Game.Entity.Mode
> extends ArrayManager<Game.Entity.Item<M>> {
    public game: Game;
    public seed!: string;
    public total!: number;

    public constructor(game: Game) {
        super(game.client);
        this.game = game;
    }

    private _add(data: Game.Entity.Item<M>) {
        this.push(data);
        return data;
    }

    public async fetchMore(options: ItemManager.FetchMoreOptions = {}) {
        if (this.seed) options.seed = this.seed;
        if (options.limit === undefined) options.limit = 5;
        if (options.skip === undefined) options.skip = this.length;

        const path = Routes.gameItems(this.game.id);
        const data = await this.client.rest.get(path, options);

        if (!this.seed) this.seed = data.seed;
        if (!this.total) this.total = data.total;
        return data.items.map((dt: Game.Entity.Item<M>) => this._add(dt));
    }
}

export namespace ItemManager {
    export interface FetchMoreOptions {
        seed?: string;
        limit?: number;
        skip?: number;
    }
}
