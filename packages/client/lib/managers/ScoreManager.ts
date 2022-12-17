import {
    type APIScoreSave,
    type FetchScoresOptions,
    Routes,
} from '@owenii/types';
import { MapManager } from './BaseManager';
import { Game } from '#/structures/Game';
import { Score } from '#/structures/Score';
import type { User } from '#/structures/User';

export class ScoreManager extends MapManager<string, Score> {
    public user: User;

    public constructor(user: User) {
        super(user.client);
        this.user = user;
    }

    private _add(data: Score.Entity) {
        const existing = this.get(data.id);

        if (existing) {
            existing._patch(data);
            return existing;
        }

        const entry = new Score(this, data);
        this.set(entry.id, entry);
        return entry;
    }

    public async fetchOne(score: Score.Resolvable) {
        const id = Score.resolveId(score) ?? 'unknown';
        const path = Routes.userScore(this.user.id, id);
        const data = await this.client.rest.get(path);
        return this._add(data);
    }

    public async fetchMore(options: FetchScoresOptions = {}) {
        if (options.limit === undefined) options.limit = 100;
        if (options.skip === undefined) options.skip = this.size;
        return this.fetchMany(options);
    }

    public async fetchAll(options: FetchScoresOptions = {}) {
        const path = Routes.userScores(this.user.id);
        const data = await this.client.rest.get(path, options);
        return this.fetchMany({ ...options, limit: data.total, skip: 0 });
    }

    public async fetchMany(options: FetchScoresOptions = {}) {
        const path = Routes.userScores(this.user.id);
        const data = await this.client.rest.get(path, options);
        return data.items.map((dt: Score.Entity) => this._add(dt));
    }

    public async submit(
        game: Game.Resolvable,
        save: Omit<APIScoreSave<Game.Entity.Mode>, 'game'>
    ) {
        Reflect.set(save, 'game', Game.resolveId(game));
        const path = Routes.userScores(this.user.id);
        const data = await this.client.rest.post(path, undefined, save);
        return this._add(data);
    }
}
