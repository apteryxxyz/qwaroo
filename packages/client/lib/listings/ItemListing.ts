import type { APIGameItem, FetchItemsOptions } from '@qwaroo/types';
import { APIRoutes } from '@qwaroo/types';
import { ValueListing } from './Listing';
import type { Game } from '#/structures/Game';

export class ItemListing<
    I extends APIGameItem = APIGameItem
> extends ValueListing<FetchItemsOptions, I> {
    public game: Game;
    public abortController?: AbortController;

    public constructor(game: Game, options: FetchItemsOptions, total: number) {
        super(game, options, total);
        this.game = game;
    }

    public async fetchMore() {
        this.abortController = new AbortController();
        const path = APIRoutes.gameItems(this.game.id);
        const data = await this.client.api.get(
            path,
            {
                limit: 5,
                skip: this.length,
                ...this.options,
            },
            this.abortController.signal
        );

        if (data.version) this.options.version = data.version;
        if (data.seed) this.options.seed = data.seed;
        if (data.total) this.total = data.total;

        for (const raw of data.items as I[]) this.push(raw);
        return this.slice(this.length - data.items.length, this.length);
    }

    public abort() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    public get [Symbol.toStringTag]() {
        return 'ItemListing';
    }
}
