import { ServerError as Error, Validate, createRegExp } from '@owenii/common';
import type {
    GameDocument,
    ScoreDocument,
    UserDocument,
} from '@owenii/database';
import { Score } from '@owenii/database';
import type { APIScoreSave, FetchScoresOptions, Game } from '@owenii/types';
import { Replay } from './Replay';

export class Scores extends null {
    public static async getScores(
        user: UserDocument,
        options: FetchScoresOptions = {}
    ) {
        const { term, limit = 20, skip = 0 } = options;
        if (term && term.length < 1)
            throw new Error(422, 'Search term must be at least 1 character');
        if (typeof limit !== 'number' || Number.isNaN(limit))
            throw new Error(422, 'Limit must be a number');
        if (limit < 1) throw new Error(422, 'Limit must be greater than 0');
        if (typeof skip !== 'number' || Number.isNaN(skip))
            throw new Error(422, 'Skip must be a number');
        if (skip < 0) throw new Error(422, 'Skip must be greater than 0');

        const sorts = [
            'highScore',
            'highScoreTime',
            'highScoreTimestamp',
            'totalScore',
            'totalTime',
            'totalPlays',
            'firstPlayedTimestamp',
            'lastPlayedTimestamp',
        ];
        const { sort = 'highScore', order = 'desc' } = options;
        if (!sorts.includes(sort))
            throw new Error(422, `Sort must be one of "${sorts.join('", "')}"`);
        if (order !== 'asc' && order !== 'desc')
            throw new Error(422, 'Order must be "asc" or "desc"');

        const { slugs } = options;
        if (slugs && !Array.isArray(slugs))
            throw new Error(422, 'IDs must be an array of strings');

        let query = Score.find({ userId: user.id });

        if (term) {
            const title = createRegExp(term, false, 'i');
            query = query.where({ title });
        }

        if (sort && order) {
            const direction = order === 'asc' ? 1 : -1;
            query = query.sort({ [sort]: direction });
        }

        if (slugs?.length) query = query.where({ slug: { $in: slugs } });

        const total = await Score.find().merge(query).countDocuments().exec();
        const scores = await query.limit(limit).skip(skip).exec();

        return [{ total, limit, skip }, scores] as const;
    }

    public static async getScoreById(user: UserDocument, id: string) {
        const isValidId = Validate.ObjectId.test(id);
        if (!isValidId) throw new Error(422, 'Score ID is invalid');

        const score = await Score.findOne({ userId: user.id, id }).exec();
        if (!score) throw new Error(404, 'Score was not found');

        return score;
    }

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

    public static async updateScore(
        scoreDoc: ScoreDocument,
        save: APIScoreSave<Game.Mode>
    ) {
        const game = await scoreDoc.getGame();
        const { score, time } = await Replay.replayGame(game, save);

        if (score > (scoreDoc.highScore ?? 0)) {
            scoreDoc.highScore = score;
            scoreDoc.highScoreTime = time;
            scoreDoc.highScoreTimestamp = Date.now();
        }

        scoreDoc.totalScore += score;
        scoreDoc.totalTime += time;
        scoreDoc.totalPlays += 1;
        scoreDoc.lastPlayedTimestamp = Date.now();

        await scoreDoc.save();

        return scoreDoc;
    }
}
