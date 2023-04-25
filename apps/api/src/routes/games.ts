import {
    handle,
    useBody,
    useMe,
    useMethods,
    useToken,
} from '@qwaroo/middleware';
import { Games, Items, Statistics, Users } from '@qwaroo/server';
import { APIRoutes } from '@qwaroo/types';

export default () => {
    const router = require('express').Router();

    router.all(
        [APIRoutes.gameCategories(), APIRoutes.userGameCategories(':userId')],
        useMethods(['GET']),
        useToken([]),
        useMe('userId'),
        handle(async (req, res) => {
            const userId = String(req.params['userId'] ?? '') || undefined;
            const user = userId
                ? await Users.getUser(userId, req.user)
                : undefined;

            const categories = await Games.getCategories(user);
            res.status(200).json({ success: true, items: categories });
        })
    );

    router.all(
        [APIRoutes.gameStatistics(), APIRoutes.userGameStatistics(':userId')],
        useMethods(['GET']),
        useToken([]),
        useMe('userId'),
        handle(async (req, res) => {
            const userId = String(req.params['userId'] ?? '') || undefined;
            const user = userId
                ? await Users.getUser(userId, req.user)
                : undefined;

            const statistics = await Statistics.getGameStatistics(user);
            res.status(200).json({ success: true, ...statistics });
        })
    );

    router.all(
        [APIRoutes.games(), APIRoutes.userGames(':userId')],
        useMethods(['GET', 'PUT']),
        useToken(['PUT']),
        useBody(['PUT']),
        useMe('userId'),
        handle(async (req, res) => {
            const userId = String(req.params['userId'] ?? '') || undefined;
            const user = userId
                ? await Users.getUser(userId, req.user)
                : undefined;

            if (req.method === 'GET') {
                const opts: Record<string, unknown> = {};

                opts['ids'] = Array.isArray(req.search['ids'])
                    ? req.search['ids']
                    : undefined;

                opts['term'] = String(req.search['term'] ?? '') || undefined;
                opts['limit'] = Number(req.search['limit'] ?? 0) || undefined;
                opts['skip'] = Number(req.search['skip'] ?? 0) || undefined;

                opts['sort'] = String(req.search['sort'] ?? '') || undefined;
                opts['order'] = String(req.search['order'] ?? '') || undefined;

                const params = [opts, user, req.user] as const;
                const [data, items] = await Games.getGames(...params);
                res.status(200).json({ success: true, ...data, items });
            }

            if (req.method === 'PUT') {
                const user = req.user!;

                const items = await Items.validateSource(
                    req.body?.sourceSlug,
                    req.body?.sourceProperties
                );
                const game = await Games.createGame(user, req.body);
                await Items.saveItems(game, items[1]);

                res.status(200).json({ success: true, ...game.toJSON() });
            }
        })
    );

    router.all(
        APIRoutes.game(':gameId'),
        useMethods(['GET', 'PATCH']),
        useToken(['PATCH']),
        useBody(['PATCH']),
        handle(async (req, res) => {
            const gameId = String(req.params['gameId'] ?? '');
            const game = await Games.getGame(gameId, req.user, true);

            if (req.method === 'PATCH')
                await Games.updateGame(game, req.user!, req.body);

            res.status(200).json({ success: true, ...game.toJSON() });
        })
    );

    router.all(
        APIRoutes.gameItems(':gameId'),
        useMethods(['GET', 'POST']),
        useToken(['POST']),
        handle(async (req, res) => {
            const gameId = String(req.params['gameId'] ?? '');
            const game = await Games.getGame(gameId, req.user);

            if (req.method === 'GET') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const opts: any = {};

                opts['seed'] = String(req.search['seed'] ?? '') || undefined;
                opts['version'] =
                    String(req.search['version'] ?? '') || undefined;
                opts['limit'] = Number(req.search['limit'] ?? 5);
                opts['skip'] = Number(req.search['skip'] ?? 0);

                if (!opts['seed'] || opts['skip'] === 0)
                    opts['seed'] = Math.random().toString(36).slice(2);
                if (!opts['version'] || opts['skip'] === 0) {
                    const versions = await Items.getItemsVersions(game);
                    opts['version'] = versions.at(-1);
                }

                const [data, items] = await Items.getItems(game, opts);
                res.status(200).json({ success: true, ...data, items });
            }

            if (req.method === 'POST') {
                await Items.updateItems(game, req.user!);
                res.status(200).json({ success: true });
            }
        })
    );

    return router;
};
