import { type FetchGameItemsOptions, Routes } from '@owenii/types';
import { ArrayManager } from './BaseManager';
import type { Game } from '#/structures/Game';

export class ItemManager<
    M extends Game.Entity.Mode = Game.Entity.Mode
> extends ArrayManager<Game.Entity.Item<M>> {
    public game: Game;
    public seed!: string;
    public total = 0;

    public constructor(game: Game) {
        super(game.client);
        this.game = game;
    }

    private _add(data: Game.Entity.Item<M>) {
        this.push(data);
        return data;
    }

    public async fetchMore(options: FetchGameItemsOptions = {}) {
        if (options.limit === undefined) options.limit = 5;
        if (options.skip === undefined) options.skip = this.length;
        return this.fetchMany(options);
    }

    public async fetchMany(options: FetchGameItemsOptions = {}) {
        if (this.seed) options.seed = this.seed;
        const path = Routes.gameItems(this.game.id);
        const data = await this.client.rest.get(path, options);
        if (!this.seed) this.seed = data.seed;
        if (!this.total) this.total = data.total;
        return data.items.map((dt: Game.Entity.Item<M>) => this._add(dt));
    }
}
