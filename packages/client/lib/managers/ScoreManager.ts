import type { APIScore, FetchScoresOptions } from '@qwaroo/types';
import { APIRoutes } from '@qwaroo/types';
import { Manager } from './Manager';
import { ScoreListing } from '#/listings/ScoreListing';
import { Game } from '#/structures/Game';
import { Score } from '#/structures/Score';
import type { User } from '#/structures/User';

export class ScoreManager<P extends Game | User> extends Manager<
    string,
    Score
> {
    public parent: P;

    public constructor(parent: P) {
        super(parent);
        this.parent = parent;
    }

    public append(data: APIScore): Score<P> {
        if (this.has(data.id)) {
            const existing = this.get(data.id)!;
            return existing.patch(data) as Score<P>;
        }

        const entry = new Score<P>(this, data);
        this.set(entry.id, entry);
        return entry;
    }

    /** Fetch a single score. */
    public async fetchOne(
        score:
            | Score.Resolvable
            | (P extends Game ? Game.Resolvable : User.Resolvable),
        force = false
    ): Promise<Score> {
        const id = Score.resolveId(score) ?? 'unknown';
        if (force && this.has(id)) return this.get(id)!;

        const path =
            this.parent instanceof Game
                ? APIRoutes.gameScore(this.parent.id, id)
                : APIRoutes.userScore(this.parent.id, id);
        const data = await this.client.api.get(path);
        return this.append(data);
    }

    /** Fetch a paged score listing. */
    public async fetchMany(options: FetchScoresOptions = {}) {
        const listing = new ScoreListing<P>(this, options, -1);
        await listing.fetchMore();
        return listing;
    }

    public get [Symbol.toStringTag]() {
        return 'ScoreManager';
    }
}
