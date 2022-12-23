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
        useMethods(['GET']),
        useToken(['GET']),
        useMe('userId'),
        handle(async (req, res) => {
            const user = await Users.getUser(req.params['userId']);

            const opts: Record<string, unknown> = {};
            opts['term'] = String(req.query['term'] ?? '') || undefined;
            opts['limit'] = Number(req.query['limit'] ?? 0) || undefined;
            opts['skip'] = Number(req.query['skip'] ?? 0) || undefined;
            opts['sort'] = String(req.query['sort'] ?? '') || undefined;
            opts['order'] = String(req.query['oreder'] ?? '') || undefined;

            const ids = String(req.query['ids'] ?? '');
            if (ids) opts['ids'] = ids.split(',');

            const [data, items] = await Scores.getScores(user, opts);
            res.status(200).json({ success: true, ...data, items });
        })
    );

    router.all(
        Routes.userScore(':userId', ':scoreId'),
        useMethods(['GET', 'PATCH', 'DELETE']),
        useToken(['GET', 'PATCH', 'DELETE']),
        useMe('userId'),
        handle(async (req, res) => {
            const user = await Users.getUser(req.params['userId']);
            const scoreId = String(req.params['scoreId']);
            const score = await Scores.getScoreById(user, scoreId);
            res.status(200).json({ success: true, ...score.toJSON() });
        })
    );

    router.all(
        Routes.gameScore(':gameId'),
        useMethods(['POST']),
        useToken([], ['POST']),
        useBody('json', ['POST']),
        handle(async (req, res) => {
            const gameId = String(req.params['gameId']);
            const game = Validate.ObjectId.test(gameId)
                ? await Games.getGameById(undefined, gameId)
                : await Games.getGameBySlug(undefined, gameId);

            await Scores.submitScore(req.user, game, req.body);
            res.status(200).json({ success: true });
        })
    );

    return router;
};

export {};
