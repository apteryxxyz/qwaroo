import type { APIGame, FetchGamesOptions } from '@qwaroo/types';
import { APIRoutes } from '@qwaroo/types';
import { Listing } from './Listing';
import type { GameManager } from '#/managers/GameManager';
import type { Game } from '#/structures/Game';

export class GameListing extends Listing<FetchGamesOptions, Game, APIGame> {
    public manager: GameManager;
    public abortController?: AbortController;

    public constructor(
        manager: GameManager,
        options: FetchGamesOptions,
        total: number
    ) {
        super(manager, options, total);
        this.manager = manager;
    }

    public append(data: APIGame) {
        const game = this.manager.append(data);
        this.set(game.id, game);
        return game;
    }

    public async fetchMore() {
        this.abortController = new AbortController();
        const path = this.manager.user
            ? APIRoutes.userGames(this.manager.user.id)
            : APIRoutes.games();
        const data = await this.client.api.get(
            path,
            {
                limit: 25,
                ...this.options,
                skip: this.size,
            },
            this.abortController.signal
        );

        this.total = data.total;
        return data.items.map((raw: APIGame) => this.append(raw)) as Game[];
    }

    public abort() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    public get [Symbol.toStringTag]() {
        return 'GameListing';
    }
}
