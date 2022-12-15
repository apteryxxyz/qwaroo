/** The score data structure. */
export interface Score {
    /** The unique identifier for this score. */
    id: string;
    /** The ID of the user that this score belongs to. */
    userId: string;
    /** The ID of the game that this score is for. */
    gameId: string;

    /** The highest score the user has gotten. */
    highestScore: number;
    /** The time it took to get the highest score. */
    highestScoreTime: number;
    /** The timestamp when the highest score was achieved. */
    highestScoreTimestamp: number;

    /** The total score. */
    totalScore: number;
    /** The total time. */
    totalTime: number;
    /** The total number of plays. */
    totalPlays: number;

    /** The timestamp when this user first played this. */
    firstPlayedTimestamp: number;
    /** The timestamp when this user last played this. */
    lastPlayedTimestamp: number;
}
