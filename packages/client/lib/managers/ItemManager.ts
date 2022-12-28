import {
    type FetchGameItemsOptions,
    type Game as GameEntity,
    Routes,
} from '@qwaroo/types';
import { ArrayManager } from './BaseManager';
import type { Game } from '#/structures/Game';

/** A manager for game items. */
export class ItemManager<
    M extends GameEntity.Mode = GameEntity.Mode
> extends ArrayManager<GameEntity.Item<M>> {
    /** The game the items belong to. */
    public game: Game;
    /** The unique seed to get a unique list of items. */
    public seed!: string;
    /** The total amount of items. */
    public total = 0;

    public constructor(game: Game) {
        super(game.client);
        this.game = game;
    }

    private _add(data: GameEntity.Item<M>) {
        this.push(data);
        return data;
    }

    /** Fetch a set amount of additional items. */
    public async fetchMore(options: FetchGameItemsOptions = {}) {
        if (options.limit === undefined) options.limit = 5;
        if (options.skip === undefined) options.skip = this.length;
        return this.fetchMany(options);
    }

    /** Fetch many items. */
    public async fetchMany(
        options: FetchGameItemsOptions = {}
    ): Promise<GameEntity.Item<M>[]> {
        if (this.seed) options.seed = this.seed;
        const path = Routes.gameItems(this.game.id);
        const data = await this.client.rest.get(path, options);
        if (!this.seed) this.seed = data.seed;
        if (!this.total) this.total = data.total;
        return data.items.map((dt: GameEntity.Item<M>) => this._add(dt));
    }
}
