import { type FetchGamesOptions, Routes } from '@owenii/types';
import { MapManager } from './BaseManager';
import { Game } from '#/structures/Game';

export class GameManager extends MapManager<string, Game> {
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
        const data = await this.client.rest.get(Routes.categories());
        return data.items;
    }

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

    public async fetchMany(options: FetchGamesOptions = {}): Promise<Game[]> {
        const path = Routes.games();
        const data = await this.client.rest.get(path, options);
        return data.items.map((dt: Game.Entity) => this._add(dt));
    }
}
