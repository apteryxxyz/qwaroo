import type { Base } from './Base';

export namespace Score {
    export interface Entity extends Base.Entity {
        /** The ID of the user that this score belongs to. */
        userId: string;
        /** The ID of the game that this score is for. */
        gameId: string;

        /** The highest score the user has gotten. */
        highScore: number;
        /** The time it took to get the highest score. */
        highScoreTime: number;
        /** The timestamp when the highest score was achieved. */
        highScorePlayedTimestamp: number;

        /** The total score. */
        totalScore: number;
        /** The total time. */
        totalTime: number;
        /** The total number of plays. */
        totalPlays: number;

        /** The score this user last scored. */
        lastScore: number;
        /** The time the last game took. */
        lastTime: number;
        /** The timestamp when this user last played this. */
        lastPlayedTimestamp: number;

        /** The timestamp when this user first played this. */
        firstPlayedTimestamp: number;
    }
}
