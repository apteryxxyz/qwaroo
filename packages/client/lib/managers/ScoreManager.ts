import { type FetchScoresOptions, Routes } from '@owenii/types';
import { MapManager } from './BaseManager';
import { Score } from '#/structures/Score';
import type { User } from '#/structures/User';

/** A manager for scores. */
export class ScoreManager extends MapManager<string, Score> {
    /** The user the scores belong to. */
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

    /** Fetch a single score. */
    public async fetchOne(score: Score.Resolvable, force = false) {
        const id = Score.resolveId(score) ?? 'unknown';

        if (!force) {
            const existing = this.get(id);
            if (existing) return existing;
        }

        const path = Routes.userScore(this.user.id, id);
        const data = await this.client.rest.get(path);
        return this._add(data);
    }

    /** Fetch a page of scores. */
    public async fetchMore(options: FetchScoresOptions = {}) {
        if (options.limit === undefined) options.limit = 20;
        if (options.skip === undefined) options.skip = this.size;
        return this.fetchMany(options);
    }

    /** Fetch all scores. */
    public async fetchAll(options: FetchScoresOptions = {}) {
        const path = Routes.userScores(this.user.id);
        const data = await this.client.rest.get(path, options);
        return this.fetchMany({ ...options, limit: data.total, skip: 0 });
    }

    /** Fetch many scores. */
    public async fetchMany(options: FetchScoresOptions = {}): Promise<Score[]> {
        const path = Routes.userScores(this.user.id);
        const data = await this.client.rest.get(path, options);
        return data.items.map((dt: Score.Entity) => this._add(dt));
    }
}
