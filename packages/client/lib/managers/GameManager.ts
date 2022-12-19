import { type FetchGamesOptions, Routes } from '@owenii/types';
import { MapManager } from './BaseManager';
import type { Client } from '#/client/Client';
import { Game } from '#/structures/Game';
import { User } from '#/structures/User';

export class GameManager<U extends boolean = boolean> //
    extends MapManager<string, Game>
{
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

        const entry = new Game(this.client, data);
        this.set(entry.id, entry);
        return entry;
    }

    public async fetchCategories(): Promise<string[]> {
        const path = this.user
            ? Routes.userCategories(this.user.id)
            : Routes.categories();
        const data = await this.client.rest.get(path);
        return data.items;
    }

    public async fetchOne(game: Game.Resolvable, force = false) {
        const id = Game.resolveId(game) ?? 'unknown';

        if (!force) {
            const existing = this.get(id);
            if (existing) return existing;
        }

        const path = this.user
            ? Routes.userGame(this.user.id, id)
            : Routes.game(id);
        const data = await this.client.rest.get(path);
        return this._add(data);
    }

    public async fetchMany(options: FetchGamesOptions = {}): Promise<Game[]> {
        const path = this.user
            ? Routes.userGames(this.user.id)
            : Routes.games();
        const data = await this.client.rest.get(path, options);
        return data.items.map((dt: Game.Entity) => this._add(dt));
    }
}
