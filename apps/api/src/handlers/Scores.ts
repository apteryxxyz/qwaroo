import { ServerError as Error, Validate } from '@qwaroo/common';
import type {
    GameDocument,
    ScoreDocument,
    UserDocument,
} from '@qwaroo/database';
import { Score } from '@qwaroo/database';
import type { APISubmitScore, FetchScoresOptions, Game } from '@qwaroo/types';
import { Replay } from './Replay';

export class Scores extends null {
    /** Get all of the scores for a user. */
    public static async getScores(
        user: UserDocument,
        options: FetchScoresOptions = {}
    ) {
        let query = Score.find({ userId: user.id });

        const sort = String(options.sort ?? 'highScore').trim();
        // prettier-ignore
        if (![
            'highScore', 'highScoreTime', 'highScoreTimestamp',
            'totalScore', 'totalTime', 'totalPlays',
            'firstPlayedTimestamp', 'lastPlayedTimestamp',
        ].includes(sort)) throw new Error(422, 'Sort is invalid');

        const order = String(options.order ?? 'desc').trim();
        if (!['asc', 'desc'].includes(order))
            throw new Error(422, 'Order is invalid');

        query = query.sort({ [sort]: order === 'asc' ? 1 : -1 });

        const limit = Math.min(Math.max(Number(options.limit ?? 20), 1), 100);
        if (Number.isNaN(limit)) throw new Error(422, 'Limit must be a number');

        const skip = Math.max(Number(options.skip ?? 0), 0);
        if (Number.isNaN(skip)) throw new Error(422, 'Skip must be a number');

        const total = await Score.find().merge(query).countDocuments().exec();
        const scores = await query.limit(limit).skip(skip).exec();

        return [{ total, limit, skip }, scores] as const;
    }

    /** Get a users score by its ID. */
    public static async getScoreById(user: UserDocument, id: string) {
        const isValidId = Validate.ObjectId.test(id);
        if (!isValidId) throw new Error(422, 'Score ID is invalid');

        const score = await Score.findOne({ userId: user.id, id }).exec();
        if (!score) throw new Error(404, 'Score was not found');

        return score;
    }

    /** Ensure that a user has as score document for a game. */
    public static async ensureScore(
        user: UserDocument,
        game: GameDocument
    ): Promise<ScoreDocument> {
        let score = await Score.findOne({
            userId: user.id,
            gameId: game.id,
        }).exec();

        if (!score)
            score = await Score.create({
                userId: user.id,
                gameId: game.id,
            });

        return score;
    }

    /** Submit a new score to the database. */
    public static async submitScore(
        user: UserDocument | undefined,
        game: GameDocument,
        save: APISubmitScore<Game.Mode>
    ) {
        const { score: finalScore, time } = await Replay.replayGame(game, save);

        game.totalScore += finalScore;
        game.totalTime += time;
        game.totalPlays += 1;
        game.lastPlayedTimestamp = Date.now();

        await game.save();

        // If the user is logged in, update their score, otherwise they are a guest
        if (user) {
            const score = await Scores.ensureScore(user, game);

            if (finalScore > (score.highScore ?? 0)) {
                score.highScore = finalScore;
                score.highScoreTime = time;
                score.highScoreTimestamp = Date.now();
            }

            score.totalScore += finalScore;
            score.totalTime += time;
            score.totalPlays += 1;
            score.lastPlayedTimestamp = Date.now();

            return score.save();
        }

        return undefined;
    }
}
