import type { FetchPageOptions } from './common';
import type { Score } from '#/entities/Score';

export type APIScore = Score.Entity;

export interface FetchScoresOptions extends FetchPageOptions {
    sort?:
        | 'highScore'
        | 'highScoreTime'
        | 'highScoreTimestamp'
        | 'totalScore'
        | 'totalTime'
        | 'totalPlays'
        | 'firstPlayedTimestamp'
        | 'lastPlayedTimestamp';
    order?: 'asc' | 'desc';
}

export interface APISubmitScoreOptions<Step = unknown> {
    seed: string;
    version: string;
    time: number;
    steps: Step[];
}
