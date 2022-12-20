import type { Game } from '#/models/Game';

export type APIGame<M extends Game.Mode = Game.Mode> = Game<M>;

export type APIGameItem<M extends Game.Mode = Game.Mode> = Game.Item<M>;

export interface FetchGamesOptions {
    term?: string;
    limit?: number;
    skip?: number;
    sort?:
        | 'totalScore'
        | 'totalTime'
        | 'totalPlays'
        | 'lastPlayedTimestamp'
        | 'createdTimestamp'
        | 'updatedTimestamp';
    order?: 'asc' | 'desc';
    slugs?: string[];
    categories?: string[];
    modes?: Game.Mode[];
}

export interface FetchGameItemsOptions {
    seed?: string;
    limit?: number;
    skip?: number;
}
