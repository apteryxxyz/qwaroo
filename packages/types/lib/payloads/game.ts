import type { FetchPageOptions } from './common';
import type { Game } from '#/entities/Game';

export type APIGame<M extends Game.Mode = Game.Mode> = Game.Entity<M>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type APIGameItem<M extends Game.Mode = Game.Mode> = Game.Item<M>;

export interface APIGameStatistics {
    totalScore: number;
    totalTime: number;
    totalPlays: number;
    lastScore: number;
    lastTime: number;
    lastPlayedTimestamp: number;
}

export interface FetchGamesOptions extends FetchPageOptions {
    ids?: string[];

    term?: string;
    sort?:
        | 'highScore'
        | 'highScoreTime'
        | 'highScoreTimestamp'
        | 'totalScore'
        | 'totalTime'
        | 'totalPlays'
        | 'lastPlayedTimestamp'
        | 'createdTimestamp'
        | 'editedTimestamp'
        | 'updatedTimestamp';
    order?: 'asc' | 'desc';
}

export interface FetchItemsOptions extends FetchPageOptions {
    version?: string;
    seed?: string;
}
