import { ServerError as Error, Validate } from '@qwaroo/common';
import { Score } from '@qwaroo/database';
import type { APISubmitScoreOptions, FetchScoresOptions } from '@qwaroo/types';
import { Replay } from './Replay';
import type { User } from '#/utilities/structures';
import { Game } from '#/utilities/structures';

export class Scores extends null {
    public static async getScore(
        parent: Game.Document | User.Document,
        childId: string
    ) {
        if (!Validate.ObjectId.test(childId))
            throw new Error(422, 'Game, user or score ID is not valid');

        const score = await Score.Model.findOne(
            parent instanceof Game.Model
                ? {
                      gameId: parent.id,
                      $or: [{ userId: childId }, { _id: childId }],
                  }
                : {
                      userId: parent.id,
                      $or: [{ gameId: childId }, { _id: childId }],
                  }
        );
        if (!score) throw new Error(404, 'Score not found');

        return score;
    }

    public static async getScores(
        parent: Game.Document | User.Document,
        options: FetchScoresOptions = {}
    ) {
        const limit = Math.min(Math.max(options.limit ?? 20, 0), 100);
        if (typeof limit !== 'number')
            throw new Error(422, 'Limit must be a number');
        const skip = Math.max(options.skip ?? 0, 0);
        if (typeof skip !== 'number')
            throw new Error(422, 'Skip must be a number');

        const query = Score.Model.find();

        if (parent instanceof Game.Model)
            void query.where('gameId').equals(parent.id);
        else void query.where('userId').equals(parent.id);

        const sort = String(options.sort ?? 'highScore').trim();
        // prettier-ignore
        if (![
            'highScore', 'highScoreTime', 'highScoreTimestamp',
            'totalScore', 'totalTime', 'totalPlays',
            'lastScore', 'lastTime', 'lastPlayedTimestamp',
            'firstPlayedTimestamp',
        ].includes(sort)) throw new Error(422, 'Sort is not valid');

        const order = String(options.order ?? 'desc').trim();
        if (!['asc', 'desc'].includes(order))
            throw new Error(422, 'Order is not valid');

        void query.sort({ [sort]: order === 'asc' ? 1 : -1 });

        const total = await Score.Model.find(query).countDocuments().exec();
        const scores = await query.limit(limit).skip(skip).exec();

        return [{ total, limit, skip }, scores] as const;
    }

    public static async ensureScore(user: User.Document, game: Game.Document) {
        let score = await Score.Model.findOne({
            userId: user.id,
            gameId: game.id,
        }).exec();

        if (!score)
            score = await Score.Model.create({
                userId: user.id,
                gameId: game.id,
            });

        return score;
    }

    public static async submitScore(
        user: User.Document | undefined,
        game: Game.Document,
        options: APISubmitScoreOptions
    ) {
        const version = String(options.version ?? '').trim();
        if (!version) throw new Error(422, 'Version must be a string');
        const seed = String(options.seed ?? '').trim();
        if (!seed) throw new Error(422, 'Seed must be a string');

        if (typeof options.time !== 'number')
            throw new Error(422, 'Time must be a number');
        if (options.time < 10 || options.time > 10_000_000)
            throw new Error(422, 'Time is out of range');
        if (!Array.isArray(options.steps))
            throw new Error(422, 'Steps must be an array');

        const { score: finalScore, time: finalTime } = await Replay.replayGame(
            game,
            options
        );

        game.totalScore += finalScore;
        game.totalTime += finalTime;
        game.totalPlays += 1;

        game.lastScore = finalScore;
        game.lastTime = finalTime;
        game.lastPlayedTimestamp = Date.now();

        if (finalScore > game.highScore) {
            game.highScore = finalScore;
            game.highScoreTime = finalTime;
            game.highScorePlayedTimestamp = Date.now();
        }

        await game.save();

        // If the user is logged in, update their score, otherwise they are a guest
        if (user) {
            const score = await Scores.ensureScore(user, game);

            score.totalScore += finalScore;
            score.totalTime += finalTime;
            score.totalPlays += 1;

            score.lastScore = finalScore;
            score.lastTime = finalTime;
            score.lastPlayedTimestamp = Date.now();

            if (finalScore > score.highScore) {
                score.highScore = finalScore;
                score.highScoreTime = finalTime;
                score.highScorePlayedTimestamp = Date.now();
            }

            return score.save();
        }

        return undefined;
    }
}
