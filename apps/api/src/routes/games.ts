import { handle, useMe, useMethods, useToken } from '@qwaroo/middleware';
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
            const user = userId ? await Users.getUser(userId) : undefined;

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
            const user = userId ? await Users.getUser(userId) : undefined;

            const statistics = await Statistics.getGameStatistics(user);
            res.status(200).json({ success: true, ...statistics });
        })
    );

    router.all(
        [APIRoutes.games(), APIRoutes.userGames(':userId')],
        useMethods(['GET']),
        useToken([]),
        useMe('userId'),
        handle(async (req, res) => {
            const opts: Record<string, unknown> = {};

            opts['ids'] = Array.isArray(req.search['ids'])
                ? req.search['ids']
                : undefined;

            opts['term'] = String(req.search['term'] ?? '') || undefined;
            opts['limit'] = Number(req.search['limit'] ?? 0) || undefined;
            opts['skip'] = Number(req.search['skip'] ?? 0) || undefined;

            opts['sort'] = String(req.search['sort'] ?? '') || undefined;
            opts['order'] = String(req.search['order'] ?? '') || undefined;

            const userId = String(req.params['userId'] ?? '') || undefined;
            const user = userId ? await Users.getUser(userId) : undefined;

            const [data, items] = await Games.getGames(opts, user, req.user);
            res.status(200).json({ success: true, ...data, items });
        })
    );

    router.all(
        [APIRoutes.game(':gameId'), APIRoutes.userGame(':userId', ':gameId')],
        useMethods(['GET']),
        useToken([]),
        useMe('userId'),
        handle(async (req, res) => {
            const userId = String(req.params['userId'] ?? '') || undefined;
            const user = userId ? await Users.getUser(userId) : undefined;

            const gameId = String(req.params['gameId'] ?? '');
            const game = await Games.getGame(gameId, user, true);

            res.status(200).json({ success: true, ...game.toJSON() });
        })
    );

    router.all(
        APIRoutes.gameItems(':gameId'),
        useMethods(['GET']),
        useToken([]),
        handle(async (req, res) => {
            const gameId = String(req.params['gameId'] ?? '');
            const game = await Games.getGame(gameId, req.user);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const opts: any = {};

            opts['seed'] = String(req.search['seed'] ?? '') || undefined;
            opts['version'] = String(req.search['version'] ?? '') || undefined;
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
        })
    );

    return router;
};
