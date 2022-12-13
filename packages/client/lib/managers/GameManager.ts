import { Routes } from '@owenii/routes/api';
import { BaseManager } from './BaseManager';
import { Game } from '#/structures/Game';

export class GameManager extends BaseManager<string, Game> {
    public add(data: Game.Entity) {
        const existing = this.get(data.id);

        if (existing) {
            existing._patch(data);
            return existing;
        }

        const entry = new Game(this.client, data);
        this.set(entry.id, entry);
        return entry;
    }

    public fetch(options: Game.Resolvable): Promise<Game>;
    public fetch(options: GameManager.FetchManyOptions): Promise<Game[]>;
    public async fetch(
        options: Game.Resolvable | GameManager.FetchManyOptions
    ) {
        if (Game.isResolvable(options)) return this._fetchSingle(options);
        else return this._fetchMany(options);
    }

    private async _fetchSingle(game: Game.Resolvable) {
        const id = Game.resolveId(game) ?? 'unknown';
        const data = await this.client.rest.get(Routes.game(id));
        return this.add(data);
    }

    private async _fetchMany(options: GameManager.FetchManyOptions) {
        const data = await this.client.rest.get(Routes.games(), options);
        return data.items.map((dt: Game.Entity) => this.add(dt));
    }
}

export namespace GameManager {
    export interface FetchManyOptions {
        term?: string;
        limit?: number;
        skip?: number;
    }
}
