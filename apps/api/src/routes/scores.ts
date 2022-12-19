import { Validate } from '@owenii/common';
import { Routes } from '@owenii/types';
import { Router } from 'express';
import { Games } from '#/handlers/Games';
import { Scores } from '#/handlers/Scores';
import { Users } from '#/handlers/Users';
import { useBody } from '#/middleware/useBody';
import { useMe, useMustBeMe } from '#/middleware/useMe';
import { useMethods } from '#/middleware/useMethods';
import { useToken } from '#/middleware/useToken';
import { handle } from '#/utilities/routeHandler';

export default () => {
    const router = Router();

    router.all(
        Routes.userScores(':userId'),
        useMethods(['GET', 'POST']),
        useBody('json', ['POST']),
        useToken(['GET', 'POST']),
        useMe('userId'),
        useMustBeMe('userId'),
        handle(async (req, res) => {
            const user = await Users.getUser(req.params['userId']);

            if (req.method === 'GET') {
                const opts: Record<string, unknown> = {};
                opts['term'] = String(req.query['term'] ?? '') || undefined;
                opts['limit'] = Number(req.query['limit'] ?? 0) || undefined;
                opts['skip'] = Number(req.query['skip'] ?? 0) || undefined;
                opts['sort'] = String(req.query['sort'] ?? '') || undefined;
                opts['order'] = String(req.query['oreder'] ?? '') || undefined;

                const slugs = String(req.query['slugs'] ?? '');
                if (slugs) opts['slugs'] = slugs.split(',');

                const [data, items] = await Scores.getScores(user, opts);
                res.status(200).json({ success: true, ...data, items });
            }

            if (req.method === 'POST') {
                const gameId = String(req.body['game'] ?? '');
                const game = Validate.ObjectId.test(gameId)
                    ? await Games.getGameById(undefined, gameId)
                    : await Games.getGameBySlug(undefined, gameId);

                const score = await Scores.ensureScore(user, game);
                await Scores.updateScore(score, req.body);

                res.status(200).json({ success: true, ...score.toJSON() });
            }
        })
    );

    router.all(
        Routes.userScore(':userId', ':scoreId'),
        useMethods(['GET', 'PATCH', 'DELETE']),
        useToken(['GET', 'PATCH', 'DELETE']),
        useMe('userId'),
        useMustBeMe('userId'),
        handle(async (req, res) => {
            const user = await Users.getUser(req.params['userId']);
            const scoreId = String(req.params['scoreId']);
            const score = await Scores.getScoreById(user, scoreId);
            res.status(200).json({ success: true, ...score.toJSON() });
        })
    );

    return router;
};

export {};
