import {
    handle,
    useBody,
    useMe,
    useMethods,
    useToken,
} from '@qwaroo/middleware';
import type { Game, User } from '@qwaroo/server';
import { Games, Scores, Users } from '@qwaroo/server';
import { APIRoutes } from '@qwaroo/types';

export default () => {
    const router = require('express').Router();

    router.get(
        APIRoutes.userScores(':userId'),
        useMethods(['GET']),
        useToken([]),
        useMe('userId'),
        handle(async (req, res) => {
            const userId = String(req.params['userId']);
            const user = await Users.getUser(userId, req.user);

            const opts: Record<string, unknown> = {};
            opts['limit'] = Number(req.search['limit'] ?? 0) || undefined;
            opts['skip'] = Number(req.search['skip'] ?? 0) || undefined;
            opts['sort'] = String(req.search['sort'] ?? '') || undefined;
            opts['order'] = String(req.search['order'] ?? '') || undefined;

            const [data, items] = await Scores.getScores(user, opts);
            res.status(200).json({ success: true, ...data, items });
        })
    );

    router.all(
        APIRoutes.gameScores(':gameId'),
        useMethods(['GET', 'POST']),
        useToken([]),
        useBody(['POST']),
        handle(async (req, res) => {
            const gameId = String(req.params['gameId']);
            const game = await Games.getGame(gameId);

            if (req.method === 'GET') {
                const opts: Record<string, unknown> = {};
                opts['limit'] = Number(req.search['limit'] ?? 0) || undefined;
                opts['skip'] = Number(req.search['skip'] ?? 0) || undefined;
                opts['sort'] = String(req.search['sort'] ?? '') || undefined;
                opts['order'] = String(req.search['order'] ?? '') || undefined;

                const [data, items] = await Scores.getScores(game, opts);
                res.status(200).json({ success: true, ...data, items });
            }

            if (req.method === 'POST') {
                await Scores.submitScore(req.user, game, req.body);
                res.status(200).json({ success: true });
            }
        })
    );

    router.all(
        APIRoutes.userScore(':userId', ':scoreOrGameId'),
        useMethods(['GET']),
        useToken([]),
        useMe('userId'),
        handle(async (req, res) => {
            const userId = String(req.params['userId']);
            const user = await Users.getUser(userId, req.user);

            const scoreOrGameId = String(req.params['scoreOrGameId']);
            const score = await Scores.getScore(user, scoreOrGameId);

            res.status(200).json({ success: true, ...score.toJSON() });
        })
    );

    router.all(
        [
            APIRoutes.userScore(':userId', ':scoreOrGameId'),
            APIRoutes.gameScore(':gameId', ':scoreOrUserId'),
        ],
        useMethods(['GET']),
        useToken([]),
        handle(async (req, res) => {
            let childId: string;
            let entity: Game.Document | User.Document;

            if (req.path.includes('user')) {
                const userId = String(req.params['userId']);
                const user = await Users.getUser(userId, req.user);

                childId = String(req.params['scoreOrGameId']);
                entity = user;
            } else {
                const gameId = String(req.params['gameId']);
                const game = await Games.getGame(gameId);

                childId = String(req.params['scoreOrUserId']);
                entity = game;
            }

            const score = await Scores.getScore(entity, childId);
            res.status(200).json({ success: true, ...score.toJSON() });
        })
    );

    return router;
};
