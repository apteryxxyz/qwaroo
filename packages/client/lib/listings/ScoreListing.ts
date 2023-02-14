import type { APIScore, FetchScoresOptions } from '@qwaroo/types';
import { APIRoutes } from '@qwaroo/types';
import { Listing } from './Listing';
import type { ScoreManager } from '#/managers/ScoreManager';
import type { Game } from '#/structures/Game';
import { Score } from '#/structures/Score';
import type { User } from '#/structures/User';

export class ScoreListing<P extends Game | User> extends Listing<
    FetchScoresOptions,
    Score,
    APIScore
> {
    public manager: ScoreManager<P>;
    public abortController?: AbortController;

    public constructor(
        manager: ScoreManager<P>,
        options: FetchScoresOptions,
        total: number
    ) {
        super(manager, options, total);
        this.manager = manager;
    }

    public append(data: APIScore) {
        const score = new Score<P>(this.manager, data);
        this.set(score.id, score);
        return score;
    }

    public async fetchMore() {
        this.abortController = new AbortController();
        const path = APIRoutes.userScores(this.manager.parent.id);
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
        for (const raw of data.items as APIScore[]) this.append(raw);
        return data.items.map((raw: APIScore) =>
            this.append(raw)
        ) as Score<P>[];
    }

    public abort() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    public get [Symbol.toStringTag]() {
        return 'ScoreListing';
    }
}
