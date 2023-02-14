/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { APIGameStatistics } from '@qwaroo/types';
import { Game, type User } from '#/utilities/structures';

export class Statistics extends null {
    public static async getGameStatistics(
        user?: User.Document,
        me?: User.Document
    ): Promise<APIGameStatistics> {
        const query = Game.Model.find();

        // Getting a specific users games
        if (user) void query.where('creatorId').equals(user.id);
        // Filter out all the private games, unless the user is the creator
        if (!me || !user || me.id !== user.id)
            void query.where('publicFlags', { $bitsAllSet: Game.Flags.Public });

        const games = await query.exec();
        const lastPlayed = games //
            .sort((a, b) => b.lastPlayedTimestamp - a.lastPlayedTimestamp)[0]!;

        return {
            totalScore: games.reduce((a, b) => a + b.totalScore, 0),
            totalTime: games.reduce((a, b) => a + b.totalTime, 0),
            totalPlays: games.reduce((a, b) => a + b.totalPlays, 0),
            lastScore: lastPlayed.lastScore,
            lastTime: lastPlayed.lastTime,
            lastPlayedTimestamp: lastPlayed.lastPlayedTimestamp,
        };
    }
}
