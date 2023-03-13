import type {
    APIGame,
    APIGameStatistics,
    FetchGamesOptions,
} from '@qwaroo/types';
import { APIRoutes } from '@qwaroo/types';
import { Manager } from './Manager';
import type { Client } from '#/client/Client';
import { GameListing } from '#/listings/GameListing';
import { Game } from '#/structures/Game';
import { User } from '#/structures/User';

export class GameManager extends Manager<string, Game> {
    public user?: User;

    public constructor(parent: User | Client) {
        super(parent);
        this.client = parent instanceof User ? parent.client : parent;
        if (parent instanceof User) this.user = parent;
    }

    public append(data: APIGame): Game;
    public append(): null;
    public append(data?: APIGame) {
        if (!data) return null;

        if (this.has(data.id)) {
            const existing = this.get(data.id)!;
            return existing.patch(data);
        }

        const entry = new Game(this, data);
        this.set(entry.id, entry);
        return entry;
    }

    /** Fetch all game categories. */
    public async fetchCategories() {
        const path = this.user
            ? APIRoutes.userGameCategories(this.user.id)
            : APIRoutes.gameCategories();
        const data = await this.client.api.get(path);
        return data.items as string[];
    }

    /** Fetch the statistics for all games. */
    public async fetchStatistics() {
        const path = this.user
            ? APIRoutes.userGameStatistics(this.user.id)
            : APIRoutes.gameStatistics();
        const data = await this.client.api.get(path);
        return data as APIGameStatistics;
    }

    /** Fetch a single game. */
    public async fetchOne(game: Game.Resolvable, force = false) {
        const id = Game.resolveId(game) ?? 'unknown';
        if (force && this.has(id)) return this.get(id)!;

        const path = this.user
            ? APIRoutes.userGame(this.user.id, id)
            : APIRoutes.game(id);
        const data = await this.client.api.get(path);
        return this.append(data);
    }

    /** Fetch a paged game listing. */
    public async fetchMany(options: FetchGamesOptions = {}) {
        const listing = new GameListing(this, options, -1);
        await listing.fetchMore();
        return listing;
    }

    public get [Symbol.toStringTag]() {
        return 'GameManager';
    }
}
