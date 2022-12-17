/** The score data structure. */
export interface Score<H extends boolean = boolean> {
    /** The unique identifier for this score. */
    id: string;
    /** The ID of the user that this score belongs to. */
    userId: string;
    /** The ID of the game that this score is for. */
    gameId: string;

    /** The highest score the user has gotten. */
    highScore: H extends true ? number : undefined;
    /** The time it took to get the highest score. */
    highScoreTime: H extends true ? number : undefined;
    /** The timestamp when the highest score was achieved. */
    highScoreTimestamp: H extends true ? number : undefined;

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
