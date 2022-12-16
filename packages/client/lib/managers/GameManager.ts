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

    public fetch(options: Game.Resolvable): Promise<Game>;
    public fetch(options: FetchGamesOptions): Promise<Game[]>;
    public async fetch(options: Game.Resolvable | FetchGamesOptions) {
        if (Game.isResolvable(options)) return this._fetchSingle(options);
        else return this._fetchMany(options);
    }

    private async _fetchSingle(game: Game.Resolvable) {
        const id = Game.resolveId(game) ?? 'unknown';
        const data = await this.client.rest.get(Routes.game(id));
        return this._add(data);
    }

    private async _fetchMany(options: FetchGamesOptions) {
        const data = await this.client.rest.get(Routes.games(), options);
        return data.items.map((dt: Game.Entity) => this._add(dt));
    }
}
