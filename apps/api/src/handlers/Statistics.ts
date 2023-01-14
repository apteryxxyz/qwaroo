import { Game, type GameDocument } from '@qwaroo/database';

export class Statistics extends null {
    /** Get the totals for one or all games. */
    public static async getGameTotals(game: GameDocument | undefined) {
        const games = game ? [game] : await Game.find().exec();

        return {
            totalScore: [...games].reduce((a, b) => a + b.totalScore, 0),
            totalPlays: [...games].reduce((a, b) => a + b.totalPlays, 0),
            totalTime: [...games].reduce((a, b) => a + b.totalTime, 0),
        };
    }
}
