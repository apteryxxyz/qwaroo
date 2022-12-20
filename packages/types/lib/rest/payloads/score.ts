import type { Game } from '#/models/Game';
import type { Score } from '#/models/Score';

export type APIScore = Score;

export interface APISubmitScore<M extends Game.Mode> {
    seed: string;
    time: number;
    steps: Game.Step<M>[];
}

export interface FetchScoresOptions {
    term?: string;
    limit?: number;
    skip?: number;
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
    ids?: string[];
}
