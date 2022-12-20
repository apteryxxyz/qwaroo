import { type FetchGamesOptions, Routes } from '@owenii/types';
import { MapManager } from './BaseManager';
import type { Client } from '#/client/Client';
import { Game } from '#/structures/Game';
import { User } from '#/structures/User';

/** A manager for games. */
export class GameManager<U extends boolean = boolean> //
    extends MapManager<string, Game>
{
    /** Optional, the creator of the games to get. */
    public user?: U extends true ? User : undefined;

    public constructor(parent: Client | User) {
        super(parent);
        // @ts-expect-error 2322
        if (parent instanceof User) this.user = parent;
    }

    private _add(data: Game.Entity) {
        const existing = this.get(data.id);

        if (existing) {
            existing._patch(data);
            return existing;
        }

        // Need to cast here for some reason idk
        const entry = new Game(this, data) as Game;
        this.set(entry.id, entry);
        return entry;
    }

    /** Fetch all game categories. */
    public async fetchCategories(): Promise<string[]> {
        const path = this.user
            ? Routes.userCategories(this.user.id)
            : Routes.categories();
        const data = await this.client.rest.get(path);
        return data.items;
    }

    /** Fetch a single game. */
    public async fetchOne(game: Game.Resolvable, force = false) {
        const id = Game.resolveId(game) ?? 'unknown';

        if (!force) {
            const existing = this.get(id);
            if (existing) return existing;
        }

        const path = Routes.game(id);
        const data = await this.client.rest.get(path);
        return this._add(data);
    }

    /** Fetch a page of games. */
    public async fetchMore(options: FetchGamesOptions = {}) {
        if (options.limit === undefined) options.limit = 20;
        if (options.skip === undefined) options.skip = this.size;
        return this.fetchMany(options);
    }

    /** Fetch many games. */
    public async fetchMany(options: FetchGamesOptions = {}): Promise<Game[]> {
        const path = this.user
            ? Routes.userGames(this.user.id)
            : Routes.games();
        const data = await this.client.rest.get(path, options);
        return data.items.map((dt: Game.Entity) => this._add(dt));
    }
}
